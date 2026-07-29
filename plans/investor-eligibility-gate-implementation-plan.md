# BrightCap — Investor Eligibility Gate

**Implementation plan v1** · 29 July 2026
Companion to `investor-eligibility-gate-build-brief.md` (the brief). The brief is the specification; this document is the delivery sequence.

---

## 0. Deltas from the brief

| Brief assumption | Reality | Consequence |
|---|---|---|
| `contacts` table exists and is extended with `alter table` | **No contacts table exists.** No backend at all — BrightCap is a static React SPA with no Lovable Cloud backend provisioned | Slice 0 provisions the backend and *creates* `contacts` from scratch. §7.1 becomes a `create table`, not an `alter` |
| `documents` rows exist to reference | No documents table, no Summary PDF uploaded | Slice 4 creates the table and the seeding procedure |
| Existing outbound sends to retrofit (brief §11, last row) | No CRM or mailing integration exists in this project | The "retrofit" workstream is out of scope; replaced by a documented send-path contract (Slice 6) for whatever tool is adopted later |
| Admin identity exists | No auth in the project | Slice 5 introduces email/password auth + a `user_roles` table for admin-only access |

Everything else in the brief is followed as written.

### Blocking items carried from brief §10

These do not stop the build, but they gate the **release** of the gated Summary:

- **Item 1 (SHA — no further-funding obligation).** Slice 4 ships behind a feature flag; the flag is not turned on until this is confirmed in writing.
- **Item 2 (public page copy).** Slice 1 removes the offending figures from the live site. This is the earliest possible slice because the breach is live now.
- **Item 3 (promoting entity).** Determines whether the art 48(5A) block is static or per-document. Slice 4 stores it per-document either way, so the answer can arrive late.
- **Item 4 (transcription sign-off).** Slice 2 ships the statement component; sign-off must land before Slice 3 goes live to real users.

---

## 1. Slice map

```text
Slice 0  Backend foundation + contacts + CI test harness
Slice 1  Public credentials page + remedial copy fix        (no backend dependency)
Slice 2  Locked statement components (render only, no submit)
Slice 3  Eligibility form + submission pipeline + rejection paths
Slice 4  Documents, tokens, private bucket, watermarked delivery   [flagged]
Slice 5  Admin view + auth + roles + financials permission
Slice 6  Recertification, expiry prompts, send-path contract
```

Each slice ends at a **test gate**. No slice starts until the previous gate is green and signed off in the log at the foot of this document.

---

## Slice 0 — Backend foundation

**Goal:** a provisioned backend, a `contacts` table matching brief §7.1, and a test harness that can run migrations against a scratch state.

### Build

1. Enable Lovable Cloud (Postgres, Auth, Storage, Edge Functions). Confirm the region is UK or EU per brief §9.
2. Create `contacts` — the brief's §7.1 shape plus the base columns it presumes:
   - `id uuid pk`, `full_name text not null`, `email text not null`, `phone text`, `created_at`, `updated_at`
   - `contact_type text[] not null default '{}'` with the `contacts_type_valid` CHECK
   - `marketing_opt_in boolean not null default false`, `marketing_opt_in_at timestamptz`, `privacy_notice_version text`
   - GIN index on `contact_type`; unique index on `lower(email)`
3. `GRANT` block for every new table in the same migration. `contacts` gets **no anon grants** — writes come from Edge Functions on the service role only.
4. Enable RLS on `contacts` with no `anon`/`authenticated` policies.
5. Add a `privacy_notice_versions` lookup (version string, effective_from, body_hash) so acknowledgements point at a real version rather than a free string.
6. Wire `vitest` for the app and a SQL assertion runner for constraint tests.

### Test gate 0

| # | Test | Expected |
|---|---|---|
| 0.1 | Insert contact with `contact_type = '{investor}'` | Succeeds |
| 0.2 | Insert with `contact_type = '{banana}'` | Rejected by `contacts_type_valid` |
| 0.3 | Insert two contacts differing only in email case | Second rejected by `contacts_email_uidx` |
| 0.4 | Select from `contacts` using the anon key | Zero rows / permission denied |
| 0.5 | Migration re-run | Idempotent, no error |
| 0.6 | `bunx vitest run` + production build | Pass |

