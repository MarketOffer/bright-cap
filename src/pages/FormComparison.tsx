import { useState, type FormEvent } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const FormInner = ({ id }: { id: string }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!confirmed || !termsAgreed) return;
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="font-sans text-base text-foreground py-8">Thank you. We'll be in touch to arrange your call.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground">Full name</label>
        <input type="text" required className="mt-2 w-full border-b border-border bg-transparent py-3 font-sans text-base text-foreground outline-none transition-colors focus:border-primary" />
      </div>
      <div>
        <label className="block font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground">Email address</label>
        <input type="email" required className="mt-2 w-full border-b border-border bg-transparent py-3 font-sans text-base text-foreground outline-none transition-colors focus:border-primary" />
      </div>
      <div>
        <label className="block font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Approx. investment amount</label>
        <Select required>
          <SelectTrigger className="w-full border-0 border-b border-border rounded-none bg-transparent px-0 font-sans text-base text-foreground shadow-none focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Select an amount" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="<250k">&lt;£250k</SelectItem>
            <SelectItem value="250k-500k">£250k–£500k</SelectItem>
            <SelectItem value="500k-1m">£500k–£1m</SelectItem>
            <SelectItem value="1m-2m">£1m–£2m</SelectItem>
            <SelectItem value="2m-3m">£2m–£3m</SelectItem>
            <SelectItem value="3m+">£3m+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">When are you looking to invest</label>
        <Select required>
          <SelectTrigger className="w-full border-0 border-b border-border rounded-none bg-transparent px-0 font-sans text-base text-foreground shadow-none focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Select a timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="now">Ready now</SelectItem>
            <SelectItem value="3-6">3–6 months</SelectItem>
            <SelectItem value="6-12">6–12 months</SelectItem>
            <SelectItem value="12-24">12–24 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-start gap-3 pt-2">
        <Checkbox id={`confirm-${id}`} checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" />
        <label htmlFor={`confirm-${id}`} className="font-sans text-sm leading-snug text-muted-foreground cursor-pointer">I confirm I am a High Net Worth Investor</label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id={`terms-${id}`} checked={termsAgreed} onCheckedChange={(v) => setTermsAgreed(v === true)} className="mt-0.5" />
        <label htmlFor={`terms-${id}`} className="font-sans text-sm leading-snug text-muted-foreground cursor-pointer">
          I agree to the <span className="underline">Privacy Policy</span> and <span className="underline">Web Terms</span>
        </label>
      </div>
      <button
        type="submit"
        disabled={!confirmed || !termsAgreed}
        className={`mt-4 rounded-full px-10 py-4 font-sans text-sm font-semibold tracking-wide transition-all ${
          confirmed && termsAgreed
            ? "bg-primary text-primary-foreground hover:opacity-85"
            : "border-2 border-primary bg-transparent text-primary cursor-not-allowed"
        }`}
      >
        Book an Introductory Call
      </button>
    </form>
  );
};

const Header = () => (
  <>
    <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
      Book a partner investor call
    </h2>
    <p className="mt-8 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
      A 30-minute call to understand your goals, walk you through our Cambridge block strategy, and explore whether there's a genuine fit.
    </p>
  </>
);

