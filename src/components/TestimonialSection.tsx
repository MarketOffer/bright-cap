import FadeIn from "./FadeIn";
import { Quote } from "lucide-react";
import cambridgeBlockImg from "@/assets/cambridge-block-bbc.webp";

const TestimonialSection = () => (
  <section className="border-t border-border px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-6xl">
      <FadeIn>
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          What investors say about working with our team
        </h2>
      </FadeIn>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
        {/* Quote */}
        <div className="lg:col-span-3 flex flex-col justify-center">
          <FadeIn delay={0.1}>
            <Quote className="h-10 w-10 text-primary/30 mb-6" />
            <blockquote className="text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
              "I was looking to grow my wealth through property investment but didn't have the expertise or time to handle it myself. Sam and his team made the entire process seamless, managing everything from start to finish. Their professionalism and expertise have exceeded my expectations – an effortless investment experience with a great return!"
            </blockquote>
            <p className="mt-8 text-base font-semibold text-foreground">
              Mr. Tomlinson
            </p>
            <p className="text-sm text-muted-foreground">
              Business Owner<sup>1</sup>
            </p>
          </FadeIn>
        </div>

        {/* Project image */}
        <div className="lg:col-span-2">
          <FadeIn delay={0.2}>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={cambridgeBlockImg}
                alt="Residential Block, Cambridge"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-3 text-center text-sm font-medium tracking-wide text-muted-foreground">
              Residential Block, Cambridge
            </p>
          </FadeIn>
        </div>
      </div>

    </div>
  </section>
);

export default TestimonialSection;
