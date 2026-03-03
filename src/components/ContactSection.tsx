import { useState, type FormEvent } from "react";
import FadeIn from "./FadeIn";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="border-t border-border px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-2xl">
        <FadeIn>
          <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-5xl">
            If this fits where you're deploying capital, let's talk.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-8 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
            We work with a small number of co-investment partners. If you're an experienced business owner or founder looking to deploy £500k–£2m outside your core industry, we'd be glad to have a conversation.
          </p>
        </FadeIn>

        {submitted ? (
          <FadeIn>
            <p className="mt-12 font-sans text-base text-foreground">
              Thank you. We'll be in touch.
            </p>
          </FadeIn>
        ) : (
          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label htmlFor="name" className="block font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Name
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
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-2 w-full border-b border-border bg-transparent py-3 font-sans text-base text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="block font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Brief message
                </label>
                <textarea
                  id="message"
                  rows={3}
                  className="mt-2 w-full resize-none border-b border-border bg-transparent py-3 font-sans text-base text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="mt-4 rounded-sm bg-primary px-8 py-3.5 font-sans text-sm font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-85"
              >
                Send
              </button>
            </form>
          </FadeIn>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
