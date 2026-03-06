import { Check, ArrowRight } from "lucide-react";

const bullets = [
  {
    title: "Exited founders",
    text: "Who've sold or taken significant cash out of a business",
  },
  {
    title: "Business owners",
    text: "Generating strong profits and looking to grow outside their core industry",
  },
];

const NetworkSVG = () => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 h-full w-full"
  >
    <circle cx="80" cy="60" r="4" fill="currentColor" opacity="0.12" />
    <circle cx="200" cy="40" r="5" fill="currentColor" opacity="0.1" />
    <circle cx="320" cy="80" r="4" fill="currentColor" opacity="0.12" />
    <circle cx="60" cy="180" r="3" fill="currentColor" opacity="0.08" />
    <circle cx="180" cy="160" r="6" fill="currentColor" opacity="0.1" />
    <circle cx="300" cy="200" r="4" fill="currentColor" opacity="0.12" />
    <circle cx="140" cy="260" r="3" fill="currentColor" opacity="0.08" />
    <circle cx="260" cy="270" r="5" fill="currentColor" opacity="0.1" />
    <circle cx="360" cy="150" r="3" fill="currentColor" opacity="0.08" />
    <line x1="80" y1="60" x2="200" y2="40" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
    <line x1="200" y1="40" x2="320" y2="80" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
    <line x1="80" y1="60" x2="60" y2="180" stroke="currentColor" strokeWidth="0.6" opacity="0.06" />
    <line x1="200" y1="40" x2="180" y2="160" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
    <line x1="320" y1="80" x2="300" y2="200" stroke="currentColor" strokeWidth="0.6" opacity="0.06" />
    <line x1="60" y1="180" x2="180" y2="160" stroke="currentColor" strokeWidth="0.6" opacity="0.06" />
    <line x1="180" y1="160" x2="300" y2="200" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
    <line x1="180" y1="160" x2="140" y2="260" stroke="currentColor" strokeWidth="0.6" opacity="0.06" />
    <line x1="300" y1="200" x2="260" y2="270" stroke="currentColor" strokeWidth="0.6" opacity="0.06" />
    <line x1="320" y1="80" x2="360" y2="150" stroke="currentColor" strokeWidth="0.6" opacity="0.06" />
    <line x1="360" y1="150" x2="300" y2="200" stroke="currentColor" strokeWidth="0.6" opacity="0.06" />
    <line x1="140" y1="260" x2="260" y2="270" stroke="currentColor" strokeWidth="0.6" opacity="0.06" />
  </svg>
);

const SharedContent = () => (
  <>
    <h2 className="text-2xl font-semibold tracking-[-0.02em] text-background md:text-3xl">
      Who invests with us
    </h2>
    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background/60 md:text-base">
      Our partner investors are exited founders and business owners with
      capital to put to work, who want long‑term exposure to Cambridge
      without building their own property team.
    </p>
    <ul className="mt-6 max-w-3xl space-y-3">
      {bullets.map((b) => (
        <li key={b.title} className="flex items-start gap-3">
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
            <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
          </span>
          <span className="text-sm leading-relaxed text-background/60">
            <span className="font-semibold text-background">{b.title}</span>
            {" — "}{b.text}
          </span>
        </li>
      ))}
    </ul>
  </>
);

const VariantCard = ({ label, description, children }: { label: string; description: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-border bg-card p-4">
      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        {label}
      </span>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-8 md:p-10">
      <div className="text-background">
        <NetworkSVG />
      </div>
      <div className="relative z-10">
        <SharedContent />
        {children}
      </div>
    </div>
  </div>
);

const CTAComparison = () => (
  <div className="min-h-screen bg-background px-6 py-16 md:px-10">
    <div className="mx-auto max-w-5xl">
      <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to site
      </a>
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Ghost Button Variants
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Three variations of the ghost/outline button — the original C, plus two with an accent green touch.
      </p>

      <div className="mt-16 space-y-20">

        {/* C — Original Ghost */}
        <VariantCard
          label="C — Ghost / Outline Button (Original)"
          description="Outline style with all-white text and arrow. Subtle but may lack a focal point."
        >
          <div className="mt-10 border-t border-background/10 pt-8">
            <p className="text-base font-medium text-background/70">
              Interested in exploring becoming a partner investor?
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-sm border border-background/20 px-6 py-2.5 text-sm font-medium text-background/70 transition-colors hover:border-background/40 hover:text-background"
            >
              Invest With Us
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </VariantCard>

        {/* C1 — Green arrow */}
        <VariantCard
          label="C1 — Ghost Button, Green Arrow"
          description="Same outline button but the arrow is accent green — adds a subtle pop of colour to draw the eye without overwhelming."
        >
          <div className="mt-10 border-t border-background/10 pt-8">
            <p className="text-base font-medium text-background/70">
              Interested in exploring becoming a partner investor?
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-sm border border-background/20 px-6 py-2.5 text-sm font-medium text-background/70 transition-colors hover:border-background/40 hover:text-background"
            >
              Invest With Us
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </a>
          </div>
        </VariantCard>

        {/* C2 — Green border */}
        <VariantCard
          label="C2 — Ghost Button, Green Border"
          description="The button outline is accent green — gives the CTA more presence while keeping the text neutral."
        >
          <div className="mt-10 border-t border-background/10 pt-8">
            <p className="text-base font-medium text-background/70">
              Interested in exploring becoming a partner investor?
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-sm border border-primary/50 px-6 py-2.5 text-sm font-medium text-background/70 transition-colors hover:border-primary hover:text-background"
            >
              Invest With Us
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </VariantCard>

      </div>
    </div>
  </div>
);

export default CTAComparison;
