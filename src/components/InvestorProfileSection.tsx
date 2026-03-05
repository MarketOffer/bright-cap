import FadeIn from "./FadeIn";
import { Check } from "lucide-react";

const bullets = [
  "Ex‑founders who've sold or taken significant cash out of a business",
  "Business owners generating strong profits and looking to grow outside their core industry",
  "Investors who want to own quality Cambridge blocks, but don't want to find deals, manage builders or chase letting agents",
];

const InvestorProfileSection = () => (
  <section className="border-t border-border px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-5xl">
      <FadeIn>
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          Who our partner investors are
        </h2>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Our partner investors are exited founders and business owners with
          capital to put to work, who want long‑term exposure to Cambridge
          without building their own property team.
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <ul className="mt-10 space-y-5 max-w-2xl">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
              </span>
              <span className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </FadeIn>
    </div>
  </section>
);

export default InvestorProfileSection;
