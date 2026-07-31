## Goal
Temporarily hide three sections on `/investors` without deleting the code, and trim the intro copy so it reads correctly without them.

## Change (single file: `src/pages/Investors.tsx`)

1. Add a module-level flag near the top:

```ts
// Temporarily hidden — set to true to restore these sections.
const SHOW_DETAIL_SECTIONS = false;
```

2. Wrap these three blocks in `{SHOW_DETAIL_SECTIONS && ( ... )}`:
- Credentials (lines 82–98)
- Track record (lines 100–117)
- How we work (lines 119–138)

The `credentials` and `strategy` data arrays stay in place, unused while hidden.

3. Trim the intro paragraph — remove the trailing sentence so it ends at the joint-ventures clause:

> BrightCap acquires and operates residential blocks in Cambridge, directly and through joint ventures with a small number of partners.

## Remains visible
- Back link, H1 "Investing alongside BrightCap", shortened intro
- "Check your investor eligibility" bordered box and CTA
- Closing disclaimer paragraph
- Navbar, Footer, SEO metadata unchanged

## Notes
- Spacing stays consistent; the eligibility box keeps its `mt-20`.
- Re-enabling is a one-line flip of `SHOW_DETAIL_SECTIONS` (restore the intro sentence at that point too).
