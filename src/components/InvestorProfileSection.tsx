import FadeIn from "./FadeIn";
import { Check } from "lucide-react";

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

const InvestorProfileSection = () => (
  <section className="border-t border-border px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-5xl">
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl border border-border p-10 md:p-14">
          <div className="text-foreground">
            <NetworkSVG />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
              Who our partner investors are
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Our partner investors are exited founders and business owners with
              capital to put to work, who want long‑term exposure to Cambridge
              without building their own property team.
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
      </FadeIn>
    </div>
  </section>
);

export default InvestorProfileSection;
