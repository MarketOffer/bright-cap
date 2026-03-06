import { ArrowRight } from "lucide-react";

const SectionShell = ({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-border bg-card p-4">
      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        {label}
      </span>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);

const copy = {
  heading: "Interested in investing alongside us?",
  body: "If you're looking to grow your wealth through property in one of the world's few cities built to thrive in the AI era — without building your own property team — we'd love to talk.",
};

const InvestCTAComparison = () => (
  <div className="min-h-screen bg-background px-6 py-16 md:px-10">
    <div className="mx-auto max-w-5xl">
      <a
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to site
      </a>
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Invest CTA Section Variants
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Comparing visual treatments for the final CTA block — all use the C1
        ghost button with green arrow.
      </p>

      <div className="mt-16 space-y-20">
        {/* A — Original dark card */}
        <SectionShell
          label="A — Dark Card (Current)"
          description="Near-black rounded card. Matches the investor profile block above — risk of visual repetition."
        >
          <section className="border-t border-border px-0 py-16">
            <div className="relative overflow-hidden rounded-2xl bg-foreground p-10 md:p-14">
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-background md:text-3xl">
                  {copy.heading}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/60 md:text-lg">
                  {copy.body}
                </p>
                <a
                  href="#contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-sm border border-background/20 px-6 py-2.5 text-sm font-medium text-background/70 transition-colors hover:border-background/40 hover:text-background"
                >
                  Invest With Us
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                </a>
              </div>
            </div>
          </section>
        </SectionShell>

        {/* B — Light with accent tint */}
        <SectionShell
          label="B — Cambridge Tint"
          description="Soft pale green/teal background — feels lighter and editorial. Dark text. Distinct from the dark investor block."
        >
          <section className="rounded-2xl bg-primary/[0.06] px-10 py-16 md:px-14 md:py-20">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
              {copy.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {copy.body}
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-sm border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              Invest With Us
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </a>
          </section>
        </SectionShell>

        {/* C — Outlined / bordered card */}
        <SectionShell
          label="C — Outlined Card"
          description="White background with a prominent border and generous padding. Clean, minimal, lets the copy breathe."
        >
          <section className="rounded-2xl border-2 border-border bg-background px-10 py-16 md:px-14 md:py-20">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
              {copy.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {copy.body}
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-sm border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              Invest With Us
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </a>
          </section>
        </SectionShell>

        {/* D — Split layout with accent strip */}
        <SectionShell
          label="D — Accent Strip Layout"
          description="Two-column layout with a vertical Cambridge green accent bar on the left. Adds structure and colour without heaviness."
        >
          <section className="flex overflow-hidden rounded-2xl border border-border bg-background">
            <div className="w-2 shrink-0 bg-primary md:w-3" />
            <div className="px-10 py-16 md:px-14 md:py-20">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
                {copy.heading}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {copy.body}
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-sm border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                Invest With Us
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
              </a>
            </div>
          </section>
        </SectionShell>

        {/* E — Deep Cambridge tone */}
        <SectionShell
          label="E — Deep Cambridge Blue-Green"
          description="Dark but uses a deep Cambridge blue-green tone instead of near-black — differentiates from the investor profile block while staying premium."
        >
          <section className="overflow-hidden rounded-2xl px-10 py-16 md:px-14 md:py-20" style={{ backgroundColor: "hsl(167 30% 18%)" }}>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-background md:text-3xl">
              {copy.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/60 md:text-lg">
              {copy.body}
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-sm border border-background/20 px-6 py-2.5 text-sm font-medium text-background/70 transition-colors hover:border-background/40 hover:text-background"
            >
              Invest With Us
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </a>
          </section>
        </SectionShell>

        {/* F — Stronger tint + primary border */}
        <SectionShell
          label="F — Stronger Tint + Green Border"
          description="Builds on B with a stronger green tint and a Cambridge green border — more presence without going dark."
        >
          <section className="rounded-2xl border-2 border-primary/30 bg-primary/[0.10] px-10 py-16 md:px-14 md:py-20">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
              {copy.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {copy.body}
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-sm border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              Invest With Us
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </a>
          </section>
        </SectionShell>

        {/* G — Accent bar + tint */}
        <SectionShell
          label="G — Left Accent Bar + Tint"
          description="Cambridge tint background with a thick vertical green bar on the left edge — adds structure and colour punch."
        >
          <section className="flex overflow-hidden rounded-2xl bg-primary/[0.06]">
            <div className="w-2 shrink-0 bg-primary md:w-3" />
            <div className="px-10 py-16 md:px-14 md:py-20">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
                {copy.heading}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {copy.body}
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-sm border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                Invest With Us
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
              </a>
            </div>
          </section>
        </SectionShell>

        {/* H — Tint with dark heading strip */}
        <SectionShell
          label="H — Tint + Dark Heading Badge"
          description="Soft green background but the heading sits in a dark pill/strip — creates contrast and a focal point."
        >
          <section className="rounded-2xl bg-primary/[0.06] px-10 py-16 md:px-14 md:py-20">
            <span className="inline-block rounded-full bg-foreground px-5 py-2 text-sm font-semibold tracking-wide text-background">
              Partner With Us
            </span>
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
              {copy.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {copy.body}
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-sm border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              Invest With Us
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </a>
          </section>
        </SectionShell>

        {/* I — Full-width band */}
        <SectionShell
          label="I — Full-Width Cambridge Band"
          description="Breaks out of the card — a full-width Cambridge tint band spanning edge-to-edge for maximum presence."
        >
          <section className="-mx-6 bg-primary/[0.06] px-6 py-16 md:-mx-10 md:px-10 md:py-20">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
                {copy.heading}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {copy.body}
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-sm border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                Invest With Us
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
              </a>
            </div>
          </section>
        </SectionShell>
      </div>
    </div>
  </div>
);

export default InvestCTAComparison;
