## 1. Where the patch diverges from what's built

The build brief v2 / implementation plan Slice 3 assumed **multi-select**: an investor could tick both statements and we'd store two rows. Patch v2.1 says **one route, one statement**. Concrete divergences:

| # | Patch v2.1 requires | What's in the code today |
|---|---|---|
| A | Neutral route selection in plain English, **before** any statutory wording | `InvestorEligibility.tsx` step 2 shows two checkboxes labelled with the statutory names ("High net worth individual" / "Self-certified sophisticated investor"), and the legend says *"You may select both."* |
| B | Serve exactly one statement | `kinds` is a `StatementKind[]`; step 3 maps over `kinds` and renders one form per selection |
| C | Never write two statements from one submission | `submit-eligibility` loops over `kinds` and inserts one `investor_statements` row per kind (plan test 3.18 explicitly asserts two rows) |
| D | Tell the investor plainly the experience route asks nothing about income or assets | No such copy exists anywhere |
| E | On "none of these apply", offer the **other** route once — no rejection yet | Ticking "Neither of these applies" is a terminal rejection (`none_apply_selected`), and the reject screen offers a generic "Review my answers" button that returns to the full form |
| F | The first statement can't be revised once declared | The client keeps all state; "Review my answers" lets the user go back and flip answers freely |
| G | Record the declined attempt **and** the subsequent outcome, with a visible trail | `certification_attempts` records rejections, but has no notion of "declined route A, passed route B" as a linked pair, and no `attempt_group`/`declined_route` columns |
| H | Failed attempts must not weaken "every stored statement is valid" | Already true structurally (separate table), but there's no link between the declined attempt and the accepted statement |

Two things the patch does **not** change, and which we should keep: both statement definitions stay frozen and available (voluntary second statement, or recertifying on a different basis next year), and every server-side rejection rule in §5.2 stays exactly as-is.

## 2. Surfaces that need updating

**Frontend**
- `src/pages/InvestorEligibility.tsx` — the big one. Steps change from `[Details, Statement, Conditions, Declaration, Privacy]` to `[Details, Basis, Statement, Declaration, Privacy]`; `kinds: StatementKind[]` becomes `kind: StatementKind | null`; new route-selection screen; new "offer the alternative once" screen; back-navigation locked after a route is declined.
- `src/legal/eligibility/contract.ts` — payload shape (`kind` singular, `declinedRoute`, `attemptGroupId`), new plain-English route descriptions, new reason messages (`route_declined_offer_alternative`, `both_routes_declined`).
- `src/components/eligibility/StatementQuestions.tsx` — unchanged in substance; it already renders a single kind.

**Backend**
- `supabase/functions/submit-eligibility/index.ts` — accept a single kind, reject arrays of length > 1, return the "try the other route" outcome instead of a hard rejection on first decline, and refuse a second decline.
- New migration — `certification_attempts` gains `attempt_group_id uuid`, `declined_kind statement_kind`, and `outcome` gains a `'route_declined'` value. Optionally `investor_statements.attempt_group_id` so an accepted statement links back to the declined attempt.
- `supabase/functions/admin-api/index.ts` + `src/pages/admin/AdminInvestors.tsx` — surface the declined-attempt trail beside the accepted statement, so a reviewer sees the full history rather than only the success.

**Docs / tests**
- `plans/investor-eligibility-gate-build-brief.md` §4 Step 2 and §5.2 — annotate as patched by v2.1.
- `plans/investor-eligibility-gate-implementation-plan.md` — Slice 3 test **3.18 ("Both selected → two statement rows") is now a negative test**: a payload with two kinds must be rejected.
- `src/test/slice3-eligibility.test.ts` — rewrite 3.18, add route-decline coverage.

## 3. Implementation plan

**Step 1 — Data model (migration first)**
Add `attempt_group_id`, `declined_kind` to `certification_attempts`; extend the `outcome` CHECK to include `route_declined`; add nullable `attempt_group_id` to `investor_statements` (immutability trigger already allows insert-time values). Grants stay `service_role` only.

**Step 2 — Server contract**
Change `submit-eligibility` to take `kind` (single) plus optional `attemptGroupId` and `declinedKinds[]`. Behaviour:
- More than one kind, or an unknown kind → `invalid_payload`.
- "None of these apply" on the *first* route → write a `route_declined` attempt row, return `{ ok: false, offerAlternative: "<other kind>", attemptGroupId }` — not a terminal rejection.
- "None of these apply" on the *second* route (i.e. the other kind already in `declinedKinds`) → terminal `both_routes_declined` rejection.
- A kind already present in `declinedKinds` submitted again with answers → `invalid_payload`. This is the server-side enforcement of "the first statement can't be revised"; the client lock alone isn't enough.
- Acceptance path: single insert, financials only for HNW, `attempt_group_id` stamped.

**Step 3 — Flow rebuild in the page**
New step order and state. The basis screen carries neutral copy: two plain-English options (income or assets / investment and business experience), with a factual line that the experience-based route asks no questions about income or assets — stated once, not repeated or emphasised, and no "quicker"/"easier" framing. Once a route is submitted and declined, the alternative screen appears once; the "Back" button and the "Review my answers" affordance are removed for that group so a declared route cannot be re-opened. `attemptGroupId` is generated client-side on first submit and echoed on the second.

**Step 4 — Admin, tests, docs**
Extend the admin detail view to list attempts in the same group above the statement. Update `slice3-eligibility.test.ts` (3.18 inverted, plus: decline→alternative→accept writes exactly one statement and two attempt rows; decline→decline is terminal; re-submitting a declined route is refused). Annotate both plan documents with the v2.1 patch and record the divergence in the Slice 3 log.

### Technical notes

- `statementDefinitions.ts` and the statement components are untouched — the frozen statutory wording and the Slice 2 byte-exact fixtures stay valid, so no re-sign-off is needed on Open Item 4.
- The recertification sweep is unaffected: it links to `/investors/eligibility?recertify=1`, which will simply start at the new basis screen. Recertifying on a different basis than last year already works.
- The copy on the basis screen is the compliance-sensitive part of this change (the patch's "watch out for"). I'd suggest I draft it and you read it before it ships, rather than treating it as ordinary UI text.
