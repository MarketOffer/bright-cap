// Stream the gated document, watermarked per recipient.
// The `download` audit row is written BEFORE the stream starts.
import { PDFDocument, StandardFonts, degrees, rgb } from "npm:pdf-lib@1.17.1";
import {
  clientMeta,
  corsHeaders,
  DOCUMENT_BUCKET,
  gatedHeaders,
  jsonResponse,
  serviceClient,
  SIGNED_URL_TTL_SECONDS,
} from "../_shared/gatedDelivery.ts";
import {
  enforceClaim,
  logCommunication,
  markTokenUsed,
  resolveToken,
} from "../_shared/tokenAccess.ts";

const REISSUABLE = new Set(["token_expired", "token_revoked"]);

async function watermark(
  bytes: Uint8Array,
  recipient: { fullName: string; email: string },
  stampedAt: Date,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const line = `${recipient.fullName} · ${recipient.email} · ${stampedAt.toISOString()}`;

  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();
    page.drawText(line, {
      x: 24,
      y: 16,
      size: 7,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
    page.drawText(line, {
      x: width * 0.12,
      y: height * 0.35,
      size: 16,
      font,
      color: rgb(0.6, 0.6, 0.6),
      opacity: 0.18,
      rotate: degrees(35),
    });
  }
  return await pdf.save();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  const supabase = serviceClient();
  const { ip, userAgent } = clientMeta(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const token = String((body as { token?: string } | null)?.token ?? "");
  const presentedClaim = String((body as { claim?: string } | null)?.claim ?? "");

  const outcome = await resolveToken(supabase, token, ip, userAgent);
  if (!outcome.ok) {
    console.log("download denied", { reason: outcome.reason });
    return jsonResponse(
      { ok: false, reason: outcome.reason, reissuable: REISSUABLE.has(outcome.reason) },
      outcome.reason === "rate_limited" ? 429 : 403,
    );
  }
  const { value } = outcome;

  const claim = await enforceClaim(supabase, value, presentedClaim, ip, userAgent);
  if (!claim.ok) {
    return jsonResponse({ ok: false, reason: claim.reason, reissuable: true }, 403);
  }

  try {
    await logCommunication(supabase, value, "download", ip, userAgent);
  } catch (error) {
    console.error("download audit write failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return jsonResponse({ ok: false, reason: "audit_failed" }, 500);
  }
  await markTokenUsed(supabase, value);

  // Private bucket: bytes are fetched server-side through a short-TTL signed URL.
  const { data: signed, error: signError } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .createSignedUrl(value.document.storage_path, SIGNED_URL_TTL_SECONDS);

  if (signError || !signed?.signedUrl) {
    console.error("signed url failed", { message: signError?.message ?? "unknown" });
    return jsonResponse({ ok: false, reason: "document_unavailable" }, 500);
  }

  const source = await fetch(signed.signedUrl);
  if (!source.ok) {
    return jsonResponse({ ok: false, reason: "document_unavailable" }, 500);
  }
  const raw = new Uint8Array(await source.arrayBuffer());

  let output = raw;
  try {
    output = await watermark(
      raw,
      { fullName: value.contact.full_name, email: value.contact.email },
      new Date(),
    );
  } catch (error) {
    console.error("watermarking failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return jsonResponse({ ok: false, reason: "watermark_failed" }, 500);
  }

  const filename = `${value.document.slug}-${value.document.version}.pdf`;
  return new Response(output, {
    status: 200,
    headers: gatedHeaders({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    }),
  });
});
