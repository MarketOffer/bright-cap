import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

/**
 * Gated summary page. Never linked publicly, never in the sitemap, llms.txt or
 * the prerender pipeline, and always noindex. Access is by personal token only.
 */

interface GatedPayload {
  document: {
    slug: string;
    title: string;
    version: string;
    promoterEntityName: string;
    promoterCompanyNumber: string;
    warningBlockVersion: string;
    warningBlock: string;
  };
  recipient: { fullName: string; email: string };
  tokenExpiresAt: string;
  statementExpiresAt: string;
}

const DENY_MESSAGE: Record<string, string> = {
  flag_off: "This area is not currently available.",
  invalid_token: "This link is not valid. Please use the link sent to you, or request a new one.",
  token_expired: "This link has expired. You can request a fresh one below.",
  token_revoked: "This link is no longer active. You can request a fresh one below.",
  statement_expired:
    "Your investor certification has expired. Certifications last 12 months and must be renewed before we can share this material.",
  statement_revoked: "Your investor certification has been withdrawn.",
  no_statement: "We do not hold a valid investor certification for you.",
  document_unavailable: "This document is not currently available.",
  rate_limited: "Too many attempts. Please try again later.",
  audit_failed: "We could not open this document. Please try again shortly.",
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(iso));

const InvestorSummary = () => {
  const [params] = useSearchParams();
  const token = params.get("t") ?? "";

  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "ready"; payload: GatedPayload }
    | { status: "denied"; reason: string; reissuable: boolean }
  >({ status: "loading" });
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [reissueEmail, setReissueEmail] = useState("");
  const [reissueMessage, setReissueMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!token) {
        setState({ status: "denied", reason: "invalid_token", reissuable: true });
        return;
      }
      const { data, error } = await supabase.functions.invoke("redeem-access-token", {
        body: { token },
      });
      if (cancelled) return;
      if (error || !data?.ok) {
        const reason = (data?.reason as string) ?? "invalid_token";
        setState({
          status: "denied",
          reason,
          reissuable: Boolean(data?.reissuable) || reason === "invalid_token",
        });
        return;
      }
      setState({ status: "ready", payload: data as GatedPayload });
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const download = useCallback(async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const { data, error } = await supabase.functions.invoke("download-document", {
        body: { token },
      });
      if (error) throw error;
      const blob = data instanceof Blob ? data : new Blob([data as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "brightcap-summary.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("The download could not be completed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [token]);

  const requestReissue = async () => {
    setReissueMessage(null);
    const { data } = await supabase.functions.invoke("issue-access-token", {
      body: { email: reissueEmail },
    });
    setReissueMessage(
      (data?.message as string) ??
        "If that address has a valid certification on file, a fresh access link has been sent to it.",
    );
  };

  return (
    <>
      <Helmet>
        <title>Private summary | BrightCap</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        {state.status === "loading" && (
          <p className="text-secondary">Checking your access…</p>
        )}

        {state.status === "denied" && (
          <section>
            <h1 className="text-3xl font-light tracking-tight">Access unavailable</h1>
            <p className="mt-4 text-secondary">
              {DENY_MESSAGE[state.reason] ?? DENY_MESSAGE.invalid_token}
            </p>

            {state.reissuable && (
              <div className="mt-10 max-w-md border border-border p-6">
                <h2 className="text-lg font-normal">Request a new link</h2>
                <p className="mt-2 text-sm text-secondary">
                  Enter the email address you certified with. A fresh link is valid for 14 days.
                </p>
                <div className="mt-4 space-y-3">
                  <Label htmlFor="reissue-email">Email address</Label>
                  <Input
                    id="reissue-email"
                    type="email"
                    value={reissueEmail}
                    onChange={(event) => setReissueEmail(event.target.value)}
                  />
                  <Button onClick={requestReissue} disabled={reissueEmail.trim().length === 0}>
                    Send a new link
                  </Button>
                </div>
                {reissueMessage && (
                  <p className="mt-4 text-sm text-secondary">{reissueMessage}</p>
                )}
              </div>
            )}
          </section>
        )}

        {state.status === "ready" && (
          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">
              Prepared for {state.payload.recipient.fullName}
            </p>
            <h1 className="mt-4 text-3xl font-light tracking-tight">
              {state.payload.document.title}
            </h1>
            <p className="mt-2 text-sm text-secondary">
              Version {state.payload.document.version} · link valid until{" "}
              {formatDate(state.payload.tokenExpiresAt)} · certification valid until{" "}
              {formatDate(state.payload.statementExpiresAt)}
            </p>

            <pre className="mt-10 whitespace-pre-wrap border border-border p-6 text-sm leading-relaxed text-foreground">
              {state.payload.document.warningBlock}
            </pre>

            <div className="mt-10">
              <Button onClick={download} disabled={downloading}>
                {downloading ? "Preparing your copy…" : "Download the summary"}
              </Button>
              <p className="mt-3 text-xs text-secondary">
                Each copy is watermarked with your name, email address and the time of download,
                and is personal to you. Please do not forward it.
              </p>
              {downloadError && (
                <p className="mt-3 text-sm text-destructive">{downloadError}</p>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default InvestorSummary;
