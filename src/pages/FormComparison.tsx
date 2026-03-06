import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";

/* ── Shared form fields ── */
const FormFields = ({ compact = false }: { compact?: boolean }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!confirmed || !termsAgreed) return;
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="font-sans text-base text-foreground py-4">Thank you. We'll be in touch to arrange your call.</p>;
  }

  const gap = compact ? "space-y-4" : "space-y-6";
  const labelCls = `block font-sans text-xs font-semibold uppercase tracking-widest text-foreground ${compact ? "mb-1" : "mb-2"}`;
  const inputCls = `w-full border-b border-border bg-transparent ${compact ? "py-2 text-sm" : "py-3 text-base"} font-sans text-foreground outline-none transition-colors focus:border-primary`;

  return (
    <form onSubmit={handleSubmit} className={gap}>
      <div>
        <label className={labelCls}>Full name</label>
        <input type="text" required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Email address</label>
        <input type="email" required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Approx. investment amount</label>
        <Select required>
          <SelectTrigger className={`w-full border-0 border-b border-border rounded-none bg-transparent px-0 font-sans ${compact ? "text-sm" : "text-base"} text-foreground shadow-none focus:ring-0 focus:ring-offset-0`}>
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
        <label className={labelCls}>When are you looking to invest</label>
        <Select required>
          <SelectTrigger className={`w-full border-0 border-b border-border rounded-none bg-transparent px-0 font-sans ${compact ? "text-sm" : "text-base"} text-foreground shadow-none focus:ring-0 focus:ring-offset-0`}>
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
      <div className="flex items-start gap-3 pt-1">
        <Checkbox id={`confirm-${compact}`} checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" />
        <label htmlFor={`confirm-${compact}`} className={`font-sans ${compact ? "text-xs" : "text-sm"} leading-snug text-muted-foreground cursor-pointer`}>
          I confirm I am a High Net Worth Investor
        </label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id={`terms-${compact}`} checked={termsAgreed} onCheckedChange={(v) => setTermsAgreed(v === true)} className="mt-0.5" />
        <label htmlFor={`terms-${compact}`} className={`font-sans ${compact ? "text-xs" : "text-sm"} leading-snug text-muted-foreground cursor-pointer`}>
          I agree to the Privacy Policy and Web Terms
        </label>
      </div>
      <button
        type="submit"
        disabled={!confirmed || !termsAgreed}
        className={`rounded-full ${compact ? "px-8 py-3 text-xs" : "px-10 py-4 text-sm"} font-sans font-semibold tracking-wide transition-all ${
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

/* ── Multi-step wizard ── */
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <p className="font-sans text-base text-foreground py-4">Thank you. We'll be in touch to arrange your call.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-1">Full name</label>
            <input type="text" required className="w-full border-b border-border bg-transparent py-2 text-sm font-sans text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-1">Email address</label>
            <input type="email" required className="w-full border-b border-border bg-transparent py-2 text-sm font-sans text-foreground outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-1">Approx. investment amount</label>
            <Select>
              <SelectTrigger className="w-full border-0 border-b border-border rounded-none bg-transparent px-0 font-sans text-sm text-foreground shadow-none focus:ring-0 focus:ring-offset-0">
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
            <label className="block font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-1">When are you looking to invest</label>
            <Select>
              <SelectTrigger className="w-full border-0 border-b border-border rounded-none bg-transparent px-0 font-sans text-sm text-foreground shadow-none focus:ring-0 focus:ring-offset-0">
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
          <button onClick={() => setStep(2)} className="rounded-full bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold tracking-wide hover:opacity-85 transition-all">
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <p className="font-sans text-sm text-muted-foreground">Almost there — just confirm the following:</p>
          <div className="flex items-start gap-3">
            <Checkbox id="confirm-ms" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" />
            <label htmlFor="confirm-ms" className="font-sans text-sm leading-snug text-muted-foreground cursor-pointer">I confirm I am a High Net Worth Investor</label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="terms-ms" checked={termsAgreed} onCheckedChange={(v) => setTermsAgreed(v === true)} className="mt-0.5" />
            <label htmlFor="terms-ms" className="font-sans text-sm leading-snug text-muted-foreground cursor-pointer">I agree to the Privacy Policy and Web Terms</label>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="rounded-full border-2 border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-all">← Back</button>
            <button
              onClick={() => { if (confirmed && termsAgreed) setSubmitted(true); }}
              disabled={!confirmed || !termsAgreed}
              className={`rounded-full px-8 py-3 text-sm font-semibold tracking-wide transition-all ${
                confirmed && termsAgreed ? "bg-primary text-primary-foreground hover:opacity-85" : "border-2 border-primary bg-transparent text-primary cursor-not-allowed"
              }`}
            >
              Book an Introductory Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Variant cards ── */
const VariantCard = ({ title, description, tag, children }: { title: string; description: string; tag: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
    <div className="flex items-center gap-3 mb-1">
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{tag}</span>
    </div>
    <h3 className="text-xl font-semibold text-foreground mt-3 mb-1">{title}</h3>
    <p className="font-sans text-sm text-muted-foreground mb-6">{description}</p>
    {children}
  </div>
);

/* ── Sidebar form ── */
const SidebarDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="rounded-full bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold tracking-wide hover:opacity-85 transition-all">
        {open ? "Close Panel" : "Open Side Panel →"}
      </button>
      {open && (
        <div className="mt-4 border-l-2 border-primary pl-6 animate-in slide-in-from-right-4">
          <h4 className="text-base font-semibold text-foreground mb-4">Book a partner investor call</h4>
          <FormFields compact />
        </div>
      )}
    </div>
  );
};

/* ── Page ── */
const FormComparison = () => (
  <div className="min-h-screen bg-background">
    <div className="px-6 py-8 md:px-10">
      <Link to="/#contact" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to site
      </Link>
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">Contact Form Variants</h1>
      <p className="mt-3 font-sans text-base text-muted-foreground max-w-2xl">
        Four approaches to fitting the booking form in the viewport. Each trades off information density vs. focus.
      </p>
    </div>

    <div className="px-6 pb-20 md:px-10 grid gap-12 max-w-2xl mx-auto">
      {/* 1. Tighter spacing */}
      <VariantCard
        tag="Option A"
        title="Tighter Spacing"
        description="Same single form, reduced padding and gaps. Nearly fits one viewport without changing font sizes."
      >
        <div className="rounded-xl border border-border bg-background p-5">
          <h4 className="text-lg font-semibold text-foreground mb-1">Book a partner investor call</h4>
          <p className="font-sans text-xs text-muted-foreground mb-4">30-min call to explore fit.</p>
          <FormFields compact />
        </div>
      </VariantCard>

      {/* 2. Multi-step wizard */}
      <VariantCard
        tag="Option B"
        title="Multi-step Wizard"
        description="Split into 2 steps — details then confirmations. Each step fits comfortably in the viewport."
      >
        <div className="rounded-xl border border-border bg-background p-5">
          <h4 className="text-lg font-semibold text-foreground mb-1">Book a partner investor call</h4>
          <p className="font-sans text-xs text-muted-foreground mb-4">Step-by-step, feels quick.</p>
          <MultiStepForm />
        </div>
      </VariantCard>

      {/* 3. Modal / Dialog */}
      <VariantCard
        tag="Option C"
        title="Modal Dialog"
        description="Form opens in a centered overlay. Full focus, zero scrolling distraction from the main page."
      >
        <Dialog>
          <DialogTrigger asChild>
            <button className="rounded-full bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold tracking-wide hover:opacity-85 transition-all">
              Open Modal Form →
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Book a partner investor call</DialogTitle>
            </DialogHeader>
            <p className="font-sans text-sm text-muted-foreground mb-2">30-min call to explore fit.</p>
            <FormFields compact />
          </DialogContent>
        </Dialog>
      </VariantCard>

      {/* 4. Slide-in sidebar */}
      <VariantCard
        tag="Option D"
        title="Slide-in Side Panel"
        description="A compact panel that slides in contextually. Keeps the user on the page while focusing on the form."
      >
        <SidebarDemo />
      </VariantCard>
    </div>
  </div>
);

export default FormComparison;