**Exit criteria:** all six green; region confirmed and recorded.

### Slice 0 result — 29 July 2026

| # | Result |
|---|---|
| 0.1 | Pass — `{investor}` contact inserted |
| 0.2 | Pass — `{banana}` rejected by `contacts_type_valid` |
| 0.3 | Pass — `GATE.ZERO@EXAMPLE.COM` rejected by `contacts_email_uidx` |
| 0.4 | Pass — anon key returns zero rows; no grants exist for `anon`/`authenticated` on `contacts` |
| 0.5 | Pass — migration written idempotently (`if not exists`, `drop policy/trigger if exists`) |
| 0.6 | Pass — `vitest run` 3/3, production build clean |

Delivered: `contacts`, `privacy_notice_versions`, `update_updated_at_column()` trigger function, `src/test/slice0-backend.test.ts`.
Region: **EU — AWS eu-west-1 (Ireland)**, confirmed 29 Jul 2026. Satisfies brief §9 ("UK or EU"). UK–EEA adequacy applies, so no SCCs or transfer risk assessment are required. Region is fixed at provisioning and cannot be changed in place.

---

## Slice 1 — Public page and remedial copy fix

**Goal:** the site stops carrying ungated deal specifics (brief §10 item 2), and a credentials-only page exists with a CTA to the form.

This slice has no backend dependency and can run in parallel with Slice 0.

### Build

1. **Remove from all public routes and from the pre-rendered HTML**: "equity uplift targeting 15–25%", "100% capital growth over the last 20 years", "£250k to £3m+", and any testimonial referencing returns. Sweep `src/`, `index.html`, `public/llms.txt`, `public/sitemap.xml` and the prerender output — the noscript fallback carries the same copy and is equally a communication.
2. Build `/investors` — credentials, track record framed without return figures, strategy, team. No deal specifics, no numbers, no targets.
3. Neutral CTA: "Check your investor eligibility" → `/investors/eligibility`.
4. Put the Lovable preview URL behind access control, or `noindex` + password it. Two public copies of the same breach is two breaches.
5. Re-run the prerender pipeline so the static HTML matches.

### Test gate 1

| # | Test | Expected |
|---|---|---|
| 1.1 | `rg` for each offending phrase across `src/`, `public/`, `index.html`, `dist/` | Zero hits |
| 1.2 | `curl` live + preview origins, grep the same phrases | Zero hits after publish |
| 1.3 | Playwright: `/investors` renders, CTA routes correctly, no numeric return claims in the DOM | Pass |
| 1.4 | Preview origin unauthenticated fetch | Blocked or gated |
| 1.5 | Existing route suite (`/`, `/privacy`, `/terms`, `/cookies`, `/contact`, 404) | Unchanged, canonicals intact |
| 1.6 | Solicitor sign-off on `/investors` copy | Recorded in the log |

**Exit criteria:** 1.1–1.5 green. 1.6 may trail but must land before Slice 3 goes live.

---

## Slice 2 — Locked statement components

**Goal:** both prescribed statements render exactly as SI 2024/301 Schs 3 and 4, in components no future refactor can silently break. Render only — no form state, no submission.

### Build

1. `HNWStatement.tsx` and `SCSIStatement.tsx`, wording verbatim from brief §2.1/§2.2.
2. Bold and underline treated as **content, not style**: semantic `<strong>` / `<u>` inside the component, no Tailwind `font-bold` substitution. Bold thresholds in the HNW statement; **`£1 million` in the SCSI statement is not bold** — do not normalise.
3. Statement bodies live in a single frozen constants module keyed by `statement_version` (`FPO_SCH5_PT1_SI2024-301`, `FPO_SCH5_PT2_SI2024-301`) so a version bump is additive, never an edit.
4. A `renderStatementSnapshot()` helper producing the exact HTML string that will be persisted to `statement_snapshot`.
5. Full name field rendered visually and structurally **outside** the statement block.
6. Declaration ticks: one per declaration line — logged here as a **deliberate deviation** from the prescribed form, added for evidential value, pending sign-off.

