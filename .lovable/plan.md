

## Plan: Replace Cal.com React Embed with Plain Iframe

### Approach
Use the simplest possible approach — a plain `<iframe>` tag. No JavaScript, no external script loading, maximum reliability.

### Changes

**1. Rewrite `src/components/CalBookingSection.tsx`**
- Remove all `@calcom/embed-react` imports and `useEffect`
- Replace `<Cal>` with a plain `<iframe>` pointing to `https://cal.com/team/brightcap/investorcall?layout=month_view`
- Set fixed height (~700px), full width, no border, `loading="lazy"`
- Keep existing heading, description text, and FadeIn animations

**2. Remove `@calcom/embed-react` dependency**

### Trade-off
No Cal.com JS event API — but as discussed, you'll wire tracking via GTM/GA4 directly in Cal.com's dashboard, which works fine inside iframes.

