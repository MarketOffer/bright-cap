import { Link } from "react-router-dom";
import { ArrowLeft, Key, TrendingUp, Building2 } from "lucide-react";
import { Check } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const bodyText =
  "Our partner investors are exited founders and business owners with capital to put to work, who want long‑term exposure to Cambridge without building their own property team.";

const bullets = [
  {
    title: "Ex‑founders",
    text: "Who've sold or taken significant cash out of a business",
    icon: Key,
  },
  {
    title: "Business owners",
    text: "Generating strong profits and looking to grow outside their core industry",
    icon: TrendingUp,
  },
  {
    title: "Passive investors",
    text: "Who want to own quality Cambridge blocks, but don't want to find deals, manage builders or chase letting agents",
    icon: Building2,
  },
];

/* ─── Variant 1: Three-card grid ─── */
const VariantCards = () => (
  <div>
    <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
      Who our partner investors are
    </h2>
    <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
      {bodyText}
    </p>
    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {bullets.map((b, i) => (
        <div
          key={b.title}
          className="rounded-2xl border border-border p-6 transition-colors hover:bg-muted/40"
        >
          <span className="text-sm font-bold tracking-wide text-primary">
            0{i + 1}
          </span>
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            {b.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {b.text}
          </p>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Variant 2: Pull-quote + sidebar ─── */
const VariantPullQuote = () => (
  <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
    <div className="lg:col-span-3">
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
        Who our partner investors are
      </h2>
      <p className="mt-8 text-xl leading-relaxed text-muted-foreground md:text-2xl md:leading-relaxed">
        {bodyText}
      </p>
    </div>
    <div className="flex flex-col justify-center lg:col-span-2">
      {bullets.map((b) => (
        <div key={b.title} className="border-t border-border py-5">
          <p className="font-semibold text-foreground">{b.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {b.text}
          </p>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Variant 3: Numbered list with bold lead-ins ─── */
const VariantNumbered = () => (
  <div>
    <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
      Who our partner investors are
    </h2>
    <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
      {bodyText}
    </p>
    <div className="mt-10 max-w-2xl divide-y divide-border">
      {bullets.map((b, i) => (
        <div key={b.title} className="flex gap-4 py-6">
          <span className="shrink-0 text-sm font-medium tracking-wide text-muted-foreground/60">
            0{i + 1}
          </span>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            <span className="font-semibold text-foreground">{b.title}</span>
            {" — "}
            {b.text}
          </p>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Variant 4: Icon-led horizontal row ─── */
const VariantIcons = () => (
  <div>
    <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
      Who our partner investors are
    </h2>
    <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
      {bodyText}
    </p>
    <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
      {bullets.map((b) => {
        const Icon = b.icon;
        return (
          <div key={b.title}>
            <Icon className="h-8 w-8 text-foreground" strokeWidth={1.2} />
            <h3 className="mt-4 text-base font-semibold text-foreground">
              {b.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {b.text}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

/* ─── Variant 5: Large line-art illustration (SVG) ─── */
const ArchitecturalSVG = () => (
  <svg
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
  >
    {/* Abstract Cambridge-inspired block of flats outline */}
    <rect x="60" y="80" width="120" height="280" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.25" />
    <rect x="70" y="100" width="30" height="40" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <rect x="110" y="100" width="30" height="40" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <rect x="150" y="100" width="20" height="40" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <rect x="70" y="160" width="30" height="40" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <rect x="110" y="160" width="30" height="40" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <rect x="150" y="160" width="20" height="40" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <rect x="70" y="220" width="30" height="40" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <rect x="110" y="220" width="30" height="40" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <rect x="150" y="220" width="20" height="40" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <rect x="100" y="300" width="40" height="60" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    
    {/* Second taller building */}
    <rect x="220" y="40" width="140" height="320" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <rect x="235" y="60" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="270" y="60" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="305" y="60" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="235" y="110" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="270" y="110" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="305" y="110" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="235" y="160" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="270" y="160" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="305" y="160" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="235" y="210" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="270" y="210" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="305" y="210" width="25" height="35" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <rect x="270" y="300" width="40" height="60" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.25" />
    
    {/* Ground line */}
    <line x1="40" y1="360" x2="380" y2="360" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
  </svg>
);

const VariantLargeIllustration = () => (
  <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
        Who our partner investors are
      </h2>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
        {bodyText}
      </p>
      <ul className="mt-8 space-y-4">
        {bullets.map((b) => (
          <li key={b.title} className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
              <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
            </span>
            <span className="text-base leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{b.title}</span>
              {" — "}{b.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
    <div className="flex items-center justify-center text-foreground">
      <div className="w-full max-w-sm">
        <ArchitecturalSVG />
      </div>
    </div>
  </div>
);

/* ─── Variant 6: Three small line-art icons ─── */
const IconKey = () => (
  <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12" stroke="currentColor" strokeWidth="1.2">
    <circle cx="16" cy="18" r="8" />
    <line x1="22" y1="22" x2="42" y2="42" />
    <line x1="36" y1="36" x2="42" y2="30" />
    <line x1="30" y1="30" x2="36" y2="24" />
  </svg>
);

const IconChart = () => (
  <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12" stroke="currentColor" strokeWidth="1.2">
    <polyline points="6,42 6,6" />
    <polyline points="6,42 42,42" />
    <polyline points="10,34 18,22 26,28 38,10" />
    <polyline points="30,10 38,10 38,18" />
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12" stroke="currentColor" strokeWidth="1.2">
    <rect x="8" y="10" width="32" height="34" rx="1" />
    <rect x="14" y="16" width="6" height="6" rx="0.5" />
    <rect x="28" y="16" width="6" height="6" rx="0.5" />
    <rect x="14" y="26" width="6" height="6" rx="0.5" />
    <rect x="28" y="26" width="6" height="6" rx="0.5" />
    <rect x="20" y="36" width="8" height="8" rx="0.5" />
  </svg>
);

const smallIcons = [IconKey, IconChart, IconBuilding];

const VariantSmallIcons = () => (
  <div>
    <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
      Who our partner investors are
    </h2>
    <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
      {bodyText}
    </p>
    <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
      {bullets.map((b, i) => {
        const Icon = smallIcons[i];
        return (
          <div key={b.title}>
            <div className="text-foreground">
              <Icon />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              {b.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {b.text}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

/* ─── Variant 7: Abstract geometric network ─── */
const NetworkSVG = () => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 h-full w-full"
  >
    {/* Nodes */}
    <circle cx="80" cy="60" r="4" fill="currentColor" opacity="0.12" />
    <circle cx="200" cy="40" r="5" fill="currentColor" opacity="0.1" />
    <circle cx="320" cy="80" r="4" fill="currentColor" opacity="0.12" />
    <circle cx="60" cy="180" r="3" fill="currentColor" opacity="0.08" />
    <circle cx="180" cy="160" r="6" fill="currentColor" opacity="0.1" />
    <circle cx="300" cy="200" r="4" fill="currentColor" opacity="0.12" />
    <circle cx="140" cy="260" r="3" fill="currentColor" opacity="0.08" />
    <circle cx="260" cy="270" r="5" fill="currentColor" opacity="0.1" />
    <circle cx="360" cy="150" r="3" fill="currentColor" opacity="0.08" />
    {/* Connections */}
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

const VariantNetwork = () => (
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
      <ul className="mt-8 max-w-2xl space-y-4">
        {bullets.map((b) => (
          <li key={b.title} className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
              <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
            </span>
            <span className="text-base leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{b.title}</span>
              {" — "}{b.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ─── Comparison page ─── */
const variants = [
  { id: 1, name: "Three-card grid", component: VariantCards },
  { id: 2, name: "Pull-quote + sidebar", component: VariantPullQuote },
  { id: 3, name: "Numbered list", component: VariantNumbered },
  { id: 4, name: "Icon-led row (Lucide)", component: VariantIcons },
  { id: 5, name: "Large line-art illustration", component: VariantLargeIllustration },
  { id: 6, name: "Small line-art icons", component: VariantSmallIcons },
  { id: 7, name: "Abstract network", component: VariantNetwork },
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
          Investor section — 7 variants
        </h1>
      </div>
    </div>

    {variants.map(({ id, name, component: Variant }) => (
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
