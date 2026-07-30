import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminShell from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAdminSession } from "@/hooks/useAdminSession";
import {
  fetchFinancials,
  fetchStatement,
  revokeStatement,
  type StatementDetail,
} from "@/lib/adminApi";
import { formatDate } from "./AdminInvestors";

const KIND_LABEL: Record<string, string> = {
  hnw: "High net worth individual",
  scsi: "Self-certified sophisticated investor",
};

const INSTRUMENT_LABEL: Record<string, string> = {
  FPO: "Financial Services and Markets Act 2000 (Financial Promotion) Order 2005 (FPO)",
};

const VERSION_LABEL: Record<string, string> = {
  "FPO_SCH5_PT1_SI2024-301":
    "Schedule 5, Part 1 (High net worth individual statement) of the FPO 2005, as substituted by the Financial Services and Markets Act 2000 (Financial Promotion) (Amendment) Order 2024 (SI 2024/301), Schedule 3 — in force 27 March 2024",
  "FPO_SCH5_PT2_SI2024-301":
    "Schedule 5, Part 2 (Self-certified sophisticated investor statement) of the FPO 2005, as substituted by the Financial Services and Markets Act 2000 (Financial Promotion) (Amendment) Order 2024 (SI 2024/301), Schedule 4 — in force 27 March 2024",
};

/** Plain-English summary of each lettered condition, by statement kind. */
const CRITERIA_LABEL: Record<string, Record<string, string>> = {
  hnw: {
    A: "A — Annual income of £100,000 or more in the last financial year (excluding one-off pension withdrawals).",
    B: "B — Net assets of £250,000 or more (excluding primary residence, pensions and insurance rights).",
  },
  scsi: {
    A: "A — Worked in a professional capacity in private equity, or in providing finance to SMEs, in the last two years.",
    B: "B — Been a director of a company with annual turnover of at least £1 million in the last two years.",
    C: "C — Made two or more investments in an unlisted company in the last two years.",
    D: "D — Been a member of a network or syndicate of business angels for more than six months, and still a member.",
  },
};

const money = (value: number | null) =>
  value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
      }).format(value);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-[10rem_1fr] gap-4 py-2 border-b border-border last:border-0">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm break-words">{value}</dd>
  </div>
);


