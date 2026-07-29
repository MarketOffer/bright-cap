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
              <Row label="Version" value={detail.statement.statementVersion} />
              <Row label="Instrument" value={detail.statement.instrument} />
              <Row label="Qualifying criteria" value={detail.statement.qualifyingCriteria.join(", ") || "—"} />
              <Row label="Signed" value={formatDate(detail.statement.signedAt)} />
              <Row label="Expires" value={formatDate(detail.statement.expiresAt)} />
              <Row label="Typed signature" value={detail.statement.signatureTyped} />
              <Row label="Declared name" value={detail.statement.declaredFullName} />
              <Row label="IP address" value={detail.statement.ipAddress ?? "—"} />
              <Row label="User agent" value={detail.statement.userAgent ?? "—"} />
              <Row label="Gate status" value={detail.gate?.reason ?? "—"} />
              {detail.statement.revokedAt && (
                <Row
                  label="Revoked"
                  value={`${formatDate(detail.statement.revokedAt)} — ${detail.statement.revokedReason ?? ""}`}
                />
              )}
            </dl>
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
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Statement as signed
            </h2>
            <pre className="text-xs whitespace-pre-wrap border border-border rounded-md p-6 bg-card">
              {detail.statement.snapshot}
            </pre>
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
