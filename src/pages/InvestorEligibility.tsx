import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatementQuestions from "@/components/eligibility/StatementQuestions";
import { LARGE_FIGURE_THRESHOLD } from "@/components/eligibility/MoneyInput";
import {
  CONDITIONS,
  PRIVACY_NOTICE_VERSION,
  REASON_MESSAGES,
  ROUTE_OPTIONS,
  declarationIds,

  type Answer,
  type EligibilityPayload,
  type EligibilityResponse,
} from "@/legal/eligibility/contract";
import { type StatementKind } from "@/legal/statements/statementDefinitions";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const canonical = "https://brightcap.capital/investors/eligibility";
const STEPS = ["Your details", "Basis", "Statement"];

type Outcome =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "accepted" }
  | { state: "offer_alternative"; alternative: StatementKind }
  | { state: "rejected"; reasons: string[]; final: boolean };

const InvestorEligibility = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Recertification: contact fields may be typed afresh by the investor, but the
  // statement itself is never pre-filled — it must be answered anew each time.
  const isRecertifying = searchParams.get("recertify") === "1";
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ fullName: "", email: "", phone: "" });
  // Patch v2.1: one route per submission, chosen before any statutory wording.
  const [kind, setKind] = useState<StatementKind | null>(null);
  
  const [declinedKinds, setDeclinedKinds] = useState<StatementKind[]>([]);
  const [attemptGroupId] = useState(() => crypto.randomUUID());
  const [answers, setAnswers] = useState<Record<string, Record<string, unknown>>>({});
  const [declarations, setDeclarations] = useState<
    Record<string, Record<string, { accepted: boolean; at: string }>>
  >({});
  const [signatureTyped, setSignatureTyped] = useState("");
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [preferenceSaved, setPreferenceSaved] = useState(false);
  // Returned by the accepted submission so the investor never re-enters an email.
  const [summaryPath, setSummaryPath] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome>({ state: "idle" });

  const goToSummary = () => {
    setPreferenceSaved(true);
    navigate(summaryPath ?? "/investors/summary");
  };

  // Smooth-scroll back to the top of the form when moving between steps.
  const formTopRef = useRef<HTMLOListElement | null>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const serverDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date()),
    [],
  );

  const setDeclaration = (k: StatementKind, id: string, accepted: boolean) =>
    setDeclarations((current) => ({
      ...current,
      [k]: {
        ...(current[k] ?? {}),
        [id]: { accepted, at: new Date().toISOString() },
      },
    }));

  /**
   * Once a route has been declared not-applicable, that declaration stands. The
   * investor may take the other route, but may never reopen the first one.
   */
  const routeLocked = declinedKinds.length > 0;

  /**
   * If no condition is answered Yes, there is nothing to certify: the investor can
   * only leave. Nothing is persisted in that case.
   */
  const currentAnswers = kind ? (answers[kind] ?? {}) : {};
  const allNo = kind

    ? CONDITIONS[kind].every((spec) => (currentAnswers[spec.letter] as Answer) === "no")
    : false;
  /** Driven solely by the prescribed "None of these apply to me" condition. */
  const noneApply = currentAnswers.none === true;
  const cancelOnly = Boolean(kind) && (noneApply || allNo);


  const startAlternative = (alternative: StatementKind) => {
    setDeclinedKinds((current) =>
      kind && !current.includes(kind) ? [...current, kind] : current,
    );
    setKind(alternative);
    setAnswers({});
    setDeclarations({});
    setSignatureTyped("");
    setOutcome({ state: "idle" });
    setStep(2);
  };

  /**
   * What is still missing on the statement step, in plain words. Shown next to the
   * Submit button so a disabled control always explains itself.
   */
  const outstanding = (): string[] => {
    if (step !== 2 || !kind || cancelOnly) return [];
    const items: string[] = [];

    CONDITIONS[kind].forEach((spec) => {
      const value = currentAnswers[spec.letter] as Answer;
      /* SCSI only — the HNW gating is unchanged. */
      if (kind === "scsi" && value !== "yes" && value !== "no") {
        items.push(`Answer No or Yes to condition ${spec.letter}`);
        return;
      }
      if (value !== "yes") return;
      (spec.detailField?.keys ?? []).forEach((key) => {
        const raw = currentAnswers[key];
        const numeric = typeof raw === "number" ? raw : Number(raw ?? NaN);
        if (spec.detailField?.kind === "integer") {
          if (kind !== "scsi") return;
          if (!Number.isInteger(numeric) || numeric < 2) {
            items.push(
              `Give the number of investments for condition ${spec.letter} (two or more)`,
            );
          }
          return;
        }
        if (spec.detailField?.kind === "text" || spec.detailField?.kind === "company") {
          if (kind !== "scsi") return;
          if (String(raw ?? "").trim().length === 0) {
            items.push(`Complete the details for condition ${spec.letter}`);
          }
          return;
        }
        /* Large figures require an explicit confirmation before they can be signed. */
        if (
          Number.isFinite(numeric) &&
          numeric >= LARGE_FIGURE_THRESHOLD &&
          currentAnswers[`${key}_confirmed`] !== true
        ) {
          items.push(`Confirm the figure entered for condition ${spec.letter}`);
        }
      });
    });

    if (!declarationIds(kind).every((id) => declarations[kind]?.[id]?.accepted === true)) {
      items.push("Tick every declaration");
    }
    if (signatureTyped.trim().length === 0) items.push("Type your signature");
    return items;
  };

  const canContinue = () => {
    if (step === 0) {
      return (
        contact.fullName.trim().length > 0 &&
        /\S+@\S+\.\S{2,}/.test(contact.email) &&
        privacyAcknowledged
      );
    }
    if (step === 1) return kind !== null;
    if (step === 2) {
      if (cancelOnly) return false;
      return kind !== null && outstanding().length === 0;
    }


    return true;
  };

  const submit = async () => {
    if (!kind) return;
    setOutcome({ state: "submitting" });
    const payload: EligibilityPayload = {
      contact,
      kind,
      noneApply,
      declinedKinds,
      attemptGroupId,
      answers,
      declarations,
      signatureTyped,
      declaredFullName: contact.fullName,
      privacy: { acknowledged: privacyAcknowledged, version: PRIVACY_NOTICE_VERSION },
      marketingOptIn,
    };

    const { data, error } = await supabase.functions.invoke<EligibilityResponse>(
      "submit-eligibility",
      { body: payload },
    );

    if (data?.ok === true) {
      setSummaryPath(data.delivery?.summaryPath ?? null);
      setOutcome({ state: "accepted" });
      return;
    }

    if (data?.offerAlternative) {
      setDeclinedKinds(data.declinedKinds ?? [kind]);
      setOutcome({ state: "offer_alternative", alternative: data.offerAlternative });
      return;
    }

    let reasons: string[] = Array.isArray(data?.reasons) ? data.reasons : [];
    if (reasons.length === 0 && error) {
      const context = (error as { context?: Response }).context;
      try {
        const parsed = context ? await context.clone().json() : null;
        if (Array.isArray(parsed?.reasons)) reasons = parsed.reasons;
      } catch {
        /* fall through to the generic message */
      }
    }
    const codes = reasons.length ? reasons : ["server_error"];
    setOutcome({
      state: "rejected",
      reasons: codes,
      final: codes.includes("both_routes_declined"),
    });
  };


  const heading = "text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]";

  return (
    <>
      <Helmet>
        <title>Investor Eligibility | BrightCap</title>
        <meta
          name="description"
          content="Confirm your investor status before BrightCap can share investment information with you."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <Navbar />

      <main className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/investors"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to investors
          </Link>

          {isRecertifying && outcome.state !== "accepted" && (
            <div className="mt-8 border border-border p-6">
              <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-foreground">
                Renewing your certification
              </h2>
              <p className="mt-3 font-sans leading-relaxed text-secondary">
                A certification lasts twelve months and cannot be extended. Please complete the
                statement in full: your previous answers are not carried over, and each condition
                must be considered again as at today's date.
              </p>
            </div>
          )}

          {outcome.state === "accepted" ? (

            <div className="mt-8">
              <h1 className={heading}>Joint Venture Investment Summary</h1>
              <p className="mt-6 font-sans text-lg leading-relaxed text-secondary">
                Your investor statement has been recorded and is valid for twelve months. We have
                emailed you a confirmation.
              </p>

              <div className="mt-12 border border-border p-6">
                <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-foreground">
                  Get the summary
                </h2>
                <div className="mt-6">
                  <Button onClick={() => setPreferenceOpen(true)}>Get Investment Summary</Button>
                </div>
              </div>

              <Dialog open={preferenceOpen} onOpenChange={setPreferenceOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-sans text-lg leading-snug tracking-[-0.01em]">
                      Would you like to receive updates from BrightCap about future investment
                      opportunities?
                    </DialogTitle>
                    <DialogDescription className="font-sans leading-relaxed">
                      These are only sent while your investor certification is valid, and you can
                      withdraw at any time.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-2 flex gap-4">
                    <Button
                      className="flex-1"
                      disabled={savingPreference}
                      onClick={() => goToSummary(true)}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={savingPreference}
                      onClick={() => goToSummary(false)}
                    >
                      No
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

          ) : outcome.state === "offer_alternative" ? (
            <div className="mt-8">
              <h1 className={heading}>That basis does not apply to you</h1>
              <p className="mt-6 font-sans text-lg leading-relaxed text-secondary">
                You have declared that none of the conditions on that statement apply to you. That
                declaration has been recorded and cannot be changed.
              </p>
              <p className="mt-6 font-sans leading-relaxed text-secondary">
                The two bases are independent of one another, so you may still qualify on the
                other. You can complete the{" "}
                <span className="text-foreground">
                  {ROUTE_OPTIONS.find((route) => route.kind === outcome.alternative)?.title
                    .replace(/^Based on my /, "")}
                </span>{" "}
                basis instead, if it applies to you. This is offered once.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button onClick={() => startAlternative(outcome.alternative)}>
                  Continue on the other basis
                </Button>
                <Link
                  to="/investors"
                  className="font-sans text-sm text-secondary underline underline-offset-4"
                >
                  No thank you
                </Link>
              </div>
            </div>
          ) : outcome.state === "rejected" ? (
            <div className="mt-8">
              <h1 className={heading}>We cannot proceed at this stage</h1>
              <ul className="mt-6 space-y-3">
                {outcome.reasons.map((reason) => (
                  <li key={reason} className="font-sans leading-relaxed text-secondary">
                    {REASON_MESSAGES[reason] ?? REASON_MESSAGES.server_error}
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-sans leading-relaxed text-secondary">
                If you believe this is wrong, please{" "}
                <Link to="/contact" className="text-foreground underline underline-offset-4">
                  contact us
                </Link>
                .
              </p>
              {/* A completed declaration is never reopened; only correctable errors are. */}
              {!outcome.final && (
                <Button
                  variant="outline"
                  className="mt-8"
                  onClick={() => setOutcome({ state: "idle" })}
                >
                  Review my answers
                </Button>
              )}
            </div>

          ) : (
            <>
              <h1 className={heading}>Investor eligibility</h1>
              <p className="mt-6 font-sans text-lg leading-relaxed text-secondary">
                Before we can share investment information, UK financial promotion rules require
                you to certify your investor status. Nothing is sent until this is complete.
              </p>

              <ol
                ref={formTopRef}
                className="mt-10 scroll-mt-28 flex flex-wrap gap-x-6 gap-y-2 font-sans text-xs uppercase tracking-widest"
              >
                {STEPS.map((label, index) => (
                  <li
                    key={label}
                    className={
                      index === step
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {index + 1}. {label}
                  </li>
                ))}
              </ol>

              <div className="mt-10 space-y-8">
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">
                        Full name
                        <span aria-hidden="true" className="text-primary">
                          {" *"}
                        </span>
                      </Label>
                      <Input
                        id="fullName"
                        required
                        aria-required="true"
                        maxLength={120}
                        value={contact.fullName}
                        onChange={(event) =>
                          setContact({ ...contact, fullName: event.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">
                        Email
                        <span aria-hidden="true" className="text-primary">
                          {" *"}
                        </span>
                      </Label>
                      <Input
                        id="email"
                        required
                        aria-required="true"
                        type="email"
                        maxLength={255}
                        value={contact.email}
                        onChange={(event) =>
                          setContact({ ...contact, email: event.target.value.toLowerCase() })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        maxLength={40}
                        value={contact.phone}
                        onChange={(event) =>
                          setContact({ ...contact, phone: event.target.value })
                        }
                      />
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 font-sans leading-relaxed text-foreground">
                      <input
                        type="checkbox"
                        checked={privacyAcknowledged}
                        onChange={(event) => setPrivacyAcknowledged(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      <span>
                        I have read the{" "}
                        <Link
                          to="/privacy"
                          className="text-foreground underline underline-offset-4"
                        >
                          privacy notice
                        </Link>{" "}
                        (version {PRIVACY_NOTICE_VERSION}) and understand how BrightCap will use my
                        information.
                        <span aria-hidden="true" className="text-primary">
                          {" *"}
                        </span>
                      </span>
                    </label>
                  </div>
                )}

                {step === 1 && (
                  <fieldset className="space-y-4">
                    <legend className="font-sans leading-relaxed text-foreground">
                      Choose the basis on which you want to be certified as an investor
                    </legend>

                    {ROUTE_OPTIONS.filter((route) => !declinedKinds.includes(route.kind)).map(
                      (route) => (
                        <label
                          key={route.kind}
                          className="flex cursor-pointer items-start gap-3 border border-border p-4 font-sans text-foreground"
                        >
                          <input
                            type="radio"
                            name="basis"
                            checked={kind === route.kind}
                            onChange={() => {
                              setKind(route.kind);
                            }}
                            className="mt-1.5 h-4 w-4 accent-primary"
                          />
                          <span className="space-y-2">
                            <span className="block font-medium">{route.title}</span>
                            <span className="block leading-relaxed text-secondary">
                              {route.body}
                            </span>
                            {route.bullets && (
                              <span className="block">
                                <ul className="list-disc space-y-1 pl-5 leading-relaxed text-secondary">
                                  {route.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                  ))}
                                </ul>
                              </span>
                            )}
                            {route.note && (
                              <span className="block leading-relaxed text-secondary">
                                {route.note}
                              </span>
                            )}
                          </span>
                        </label>
                      ),
                    )}
                  </fieldset>
                )}

                {step === 2 && kind && (
                  <div className="space-y-8">
                    <StatementQuestions
                      kind={kind}
                      answers={answers[kind] ?? {}}
                      onAnswers={(next) => setAnswers({ ...answers, [kind]: next })}
                      declarations={declarations[kind] ?? {}}
                      onDeclaration={(id, accepted) => setDeclaration(kind, id, accepted)}
                    >
                      {!cancelOnly && (
                        <div className="space-y-6 pt-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="signature">
                              Signature
                              <span aria-hidden="true" className="text-primary">
                                {" *"}
                              </span>
                            </Label>
                            <Input
                              id="signature"
                              required
                              aria-required="true"
                              aria-describedby="signature-help"
                              maxLength={120}
                              value={signatureTyped}
                              onChange={(event) => setSignatureTyped(event.target.value)}
                            />
                            <p
                              id="signature-help"
                              className="font-sans text-xs text-muted-foreground"
                            >
                              Type your full name.
                            </p>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="signed-date">Date</Label>
                            <Input id="signed-date" value={serverDate} readOnly disabled />
                            <p className="font-sans text-xs text-muted-foreground">
                              The date is set by our server at the moment of submission and cannot
                              be edited.
                            </p>
                          </div>
                        </div>
                      )}
                    </StatementQuestions>
                  </div>
                )}

              </div>

              {step === 2 && !cancelOnly && outstanding().length > 0 && (
                <div className="mt-10 border-l-2 border-border pl-4">
                  <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                    Before you can submit
                  </p>
                  <ul className="mt-2 space-y-1">
                    {outstanding().map((item) => (
                      <li key={item} className="font-sans text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-12 flex items-center gap-4">
                {step > (routeLocked ? 2 : 0) && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                {step === 2 && cancelOnly ? (
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Cancel certification
                  </Button>
                ) : step < 2 ? (
                  <Button disabled={!canContinue()} onClick={() => setStep(step + 1)}>
                    Continue
                  </Button>
                ) : (
                  <Button
                    disabled={!canContinue() || outcome.state === "submitting"}
                    onClick={submit}
                  >
                    {outcome.state === "submitting" ? "Submitting…" : "Submit"}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default InvestorEligibility;
