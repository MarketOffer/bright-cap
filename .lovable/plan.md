

## Plan: Add Cal.com Booking Section

### What
Install `@calcom/embed-react` and create a new `CalBookingSection` component that embeds the Cal.com scheduling widget. Place it between `InvestCTASection` and `ContactSection` in the page layout.

### Steps

1. **Install dependency**: `@calcom/embed-react`

2. **Create `src/components/CalBookingSection.tsx`**
   - Wrap the Cal embed in a section with consistent spacing/styling (matching the site's padding pattern)
   - Use the exact Cal.com config provided: namespace `investorcall`, link `team/brightcap/investorcall`, month_view layout, brand color `#3DC9A8`
   - Initialize via `useEffect` with `getCalApi` to set UI options and hide event type details

3. **Update `src/pages/Index.tsx`**
   - Import `CalBookingSection`
   - Insert it between `<InvestCTASection />` and `<ContactSection />`