const VariantWrapper = ({ label, description, children }: { label: string; description: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-border bg-card p-4">
      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{label}</span>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);

const FormComparison = () => (
  <div className="min-h-screen bg-background px-6 py-16 md:px-10">
    <div className="mx-auto max-w-5xl">
      <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to site
      </a>
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Contact Form Framing Variants
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Four approaches to making the contact form stand out — compared against the original.
      </p>

      <div className="mt-16 space-y-24">

        {/* Original — no framing */}
        <VariantWrapper
          label="Original — No Framing"
          description="The current design: form sits directly on the page background with no container or visual separation."
        >
          <div className="mx-auto max-w-2xl py-28">
            <Header />
            <div className="mt-12">
              <FormInner id="original" />
            </div>
          </div>
        </VariantWrapper>

        {/* A — Card with shadow */}
        <VariantWrapper
          label="A — Card with Shadow"
          description="White card with a soft drop shadow floating above the page, creating depth and drawing focus to the form."
        >
          <div className="py-28">
            <div className="mx-auto max-w-2xl rounded-2xl bg-card p-8 shadow-[0_8px_40px_-12px_hsl(var(--foreground)/0.08)] md:p-12">
              <Header />
              <div className="mt-12">
                <FormInner id="shadow" />
              </div>
            </div>
          </div>
        </VariantWrapper>

        {/* B — Bordered card with tint */}
        <VariantWrapper
          label="B — Bordered Card with Tint"
          description="Subtle border around the form with a very light tinted background — structured but not heavy."
        >
          <div className="py-28">
            <div className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/[0.03] p-8 md:p-12">
              <Header />
              <div className="mt-12">
                <FormInner id="bordered" />
              </div>
            </div>
          </div>
        </VariantWrapper>

        {/* C — Full-width tinted band */}
        <VariantWrapper
          label="C — Full-Width Tinted Band"
          description="The entire section gets a pale tinted background so the form area feels distinct from surrounding content."
        >
          <div className="rounded-2xl py-28" style={{ backgroundColor: "rgba(163, 196, 188, 0.08)" }}>
            <div className="mx-auto max-w-2xl px-8">
              <Header />
              <div className="mt-12">
                <FormInner id="band" />
              </div>
            </div>
          </div>
        </VariantWrapper>

        {/* D — Dark contrast panel */}
        <VariantWrapper
          label="D — Dark Contrast Panel"
          description="Dark background with light text — high contrast makes the form unmissable and creates a premium feel."
        >
          <div className="rounded-2xl bg-foreground py-28">
            <div className="mx-auto max-w-2xl px-8">
              <h2 className="text-3xl font-semibold tracking-[-0.02em] text-background md:text-[2.75rem] md:leading-[1.1]">
                Book a partner investor call
              </h2>
              <p className="mt-8 font-sans text-base leading-relaxed text-background/60 md:text-lg">
                A 30-minute call to understand your goals, walk you through our Cambridge block strategy, and explore whether there's a genuine fit.
              </p>
              <div className="mt-12">
                <DarkFormInner />
              </div>
            </div>
          </div>
        </VariantWrapper>

      </div>
    </div>
  </div>
);

/** Dark-themed variant of the form */
const DarkFormInner = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!confirmed || !termsAgreed) return;
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="font-sans text-base text-background py-8">Thank you. We'll be in touch to arrange your call.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-sans text-xs font-medium uppercase tracking-widest text-background/50">Full name</label>
        <input type="text" required className="mt-2 w-full border-b border-background/20 bg-transparent py-3 font-sans text-base text-background outline-none transition-colors focus:border-primary" />
      </div>
      <div>
        <label className="block font-sans text-xs font-medium uppercase tracking-widest text-background/50">Email address</label>
        <input type="email" required className="mt-2 w-full border-b border-background/20 bg-transparent py-3 font-sans text-base text-background outline-none transition-colors focus:border-primary" />
      </div>
      <div>
        <label className="block font-sans text-xs font-medium uppercase tracking-widest text-background/50 mb-2">Approx. investment amount</label>
        <Select required>
          <SelectTrigger className="w-full border-0 border-b border-background/20 rounded-none bg-transparent px-0 font-sans text-base text-background shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:text-background/50">
            <SelectValue placeholder="Select an amount" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="<250k">&lt;£250k</SelectItem>
            <SelectItem value="250k-500k">£250k–£500k</SelectItem>
            <SelectItem value="500k-1m">£500k–£1m</SelectItem>
            <SelectItem value="1m-2m">£1m–£2m</SelectItem>
            <SelectItem value="2m-3m">£2m–£3m</SelectItem>
            <SelectItem value="3m+">£3m+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block font-sans text-xs font-medium uppercase tracking-widest text-background/50 mb-2">When are you looking to invest</label>
        <Select required>
          <SelectTrigger className="w-full border-0 border-b border-background/20 rounded-none bg-transparent px-0 font-sans text-base text-background shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:text-background/50">
            <SelectValue placeholder="Select a timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="now">Ready now</SelectItem>
            <SelectItem value="3-6">3–6 months</SelectItem>
            <SelectItem value="6-12">6–12 months</SelectItem>
            <SelectItem value="12-24">12–24 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-start gap-3 pt-2">
        <Checkbox id="confirm-dark" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5 border-background/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
        <label htmlFor="confirm-dark" className="font-sans text-sm leading-snug text-background/60 cursor-pointer">I confirm I am a High Net Worth Investor</label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="terms-dark" checked={termsAgreed} onCheckedChange={(v) => setTermsAgreed(v === true)} className="mt-0.5 border-background/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
        <label htmlFor="terms-dark" className="font-sans text-sm leading-snug text-background/60 cursor-pointer">
          I agree to the <span className="underline text-background">Privacy Policy</span> and <span className="underline text-background">Web Terms</span>
        </label>
      </div>
      <button
        type="submit"
        disabled={!confirmed || !termsAgreed}
        className={`mt-4 rounded-full px-10 py-4 font-sans text-sm font-semibold tracking-wide transition-all ${
          confirmed && termsAgreed
            ? "bg-primary text-primary-foreground hover:opacity-85"
            : "border-2 border-primary bg-transparent text-primary cursor-not-allowed"
        }`}
      >
        Book an Introductory Call
      </button>
    </form>
  );
};

export default FormComparison;
