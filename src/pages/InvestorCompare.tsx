import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

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

const bodyText =
  "Our partner investors are exited founders and business owners with capital to put to work, who want long‑term exposure to Cambridge without building their own property team.";

const NetworkSVG = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute inset-0 h-full w-full ${className}`}
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

const BulletList = ({ checkBg = "bg-primary", checkText = "text-primary-foreground", titleClass = "text-foreground", textClass = "text-muted-foreground" }) => (
  <ul className="mt-8 max-w-3xl space-y-4">
    {bullets.map((b) => (
      <li key={b.title} className="flex items-start gap-3">
        <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${checkBg}`}>
          <Check className={`h-3 w-3 ${checkText}`} strokeWidth={3} />
        </span>
        <span className={`text-base leading-relaxed ${textClass}`}>
          <span className={`font-semibold ${titleClass}`}>{b.title}</span>
          {" — "}{b.text}
        </span>
      </li>
    ))}
  </ul>
);

/* ─── Variant 1: Current (white card with border) ─── */
const VariantCurrent = () => (
  <div className="relative overflow-hidden rounded-2xl border border-border p-10 md:p-14">
    <div className="text-foreground">
      <NetworkSVG />
    </div>
    <div className="relative z-10">
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
        Who our partner investors are
      </h2>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {bodyText}
      </p>
      <BulletList />
    </div>
  </div>
);

/* ─── Variant 2: Tinted section background, no card ─── */
const VariantTinted = () => (
  <div className="relative overflow-hidden rounded-2xl p-10 md:p-14" style={{ backgroundColor: "rgba(163, 196, 188, 0.08)" }}>
    <div className="text-foreground">
      <NetworkSVG />
    </div>
    <div className="relative z-10">
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
        Who our partner investors are
      </h2>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {bodyText}
      </p>
      <BulletList />
    </div>
  </div>
);

/* ─── Variant 3: Soft filled card ─── */
const VariantSoftFill = () => (
  <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30 p-10 md:p-14">
    <div className="text-foreground">
      <NetworkSVG />
    </div>
    <div className="relative z-10">
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
        Who our partner investors are
      </h2>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {bodyText}
      </p>
      <BulletList />
    </div>
  </div>
);

/* ─── Variant 4: Dark inverted card ─── */
const VariantDarkCard = () => (
  <div className="relative overflow-hidden rounded-2xl bg-foreground p-10 md:p-14">
    <div className="text-background">
      <NetworkSVG />
    </div>
    <div className="relative z-10">
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-background md:text-[2.75rem] md:leading-[1.1]">
        Who our partner investors are
      </h2>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-background/60 md:text-lg">
        {bodyText}
      </p>
      <BulletList
        checkBg="bg-primary"
        checkText="text-primary-foreground"
        titleClass="text-background"
        textClass="text-background/60"
      />
    </div>
  </div>
);

/* ─── Variant 5: Full-bleed dark section ─── */
const VariantFullDark = () => (
  <div className="-mx-6 -my-20 bg-foreground px-6 py-20 md:-mx-10 md:-my-28 md:px-10 md:py-28">
    <div className="mx-auto max-w-5xl">
      <div className="relative overflow-hidden">
        <div className="text-background">
          <NetworkSVG />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-background md:text-[2.75rem] md:leading-[1.1]">
            Who our partner investors are
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-background/60 md:text-lg">
            {bodyText}
          </p>
          <BulletList
            checkBg="bg-primary"
            checkText="text-primary-foreground"
            titleClass="text-background"
            textClass="text-background/60"
          />
        </div>
      </div>
    </div>
  </div>
);

/* ─── Comparison page ─── */
const variants = [
  { id: 1, name: "Current — white card with border", component: VariantCurrent },
  { id: 2, name: "Cambridge-blue tinted background", component: VariantTinted },
  { id: 3, name: "Soft filled card (muted bg)", component: VariantSoftFill },
  { id: 4, name: "Dark inverted card", component: VariantDarkCard },
  { id: 5, name: "Full-bleed dark section", component: VariantFullDark, fullBleed: true },
];

const InvestorCompare = () => (
  <div className="min-h-screen bg-background">
    <div className="border-b border-border px-6 py-6 md:px-10">
      <div className="mx-auto flex max-w-5xl items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-lg font-semibold text-foreground">
          Investor section — background variants
        </h1>
      </div>
    </div>

    {variants.map(({ id, name, component: Variant, fullBleed }) => (
      <section
        key={id}
        className="border-b border-border px-6 py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Variant {id} — {name}
          </p>
          <Variant />
        </div>
      </section>
    ))}
  </div>
);

export default InvestorCompare;