### Test gate 2

| # | Test | Expected |
|---|---|---|
| 2.1 | Snapshot test on rendered HTML for both statements | Byte-exact against committed fixtures |
| 2.2 | Assertion that every legally-bold phrase is inside `<strong>` | Pass — fails loudly if a refactor strips it |
| 2.3 | Assertion that `£1 million` in SCSI is **not** bold | Pass |
| 2.4 | Assertion that `NOT` in HNW condition A and B is underlined | Pass |
| 2.5 | Assertion that no name field exists inside the statement DOM subtree | Pass |
| 2.6 | Text-diff the rendered statements against brief §2 line by line | Zero differences |
| 2.7 | Void-figure guard: `rg` for `170,000`, `430,000`, `1.6m` | Zero hits |
| 2.8 | Solicitor sign-off vs the SI images (brief item 4) | Recorded |
| 2.9 | Sign-off on the declaration-tick deviation | Recorded |

**Exit criteria:** 2.1–2.7 green. 2.8 and 2.9 must land before Slice 3 goes live to real users.

---

## Slice 3 — Eligibility form and submission pipeline

**Goal:** a working end-to-end certification: form → server validation → immutable statement record → contact upsert. No document delivery yet; the success screen says "we'll be in touch" rather than issuing a token.

### Build — schema

Migrations exactly as brief §7.2, §7.3, §7.6, §8.1, §8.2:

- `statement_kind` enum; `investor_statements` with all CHECKs, the immutability trigger and the no-delete rule
- `investor_statement_financials` with the rounding CHECKs, RLS, and a **narrower** grant than the other tables
- `promotion_communications` with the `within_validity_window` CHECK
- `v_contact_certification` view; `fn_can_promote()` function
- RLS on all four with **no** anon/authenticated policies; `GRANT`s to `service_role` only

