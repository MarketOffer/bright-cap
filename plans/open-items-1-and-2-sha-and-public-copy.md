# Open Items 1 and 2 — Solicitor brief

**Prepared 30 July 2026** · Companion to `investor-eligibility-gate-build-brief.md` §10
Two questions for the solicitor. Item 1 gates release of the gated JV Investor Summary. Item 2 gates the public site.

---

## Item 1 — Shareholders' Agreement: what exactly needs confirming

The JV Investor Summary is a financial promotion for an investment in an SPV governed by a Shareholders' Agreement. Before we release it to certified investors, we need to know whether an investor who signs that SHA can end up owing money beyond the amount they originally subscribe. The specific question is whether the SHA contains any **further-funding obligation** — a clause obliging a shareholder to put in additional capital on request (a call, a drawdown mechanic, a commitment to fund cost overruns), or a dilution or default provision that operates as economic compulsion to do so. If the answer is yes in any form, the promotion cannot describe the investment as a fixed-sum commitment, and the warning wording has to change to say plainly that further sums may be required.

The same question runs to **guarantees and indemnities**. We need confirmation whether an incoming investor is asked to give any personal guarantee (typically to a lender), any cross-guarantee of another shareholder's obligations, or any indemnity to the company, the other shareholders or the directors, and if so what the exposure is capped at. A personal guarantee to a lender is a materially different risk profile from an equity subscription and must be disclosed as such — it is the single most common reason a promotion of this type is later held to have been misleading by omission.

Third, the **£420k figure**. The Summary presents £420k as the project cost. We need a written answer to whether that is a **hard cap** the SPV cannot exceed without further investor consent, or an **estimate** which may be exceeded, and if the latter, who funds the overrun and by what mechanism. This connects directly to the first two points: an estimate plus a further-funding clause means the investor's real exposure is open-ended. Related and unresolved: **Open Item 7 (SDLT basis)** — whether the acquisition of seven flats in a single transaction is treated as non-residential — sits inside the £420k and moves every return figure, so the cap-versus-estimate answer should be given on a stated SDLT basis.

**What we need back:** a short written note, clause references included, answering (a) is there any further-funding obligation, (b) are there any guarantees or indemnities and what caps apply, (c) is £420k a cap or an estimate and who funds any overrun. Until that note exists, the `gated_summary_delivery` flag stays off and no Summary is delivered by the system.

---

## Item 2 / Slice 0b — Public copy remediation

### Why this matters

Everything on brightcap.capital is an **unrestricted communication**: any member of the public can read it, so none of the FPO exemptions we rely on downstream (arts 48 and 50A, which apply only to certified recipients) are available for it. Section 21 FSMA therefore applies to the page in full — an invitation or inducement to engage in investment activity, communicated in the course of business, must be approved by an authorised person unless exempt. The eligibility gate we have just built solves this for the *Summary*; it does nothing for the public page, and a compliant gate sitting behind non-compliant public copy is the worst of both worlds, because it evidences that we understood the rule.

Two aggravating factors. First, the copy is also machine-readable and quotable — the same figures appear in `index.html`'s pre-rendered SEO content and in `public/llms.txt`, so they are being served to Google and to LLM crawlers as authoritative claims, and will persist in caches after any edit. Second, there is a **second public copy** of the whole site at the Lovable preview URL, which is not indexed but is publicly reachable and carries the same copy.

Separately from s21: the return and performance claims below would need to be **fair, clear and not misleading**, substantiated, and balanced with risk warnings, if they were to appear at all. We hold no substantiation file for any of them.

### What needs to change

| # | Copy | Where | Problem | Action |
|---|---|---|---|---|
| 1 | "Create equity uplift targeting **15–25%**" | `src/components/WhatWeAcquireTimeline.tsx` step 02; `index.html` pre-render; `public/llms.txt` | A specific forward-looking return target on an ungated page. Prospective performance figure with no substantiation, no basis of calculation, no risk balance. Highest-risk item on the site. | Remove the percentage. Describe the activity only: "Create equity uplift — through title splitting and high-spec renovation of each unit." |
| 2 | "**100%** capital growth over the last 20 years" | `CambridgeSection.tsx`, `CambridgeVariantVideo.tsx`, `CambridgeVariantPhotoFirst.tsx`; `index.html`; `public/llms.txt` | Past performance figure presented as a headline statistic with no source, no date range stated on the page, and no "past performance is not a guide to future performance" warning. Reads as an implied return on a BrightCap investment rather than a market statistic. | Either remove, or retain **only** as a sourced market statistic (named index, exact period) with the past-performance warning adjacent. Solicitor to decide which. |
| 3 | "Typical investment amounts range from **£250k to £3m+**" | `InvestorProfileSection.tsx`; `index.html`; `public/llms.txt` | Ticket sizing is an inducement to invest — it tells the reader what to bring. Contributes to the page being an invitation rather than a description of the firm. | Remove from public copy. Move behind the eligibility gate if it is needed at all. |
| 4 | Testimonial ending "...an effortless investment experience with **a great return!**" | `TestimonialSection.tsx`; `index.html`; `public/llms.txt` | A third-party return claim, unquantified and unsubstantiated, used promotionally. Testimonials referring to returns are treated as performance claims. | Remove the final clause, or remove the testimonial. Retain only service-related comment if kept. |
| 5 | Contact-form investment-amount band selector (`<£250k`, `£250k–£500k`, ...) | `ContactSection.tsx` | Same inducement point as #3, and it collects a wealth indicator from uncertified members of the public — a data-minimisation problem as well as a promotion one. | Remove the field from the public form, or move the form behind the gate. |

### Also required

- **Purge the mirrors.** Every fix must be applied in three places — the React component, the pre-rendered `index.html` block, and `public/llms.txt` — or the old figures continue to be served to crawlers. After the edit, re-run the pre-render pipeline and request re-indexing.
- **Put the Lovable preview URL behind access control**, so only one public copy of the site exists.
- **Substantiation file.** Anything retained (realistically only #2, if sourced) needs a written record of its source and calculation, kept for the life of the claim.
- **Sign-off.** The revised copy is reviewed and approved in writing before it goes live.

### Sequencing

None of the above is blocked by Item 1 and it does not touch the eligibility gate — it is an edit to existing marketing copy only. It is held solely on Andy's written approval to change the live site, per the standing rule that no existing public copy is edited without it.

---

*Prepared as a build brief, not legal advice.*