/** Full statement record. Financial bands stay hidden until explicitly revealed. */
const AdminStatement = () => {
  const { statementId = "" } = useParams();
  const { roles } = useAdminSession();
  const canSeeFinancials = roles.includes("compliance");

  const [detail, setDetail] = useState<StatementDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [financials, setFinancials] = useState<{ incomeBand: number | null; netAssetsBand: number | null } | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [reason, setReason] = useState("");
  const [revoking, setRevoking] = useState(false);

  const load = useCallback(async () => {
    try {
      const result = await fetchStatement(statementId);
      setDetail(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "request_failed");
    }
  }, [statementId]);

  useEffect(() => {
    void load();
  }, [load]);

  const reveal = async () => {
    setRevealing(true);
    try {
      const result = await fetchFinancials(statementId);
      setFinancials(result.financials ?? { incomeBand: null, netAssetsBand: null });
      toast({ title: "Financial detail revealed", description: "This reveal has been logged." });
    } catch (e) {
      toast({
        title: "Not available",
        description:
          e instanceof Error && e.message === "not_authorised"
            ? "Only the compliance role can view financial detail."
            : "The financial detail could not be loaded.",
        variant: "destructive",
      });
    } finally {
      setRevealing(false);
    }
  };

  const revoke = async () => {
    setRevoking(true);
    try {
      await revokeStatement(statementId, reason);
      toast({ title: "Statement revoked", description: "Any outstanding access links were also revoked." });
      setReason("");
      await load();
    } catch (e) {
      const message = e instanceof Error ? e.message : "request_failed";
      toast({
        title: "Revocation failed",
        description:
          message === "reason_required"
            ? "Give a reason of at least 5 characters."
            : message === "already_revoked"
              ? "This statement is already revoked."
              : "The statement could not be revoked.",
        variant: "destructive",
      });
    } finally {
      setRevoking(false);
    }
  };

  return (
    <AdminShell title="Statement record">
      <Link to="/admin/investors" className="text-sm underline underline-offset-4">
        ← Back to register
      </Link>

      {error && (
        <p className="text-sm text-destructive mt-6">
          {error === "not_found" ? "That statement does not exist." : "The record could not be loaded."}
        </p>
      )}

      {!detail && !error && <p className="text-sm text-muted-foreground mt-6">Loading record…</p>}

      {detail && (
        <div className="mt-6 space-y-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl tracking-tight">{detail.contact?.full_name ?? "Unknown contact"}</h1>
              {detail.statement.revokedAt ? (
                <Badge variant="destructive">Revoked</Badge>
              ) : detail.gate?.allowed ? (
                <Badge>Certified</Badge>
              ) : (
                <Badge variant="secondary">Not current</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{detail.contact?.email}</p>
          </div>

          <section>
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Statement</h2>
            <dl>
              <Row label="Type" value={KIND_LABEL[detail.statement.statementKind]} />
              <Row
                label="Qualifying criteria"
                value={
                  detail.statement.qualifyingCriteria.length === 0 ? (
                    "—"
                  ) : (
                    <ul className="list-disc pl-4 space-y-1">
                      {detail.statement.qualifyingCriteria.map((code) => (
                        <li key={code}>
                          {CRITERIA_LABEL[detail.statement.statementKind]?.[code] ?? code}
                        </li>
                      ))}
                    </ul>
                  )
                }
              />
              <Row label="Signed" value={formatDate(detail.statement.signedAt)} />
              <Row label="Expires" value={formatDate(detail.statement.expiresAt)} />
              <Row label="Typed signature" value={detail.statement.signatureTyped} />
              <Row label="Declared name" value={detail.statement.declaredFullName} />

              {detail.statement.revokedAt && (
                <Row
                  label="Revoked"
                  value={`${formatDate(detail.statement.revokedAt)} — ${detail.statement.revokedReason ?? ""}`}
                />
              )}
            </dl>

            <details className="mt-6 border border-border rounded-md p-4">
              <summary className="text-sm uppercase tracking-wider text-muted-foreground cursor-pointer">
                Statement version
              </summary>
              <dl className="mt-3">
                <Row
                  label="Instrument"
                  value={INSTRUMENT_LABEL[detail.statement.instrument] ?? detail.statement.instrument}
                />
                <Row
                  label="Version"
                  value={
                    <>
                      {VERSION_LABEL[detail.statement.statementVersion] ??
                        detail.statement.statementVersion}
                      <span className="block text-xs text-muted-foreground mt-1">
                        Reference: {detail.statement.statementVersion}
                      </span>
                    </>
                  }
                />
              </dl>
            </details>

            <details className="mt-4 border border-border rounded-md p-4">
              <summary className="text-sm uppercase tracking-wider text-muted-foreground cursor-pointer">
                Statement as signed
              </summary>
              <div
                className="statement-snapshot text-sm mt-4 border border-border rounded-md p-6 bg-card overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: detail.statement.snapshot }}
              />
            </details>
          </section>


          <section>
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Contact</h2>
            <dl>
              <Row label="Phone" value={detail.contact?.phone ?? "—"} />
              <Row label="Marketing opt-in" value={detail.contact?.marketing_opt_in ? "Yes" : "No"} />
              <Row label="Opted in at" value={formatDate(detail.contact?.marketing_opt_in_at ?? null)} />
              <Row label="Privacy notice" value={detail.contact?.privacy_notice_version ?? "—"} />
            </dl>
          </section>

          <section>
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Financial detail
            </h2>
            {financials ? (
              <dl>
                <Row label="Income" value={money(financials.incomeBand)} />
                <Row label="Net assets" value={money(financials.netAssetsBand)} />
              </dl>
            ) : (
              <div className="border border-border rounded-md p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Hidden by default. Revealing is restricted to the compliance role and is recorded
                  in the audit log.
                </p>
                <Button variant="outline" onClick={() => void reveal()} disabled={revealing || !canSeeFinancials}>
                  {revealing ? "Revealing…" : canSeeFinancials ? "Reveal financial detail" : "Compliance role required"}
                </Button>
              </div>
            )}
          </section>

          {detail.attempts.length > 0 && (
            <section>
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                Certification episode
              </h2>
              <ul className="space-y-2">
                {detail.attempts.map((attempt) => (
                  <li key={attempt.id} className="text-sm border-b border-border pb-2">
                    {formatDate(attempt.created_at)} ·{" "}
                    {attempt.outcome === "route_declined"
                      ? `Declined the ${
                          attempt.declined_kind ? KIND_LABEL[attempt.declined_kind] : "selected"
                        } basis`
                      : `Rejected — ${attempt.reason_codes.join(", ") || "no reason recorded"}`}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                The bases are independent: declining one does not undermine a statement made on
                the other. Declined declarations cannot be revised.
              </p>
            </section>
          )}


          <section>
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Communications
            </h2>
            {detail.communications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No promotions recorded against this statement.</p>
            ) : (
              <ul className="space-y-2">
                {detail.communications.map((c) => (
                  <li key={c.id} className="text-sm border-b border-border pb-2">
                    {formatDate(c.sent_at)} · {c.channel} · {c.exemption_relied_on}
                  </li>
                ))}
              </ul>
            )}
          </section>




          <section>
            <details>
              <summary className="text-sm uppercase tracking-wider text-muted-foreground cursor-pointer">
                Technical audit trail
              </summary>
              <dl className="mt-3">
                <Row label="IP address" value={detail.statement.ipAddress ?? "—"} />
                <Row label="User agent" value={detail.statement.userAgent ?? "—"} />
                <Row label="Gate status" value={detail.gate?.reason ?? "—"} />
              </dl>
            </details>
          </section>


          {!detail.statement.revokedAt && (
            <section>
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Revoke</h2>
              <div className="border border-border rounded-md p-6 space-y-4 max-w-xl">
                <p className="text-sm text-muted-foreground">
                  Revoking withdraws the certification immediately and kills any outstanding
                  document links. The statement record itself is never deleted.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="revoke-reason">Reason</Label>
                  <Textarea
                    id="revoke-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={() => void revoke()}
                  disabled={revoking || reason.trim().length < 5}
                >
                  {revoking ? "Revoking…" : "Revoke certification"}
                </Button>
              </div>
            </section>
          )}
        </div>
      )}
    </AdminShell>
  );
};

export default AdminStatement;
