import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchRegister, type RegisterRow } from "@/lib/adminApi";

const KIND_LABEL: Record<string, string> = {
  hnw: "High net worth",
  scsi: "Self-certified sophisticated",
};

export const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const statusOf = (row: RegisterRow) => {
  if (row.revokedAt) return { label: "Revoked", variant: "destructive" as const };
  if (!row.isCurrent) return { label: "Expired", variant: "secondary" as const };
  if (row.dueForRecertification) return { label: "Due for renewal", variant: "outline" as const };
  return { label: "Certified", variant: "default" as const };
};

/** Certification register. Financial bands are deliberately absent here. */
const AdminInvestors = () => {
  const [rows, setRows] = useState<RegisterRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const result = await fetchRegister();
        setRows(result.rows);
      } catch (e) {
        setError(e instanceof Error ? e.message : "request_failed");
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        KIND_LABEL[r.statementKind]?.toLowerCase().includes(q),
    );
  }, [rows, query]);

  return (
    <AdminShell title="Certification register">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl tracking-tight">Certification register</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every investor statement on file. Viewing a record is logged.
          </p>
        </div>
        <Input
          placeholder="Search name or email"
          className="max-w-xs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive mb-6">
          {error === "not_authorised"
            ? "Your account does not have permission to view the register."
            : "The register could not be loaded."}
        </p>
      )}

      {!rows && !error && <p className="text-sm text-muted-foreground">Loading register…</p>}

      {rows && (
        <div className="border border-border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Statement</TableHead>
                <TableHead>Signed</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Comms</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const status = statusOf(row);
                return (
                  <TableRow key={row.statementId}>
                    <TableCell>
                      <div className="font-medium">{row.fullName}</div>
                      <div className="text-xs text-muted-foreground">{row.email}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {KIND_LABEL[row.statementKind] ?? row.statementKind}
                      <div className="text-xs text-muted-foreground">
                        {row.qualifyingCriteria.join(", ") || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(row.signedAt)}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(row.expiresAt)}
                      {row.isCurrent && (
                        <div className="text-xs text-muted-foreground">
                          {row.daysRemaining} days left
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm">{row.communicationCount}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        to={`/admin/investors/${row.statementId}`}
                        className="text-sm underline underline-offset-4"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-10">
                    No statements match.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminInvestors;
