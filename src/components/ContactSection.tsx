import { useState, type FormEvent } from "react";
import FadeIn from "./FadeIn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!confirmed || !termsAgreed) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-2xl">
        <FadeIn>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
            Book a partner investor call
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-8 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
            A 30-minute call to understand your goals, walk you through our Cambridge block strategy, and explore whether there's a genuine fit.
          </p>
        </FadeIn>

        {submitted ? (
          <FadeIn>
            <p className="mt-12 font-sans text-base text-foreground">
              Thank you. We'll be in touch to arrange your call.
            </p>
          </FadeIn>
        ) : (
          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label htmlFor="name" className="block font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="mt-2 w-full border-b border-border bg-transparent py-3 font-sans text-base text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-2 w-full border-b border-border bg-transparent py-3 font-sans text-base text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                  Approx. investment amount
                </label>
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
                <label className="block font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                  When are you looking to invest
                </label>
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
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={(v) => setConfirmed(v === true)}
                  required
                  className="mt-0.5"
                />
                <label htmlFor="confirm" className="font-sans text-sm leading-snug text-muted-foreground cursor-pointer">
                  I confirm I am a High Net Worth Investor
                </label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAgreed}
                  onCheckedChange={(v) => setTermsAgreed(v === true)}
                  required
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="font-sans text-sm leading-snug text-muted-foreground cursor-pointer">
                  I agree to the{" "}
                  <a href="/privacy" className="underline text-foreground hover:text-primary transition-colors">Privacy Policy</a>
                  {" "}and{" "}
                  <a href="/webterms" className="underline text-foreground hover:text-primary transition-colors">Web Terms</a>
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
          </FadeIn>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