`promotion_communications.document_id` stays nullable until Slice 4 (`documents` doesn't exist yet); the FK is added in Slice 4.

### Build — form

Five steps per brief §4, as a single route with client-side step state and one server submission:

1. Contact — full name, email (lowercased), phone
2. Statement selection — non-exclusive checkboxes; "neither / not sure" routes to §5.4
3. Statement(s) — explicit No/Yes per condition; detail fields conditional on Yes and required when Yes; jurisdiction select beside the Companies House number
4. Declaration ticks (each with its own timestamp) + typed signature + **server-set, non-editable** date
5. Privacy acknowledgement (required, versioned) + marketing opt-in (optional, unbundled)

### Build — Edge Function `submit-eligibility`

Server-side validation is authoritative; the client's is convenience only.

Rejection conditions (brief §5.2), all five, all recorded:
1. "None of these apply" selected
2. All substantive conditions No
3. Any Yes with a blank detail field
4. Contradiction — Yes to a condition *and* Yes to "none of these apply"
5. Any condition unanswered

On valid submission: write the statement row(s) (two rows if both kinds selected), persist `statement_snapshot`, `answers`, `declarations`, `qualifying_criteria`, IP and user agent; write financials if HNW; upsert contact and add `investor` to `contact_type`; record the privacy notice version.

Rejections write to a `certification_attempts` table (same shape, `outcome = 'rejected'` + reason codes) — a record showing you refused someone is worth having, and it must not pollute `investor_statements`.

Rate-limit by IP and email. Never log tokens, signatures or financial figures.

### Test gate 3

**Database**

| # | Test | Expected |
|---|---|---|
| 3.1 | `update investor_statements set signature_typed = 'x'` | Raises "rows are immutable except revocation" |
| 3.2 | `update ... set revoked_at = now(), revoked_reason = '...'` | Succeeds |
| 3.3 | `delete from investor_statements` | Zero rows deleted, no error |
| 3.4 | Insert with `qualifying_criteria = '{}'` | Rejected |
| 3.5 | `hnw` row with `qualifying_criteria = '{C}'` | Rejected |
| 3.6 | `signed_at` in the future | Rejected |
| 3.7 | `expires_at` on a row signed today | Exactly +12 months, generated |
| 3.8 | `income_band = 105000` | Rejected by `income_rounded` |
| 3.9 | `net_assets_band = 250000` | Accepted; `350000` accepted; `275000` rejected |
| 3.10 | Financials row with both bands null | Rejected by `at_least_one` |
| 3.11 | `promotion_communications` insert with `sent_at` one second after `expires_at` | Rejected by `within_validity_window` |
| 3.12 | Same insert one second before | Accepted |
| 3.13 | `fn_can_promote` — valid / expired / revoked / no statement | `ok` / `statement_expired` / `statement_revoked` / `no_statement` |
| 3.14 | `v_contact_certification.due_for_recertification` at 11 months + 1 day | True |
| 3.15 | Anon key select on all four tables | Permission denied |

**Application**

| # | Test | Expected |
|---|---|---|
| 3.16 | Happy path HNW only (Playwright, condition B, £300,000) | Statement + financials row written, contact upserted with `investor` |
| 3.17 | Happy path SCSI only | Statement written, **no** financials row |
| 3.18 | Both selected | **Two** statement rows, distinct `statement_kind` |
| 3.19 | Each of the five rejection conditions | Rejected, `certification_attempts` row written, zero `investor_statements` rows |
| 3.20 | Client validation bypassed — POST a malformed payload directly | Server rejects; no partial write |
| 3.21 | Backdating — POST an explicit past `signed_at` | Ignored; server clock used |
| 3.22 | Yes to SCSI condition B, blank company number | Rejected (condition 3) |
| 3.23 | Duplicate submission, same email | Single contact, two statement rows, no unique violation |
| 3.24 | `statement_snapshot` of a stored row | Byte-matches the Slice 2 fixture |
| 3.25 | Marketing opt-in left unticked | Contact saved, `marketing_opt_in = false` |
| 3.26 | Submit with marketing ticked but privacy unticked | Rejected — acknowledgement required, marketing never bundled |
| 3.27 | Function logs after a full run | No signature, no email body, no financial figure, no token |
| 3.28 | Security scan + dependency scan | Clean or triaged |

**Exit criteria:** all green; Slice 1 test 1.6 and Slice 2 tests 2.8/2.9 signed off.

---

## Slice 4 — Document delivery *(feature-flagged; blocked by brief item 1)*

**Goal:** tokenised access to a watermarked Summary from a private bucket, every view and download logged.

**Do not enable the flag until the SHA is confirmed to contain no further-funding, capital-call, guarantee or indemnity obligation.** Arts 48 and 50A are unavailable if it does, and no amount of engineering fixes that.

### Build

1. `documents` table per brief §7.5; add the `promotion_communications.document_id` FK. Promoter entity and warning-block version are **per document**, never hardcoded.
2. Private Storage bucket. No public policy. Access only via short-TTL signed URLs minted server-side.
3. `access_tokens` per §7.4: ≥128-bit CSRNG token, stored **hashed only**, bound to `contact_id` + `statement_id` + `document_id`, 14-day expiry, self-service re-issue that mints a fresh token.
4. `issue-access-token` — called from the Slice 3 success path once the flag is on.
5. Transactional email (Resend) — **confirmation and access link only, zero deal content**. Include the art 48(5)/(5A)/(7) warning block anyway.
6. `redeem-access-token` — re-check `fn_can_promote` **at redemption time**, not at issue time; increment `use_count`, set `first_used_at`, log a `page_view` row, render the gated page.
7. Watermarking: name, email, timestamp stamped per request. Download logs a `download` row before the stream starts.
8. `X-Robots-Tag: noindex, nofollow` on every handler; never linked publicly; excluded from sitemap, `llms.txt` and the prerender pipeline.

### Test gate 4

| # | Test | Expected |
|---|---|---|
| 4.1 | Token entropy over 10,000 issues | ≥128 bits, no collisions |
| 4.2 | Plaintext token in the DB or in any log | Absent — hash only |
| 4.3 | Redeem a valid token | Gated page renders, `page_view` logged |
| 4.4 | Redeem after statement expiry (clock-shifted) | Denied; nothing served; no `promotion_communications` row (the CHECK would reject it anyway) |
| 4.5 | Redeem a revoked statement's token | Denied |
| 4.6 | Redeem after 14-day token expiry | Denied, self-service re-issue offered |
| 4.7 | Re-issue | New token works, old token dead |
| 4.8 | Tamper a token by one character | Denied, constant-time comparison |
| 4.9 | Direct bucket URL, unauthenticated | 403 |
| 4.10 | Signed URL after TTL | Expired |
| 4.11 | Two contacts download the same document | Watermarks differ, both logged |
| 4.12 | Download | `download` row written **before** the stream |
| 4.13 | Enumeration — 1,000 random token guesses | All denied, rate-limited, alert raised |
| 4.14 | Response headers on gated routes | `X-Robots-Tag: noindex, nofollow` |
| 4.15 | Gated paths in `sitemap.xml`, `llms.txt`, prerender output | Absent |
| 4.16 | Delivery email body | No deal content; warning block present; matches `warning_block_version` |
| 4.17 | Feature flag off | Slice 3 behaviour unchanged, no token issued |
| 4.18 | Written SHA confirmation (brief item 1) | On file before the flag flips |

**Exit criteria:** 4.1–4.17 green **and** 4.18 recorded. The flag stays off otherwise.

---

## Slice 5 — Admin view

**Goal:** a server-rendered, read-only compliance view. Financials behind a separate permission with a logged reveal.

### Build

1. Email/password auth (Lovable Cloud). No public signup for admin — accounts provisioned.
2. `app_role` enum + `user_roles` table + `has_role()` security-definer function, exactly per the roles pattern. **Roles never on a profile row.**
3. Two roles: `admin` (everything except financials) and `compliance` (financials reveal).
4. `/admin/investors` — name, email, statement kind, qualifying criteria, signed date, expiry, days remaining, recertification due, communication count, last access. Data fetched server-side; the anon key never touches these tables.
5. Financials hidden by default. Reveal is an explicit action, `compliance`-only, and writes an `admin_access_log` row. **Log reads, not just writes.**
6. Statement detail view: answers, declarations with their timestamps, the stored HTML snapshot, IP, user agent.
7. Revocation action — the only permitted write; requires a reason.

### Test gate 5

| # | Test | Expected |
|---|---|---|
| 5.1 | `/admin/*` unauthenticated | Redirected, no data in the payload |
| 5.2 | Authenticated non-admin | Denied |
| 5.3 | `admin` role opens the list | Financial columns absent from the **response body**, not merely hidden in CSS |
| 5.4 | `admin` calls the financials endpoint directly | Denied |
| 5.5 | `compliance` reveals financials | Shown; `admin_access_log` row written |
| 5.6 | Client-side role tampering (localStorage, JWT claim edit) | No effect — `has_role()` is server-side |
| 5.7 | Revoke a statement | `revoked_at`/`revoked_reason` set; all other columns unchanged; `fn_can_promote` flips to `statement_revoked` |
| 5.8 | Any other admin update attempt | Blocked by the immutability trigger |
| 5.9 | Snapshot renders in the detail view | Bold and underline intact |
| 5.10 | Security scan | No privilege-escalation finding |

---

## Slice 6 — Recertification and the send-path contract

**Goal:** the 12-month test bites at **every** communication, not once at signup (brief §5.6).

### Build

1. Scheduled job at 11 months → recertification prompt email → link to a fresh form pre-filled with contact fields only (never with prior answers; the statement must be answered afresh).
2. Recertification writes a **new row**. Never an update.
3. Expiry handling: gated access stops the moment `expires_at` passes; the gated page shows a neutral recertify prompt with no deal content.
4. **Send-path contract**, documented and enforced in code: any outbound communication that constitutes a financial promotion must (a) call `fn_can_promote` at send time, (b) write `promotion_communications` **before** dispatch, (c) never cache the result. A shared `sendPromotion()` helper is the only sanctioned path; a lint rule bans direct Resend calls elsewhere.
5. Operational note in the admin view: arts 48(1)(a)/50A cover non-real-time and *solicited* real-time communications. An investor-booked discovery call is covered; a BrightCap-initiated call is not.
6. Retention job: statement + audit log deleted 6 years after the last promotion made in reliance on it. Ships disabled, with a dry-run report.

### Test gate 6

| # | Test | Expected |
|---|---|---|
| 6.1 | Contact at 11 months (clock-shifted) | Prompt sent once, not repeatedly |
| 6.2 | Recertification submitted | New row; old row untouched and still queryable |
| 6.3 | Gated access at expiry + 1s | Denied, neutral prompt, no deal content |
| 6.4 | `sendPromotion()` to an expired contact | Refused before dispatch; nothing sent |
| 6.5 | Attempt to log a communication without a send | Consistency check catches the orphan |
| 6.6 | Direct Resend call added in a test file | Lint rule fails the build |
| 6.7 | `fn_can_promote` result cached anywhere | Code review + grep: no derived boolean on `contacts` |
| 6.8 | Retention dry run | Correct rows identified; nothing deleted while disabled |
| 6.9 | Full regression: Slices 1–5 gates re-run | All green |

---

## 2. Cross-cutting rules

- **Never** store a derived certification boolean on `contacts`. The view and the function are the only sources of truth.
- **Never** grant `anon` or `authenticated` on `investor_statements`, `investor_statement_financials`, `promotion_communications`, `access_tokens`, `documents`, or `certification_attempts`.
- Every `create table` in the `public` schema carries its `GRANT` block in the same migration.
- Nothing sends without logging first.
- No secret, token, signature or financial figure in any log line.
- Statement wording changes are additive — a new `statement_version`, never an edit to an existing one.

## 3. Sequencing and effort

| Slice | Estimate | Can start | Blocked by |
|---|---|---|---|
| 0 | 0.5 day | Now | — |
| 1 | 1 day | Now (parallel with 0) | Solicitor copy sign-off to *go live* |
| 2 | 1 day | Now (parallel) | — |
| 3 | 2.5–3 days | After 0 + 2 | Items 4 and 9 sign-off to go live |
| 4 | 2 days | After 3 | **Brief item 1** to enable |
| 5 | 1.5 days | After 3 | — |
| 6 | 1.5 days | After 4 | — |

**10–11 developer days** including the test gates. Slices 0–3 deliver a legally-sound certification capture with no delivery; that is a coherent stopping point if item 1 stalls.

## 4. Sign-off log

| Item | Owner | Status | Date |
|---|---|---|---|
| **Slice 0 test gate (0.1–0.6)** | Dev | **Green — 29 Jul 2026** | 2026-07-29 |
| Backend region UK/EU confirmed | Dev | **Closed — EU, eu-west-1 (Ireland)** | 2026-07-29 |
| Brief item 2 — public copy remediated and signed off | Solicitor | Open | |
| Brief item 4 — statement transcription vs SI images | Solicitor | Open | |
| Declaration-tick deviation blessed | Solicitor | Open | |
| Brief item 1 — SHA has no further-funding obligation | Solicitor | Open | |
| Brief item 3 — promoting entity | Directors | Open | |
| Brief item 5 — has the Summary already been sent? | Directors | Open | |
| Legitimate interests assessment documented | Directors | Open | |
| DPIA screening recorded | Directors | Open | |

---

*Delivery plan, not legal advice. Statutory positions are taken from the build brief dated 29 July 2026 and inherit its caveats.*
