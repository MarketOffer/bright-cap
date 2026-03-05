import LogoStripBorderless from "@/components/LogoStripBorderless";
import LogoStripDivider from "@/components/LogoStripDivider";
import LogoStripInset from "@/components/LogoStripInset";
import LogoStripCard from "@/components/LogoStripCard";

const sectionLabel = "font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground text-center pt-10 pb-2";
const fakeBg = "bg-muted/30 py-16 text-center font-serif text-lg text-muted-foreground/50 italic";

const CompareStrips = () => (
  <div className="min-h-screen bg-background">
    {/* Option A */}
    <p className={sectionLabel}>Option A — Borderless White</p>
    <div className={fakeBg}>[ Hero section placeholder ]</div>
    <LogoStripBorderless />

    {/* Option B */}
    <p className={sectionLabel}>Option B — Subtle Divider Line</p>
    <div className={fakeBg}>[ Hero section placeholder ]</div>
    <LogoStripDivider />

    {/* Option C */}
    <p className={sectionLabel}>Option C — Inset / Overlapping Card</p>
    <div className={fakeBg}>[ Hero section placeholder ]</div>
    <LogoStripInset />

    {/* Option D */}
    <p className={sectionLabel}>Option D — Floating Card</p>
    <div className={fakeBg}>[ Hero section placeholder ]</div>
    <LogoStripCard />
  </div>
);

export default CompareStrips;
