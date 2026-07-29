# Patch v2.1 — Single statement, with route selection

**Patches:** Build brief v2, §4 (Step 2) and §5.2
**Everything else in v2 stands unchanged.**

---

## What we've decided

**An investor completes one statement, not both.**

Arts 48 and 50A are independent alternative bases. Either one, on its own, satisfies the exemption. v2 served both statements when a person indicated they qualified on both grounds — that was an error on my part, not a requirement.

## Why

**Collecting a second statement we don't need is processing without necessity.** Under Art 5(1)(c) UK GDPR, "we gathered both to be thorough" reads as a minimisation failure rather than as diligence. That's the reason that would actually be criticised — the investor's time is a real cost but it's the secondary one.

**The two routes are not equivalent in what they collect.** The self-certified sophisticated route asks for no financial information at all — an organisation name, a company name and number, a count, a network name. Nothing about income or net worth.

That inverts what looks like the obvious default. Most of our target investors would clear the high-net-worth thresholds without difficulty, so HNW seems the natural path. But it's the path that requires someone to disclose a wealth band to a company they haven't yet decided to work with, at the point of first contact. Some will stop at that field. The sophisticated route avoids the disclosure entirely and removes our highest-severity data holding from the record.

**It also gives us better evidence.** The signed statement isn't the whole test — we separately need reasonable grounds to believe the recipient qualifies. A company name and Companies House number can be checked. A self-reported wealth band can't. So the route that collects less personal data happens to produce the stronger evidential position.

## What changes in the flow

**1. Route selection comes first, and it's neutral.**

Before any statutory wording appears, the investor chooses a basis, described in plain English — one based on income or assets, one based on investment and business experience. No statutory text, no tickboxes, nothing that forms part of a declaration.

State plainly that the experience-based route doesn't ask about income or assets. That's a material fact and withholding it would be the wrong kind of quiet.

**2. Serve one statement.**

The chosen route only. Do not present the second statement, and do not prompt for it after a successful submission.

**3. Handle the dead end once.**

If someone picks a route and then declares that none of its conditions apply to them, don't reject them outright — they may genuinely qualify on the other basis. Offer the alternative route a single time.

Two firm rules:

- **The first statement can't be revised.** "None of these apply to me" is a formal declaration on a statutory form. Once made, it stands. Offering a different route is legitimate; letting someone go back and change their answer is not.
- **Record the attempt and its outcome.** A record showing the income route declined and the experience route passed is defensible, because the criteria are independent — wealth and experience are different things. What isn't defensible is a system that lets people retry until something sticks, leaving no trace.

**4. Both routes stay available, but never required.**

If an investor wants to complete the second statement voluntarily, or re-certifies next year on a different basis, the design already supports it. It's simply never asked for.

## Watch out for

**Don't let the route selection become a nudge.** Signposting that one route asks fewer questions is honest. Framing it as the easier option risks steering people toward declaring a criterion they don't actually meet — which undermines the reasonable-grounds limb and puts us in a worse position than the friction ever cost. Informative, not persuasive. Worth a careful read of the copy on that screen.

**Resist the belt-and-braces argument.** Someone will suggest collecting both in case one statement later proves defective. It's not a good trade: you don't build a compliance process on redundancy, and it doesn't justify holding financial data we don't need. The answer to that risk is getting the statement transcription signed off, which is already Open Item 4.

---

*One consequence for the data model: v2 assumed every stored statement is a valid one. Failed attempts now need somewhere to live that doesn't weaken that assumption — worth thinking through before build rather than after.*

---

## Implementation status — complete

- **Data**: `certification_attempts.attempt_group_id` / `declined_kind` (+ `route_declined` outcome), `investor_statements.attempt_group_id`.
- **Server** (`submit-eligibility`): exactly one route per submission (multi-kind payloads are `invalid_payload`); declaring "none apply" records a `route_declined` attempt and returns the alternative once; declining both returns a terminal 422 `both_routes_declined`.
- **Frontend**: neutral basis screen precedes any statutory wording; single statement rendered; declined route is removed from selection and cannot be revisited; "Back" is locked past the basis step once a route has been declined.
- **Admin**: statement detail shows the full certification episode (declined route plus rejections) linked by `attempt_group_id`.
- **Tests**: 63/63 passing, including the inverted two-kind test and the decline/offer/terminal sequence.
