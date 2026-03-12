const TextContent = ({ centered = false, constrained = false }: { centered?: boolean; constrained?: boolean }) => (
  <div className={centered ? "text-center" : ""}>
    <div className={constrained ? "mx-auto max-w-2xl" : ""}>
      <p className="font-sans text-sm font-semibold uppercase tracking-widest text-primary">
        Interested in investing with us?
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
        Book an Investor Discovery Call
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        A no-obligation call to discuss your investment goals, explore our
        Cambridge block strategy, and find out whether there's a genuine fit.
      </p>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        Pick a time that works for you below.
      </p>
    </div>
  </div>
);

const CalPlaceholder = () => (
  <div className="mt-10 flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30" style={{ minHeight: "300px" }}>
    <p className="text-sm text-muted-foreground">[ Cal.com embed here ]</p>
  </div>
);

const VariantCard = ({ label, description, children }: { label: string; description: string; children: React.ReactNode }) => (
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

const BookingComparison = () => (
  <div className="min-h-screen bg-background px-6 py-16 md:px-10">
    <div className="mx-auto max-w-5xl">
      <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to site
      </a>
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Booking Section Layout Variants
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Four text positioning options for the Cal booking CTA — all keep the card at max-w-4xl so the embed stays in month view.
      </p>

      <div className="mt-16 space-y-20">

        {/* Original */}
        <VariantCard
          label="A — Original (Current)"
          description="Left-aligned text, standard padding. Text sits flush top-left which can feel unbalanced in a wide card."
        >
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_12px_48px_-12px_hsl(var(--foreground)/0.10)] md:p-14">
              <TextContent />
              <CalPlaceholder />
            </div>
          </div>
        </VariantCard>

        {/* Centre-aligned */}
        <VariantCard
          label="B — Centre-Aligned Text"
          description="All text centred within the card. Clean, symmetrical, and draws the eye to the middle. Cal embed stays full-width."
        >
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_12px_48px_-12px_hsl(var(--foreground)/0.10)] md:p-14">
              <TextContent centered />
              <CalPlaceholder />
            </div>
          </div>
        </VariantCard>

        {/* More inner padding */}
        <VariantCard
          label="C — Extra Inner Padding"
          description="Left-aligned but with more generous padding inside the card, so text feels more centred and less jammed into the corner."
        >
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-10 shadow-[0_12px_48px_-12px_hsl(var(--foreground)/0.10)] md:px-20 md:py-16">
              <TextContent />
              <CalPlaceholder />
            </div>
          </div>
        </VariantCard>

        {/* Constrained text, full-width embed */}
        <VariantCard
          label="D — Constrained Text, Full-Width Embed"
          description="Text is wrapped in a narrower centred container (max-w-2xl) so it has breathing room, while the Cal embed uses the full card width."
        >
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_12px_48px_-12px_hsl(var(--foreground)/0.10)] md:p-14">
              <TextContent centered constrained />
              <CalPlaceholder />
            </div>
          </div>
        </VariantCard>

      </div>
    </div>
  </div>
);

export default BookingComparison;
