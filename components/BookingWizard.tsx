"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MagneticButton } from "@/components/MagneticButton";
import {
  AUDIENCES,
  AUDIENCE_LABELS,
  GDV_CATEGORIES,
  GDV_LABELS,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  bookBriefSchema,
  type AudienceValue,
  type BookBriefResponse,
  type GdvCategoryValue,
  type ProjectTypeValue,
} from "@/lib/validation";

/**
 * <BookingWizard />
 * -------------------------------------------------------------------------
 * Replaces the traditional contact form with a five-step qualification flow.
 *
 *   1. Project type      — radio chips
 *   2. GDV band          — discrete slider (< ₹50 Cr … ₹500 Cr+)
 *   3. Audience          — Domestic vs NRI (drives CRM desk routing)
 *   4. Contact details   — name, country code + phone, email
 *   5. Calendar          — Cal.com iframe, prefilled from collected state
 *
 * Design intent: qualification happens *before* the calendar, so a slot is
 * only ever offered to someone who has already declared a GDV band. The lead
 * is persisted at the end of step 4 — if the prospect abandons the calendar,
 * the sales desk still has a fully qualified record.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const TOTAL_STEPS = 5;

/** Country codes weighted to where this business actually sells. */
const COUNTRY_CODES = [
  { code: "+91", label: "India" },
  { code: "+971", label: "UAE" },
  { code: "+1", label: "USA / Canada" },
  { code: "+44", label: "United Kingdom" },
  { code: "+65", label: "Singapore" },
  { code: "+974", label: "Qatar" },
  { code: "+966", label: "Saudi Arabia" },
  { code: "+968", label: "Oman" },
  { code: "+973", label: "Bahrain" },
  { code: "+61", label: "Australia" },
  { code: "+852", label: "Hong Kong" },
  { code: "+41", label: "Switzerland" },
] as const;

const STEP_TITLES = [
  "What are we building?",
  "What is the GDV?",
  "Who is buying?",
  "Where do we reach you?",
  "Pick your 25 minutes.",
] as const;

interface WizardState {
  projectType: ProjectTypeValue | null;
  gdvIndex: number;
  audience: AudienceValue | null;
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  notes: string;
  /** Honeypot — must stay empty. */
  company: string;
}

const INITIAL_STATE: WizardState = {
  projectType: null,
  gdvIndex: 2,
  audience: null,
  name: "",
  countryCode: "+91",
  phone: "",
  email: "",
  notes: "",
  company: "",
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "done"; leadId: string };

export function BookingWizard() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const abortRef = useRef<AbortController | null>(null);

  // Abort an in-flight submission if the component unmounts mid-request.
  useEffect(() => () => abortRef.current?.abort(), []);

  const gdvCategory: GdvCategoryValue =
    GDV_CATEGORIES[state.gdvIndex] ?? GDV_CATEGORIES[0];

  const update = useCallback(<K extends keyof WizardState>(
    key: K,
    value: WizardState[K],
  ) => {
    setState((previous) => ({ ...previous, [key]: value }));
    setFieldErrors((previous) => {
      if (!(key in previous)) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }, []);

  /** Steps 1–3 are single-choice; step 4 is validated by Zod on submit. */
  const canAdvance = useMemo(() => {
    if (step === 1) return state.projectType !== null;
    if (step === 2) return true;
    if (step === 3) return state.audience !== null;
    return true;
  }, [step, state.projectType, state.audience]);

  const handleSubmit = useCallback(async () => {
    const parsed = bookBriefSchema.safeParse({
      name: state.name,
      email: state.email,
      countryCode: state.countryCode,
      phone: state.phone,
      projectType: state.projectType,
      gdvCategory,
      audience: state.audience,
      notes: state.notes,
      company: state.company,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      setSubmit({ kind: "idle" });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setSubmit({ kind: "submitting" });

    try {
      const response = await fetch("/api/book-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: controller.signal,
      });

      const result = (await response.json()) as BookBriefResponse;

      if (!response.ok || !result.success) {
        const message =
          !result.success && result.error
            ? result.error
            : "We could not record that. Please try again or call the studio.";

        if (!result.success && result.fieldErrors) {
          const errors: Record<string, string> = {};
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            const first = messages[0];
            if (first) errors[key] = first;
          }
          setFieldErrors(errors);
        }

        setSubmit({ kind: "error", message });
        return;
      }

      setSubmit({ kind: "done", leadId: result.leadId });
      setStep(5);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setSubmit({
        kind: "error",
        message:
          "Network error. Your details were not saved — please retry, or WhatsApp the studio directly.",
      });
    }
  }, [gdvCategory, state]);

  /**
   * Cal.com prefill. Standard params (`name`, `email`, `notes`) populate the
   * booking form; the qualification data rides along as custom params so the
   * booking record in Cal.com matches the CRM record.
   */
  const calendarUrl = useMemo(() => {
    const base =
      process.env.NEXT_PUBLIC_CAL_URL ?? "https://cal.com/studio-meridian/brief";
    const params = new URLSearchParams({
      name: state.name,
      email: state.email,
      "metadata[projectType]": state.projectType ?? "",
      "metadata[gdvBand]": gdvCategory,
      "metadata[audience]": state.audience ?? "",
      "metadata[phone]": `${state.countryCode}${state.phone}`,
      notes: [
        `Project type: ${state.projectType ? PROJECT_TYPE_LABELS[state.projectType] : "—"}`,
        `GDV band: ${GDV_LABELS[gdvCategory]}`,
        `Audience: ${state.audience ? AUDIENCE_LABELS[state.audience] : "—"}`,
        state.notes ? `Notes: ${state.notes}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
      embed: "true",
      theme: "light",
    });
    return `${base}?${params.toString()}`;
  }, [gdvCategory, state]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: EASE };

  return (
    <div className="ledger-card overflow-hidden">
      {/* ------------------------------------------------------- progress */}
      <div className="border-b border-monsoon/15 p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="data-label">
            Step <span className="text-monsoon">{step}</span> of {TOTAL_STEPS}
          </p>
          <p className="data-label">{STEP_TITLES[step - 1]}</p>
        </div>
        <div
          className="mt-4 flex gap-1.5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step}
          aria-label="Booking progress"
        >
          {Array.from({ length: TOTAL_STEPS }, (_, index) => (
            <span
              key={index}
              className={[
                "h-0.5 flex-1 transition-colors duration-450 ease-deliberate",
                index < step ? "bg-brass" : "bg-monsoon/15",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={transition}
          >
            <h3 className="text-2xl leading-tight sm:text-3xl">
              {STEP_TITLES[step - 1]}
            </h3>

            {/* ------------------------------------------- 1. project type */}
            {step === 1 ? (
              <fieldset className="mt-7">
                <legend className="sr-only">Project type</legend>
                <div className="flex flex-wrap gap-2.5">
                  {PROJECT_TYPES.map((option) => {
                    const isActive = state.projectType === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => update("projectType", option)}
                        className={[
                          "rounded-ledger border px-5 py-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-450 ease-deliberate",
                          isActive
                            ? "border-monsoon bg-monsoon text-ivory"
                            : "border-monsoon/25 text-monsoon/75 hover:border-brass hover:text-monsoon",
                        ].join(" ")}
                      >
                        {PROJECT_TYPE_LABELS[option]}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-5 text-sm text-monsoon/60">
                  Mixed-use? Pick the component carrying most of the value — we
                  will unpack the rest on the call.
                </p>
              </fieldset>
            ) : null}

            {/* --------------------------------------------- 2. GDV slider */}
            {step === 2 ? (
              <div className="mt-7">
                <p className="font-display text-4xl leading-none text-monsoon">
                  {GDV_LABELS[gdvCategory]}
                </p>
                <label className="mt-8 block">
                  <span className="sr-only">Gross development value band</span>
                  <input
                    type="range"
                    min={0}
                    max={GDV_CATEGORIES.length - 1}
                    step={1}
                    value={state.gdvIndex}
                    onChange={(event) =>
                      update("gdvIndex", Number(event.target.value))
                    }
                    aria-valuetext={GDV_LABELS[gdvCategory]}
                    className="h-0.5 w-full cursor-pointer appearance-none bg-monsoon/20 accent-brass"
                  />
                </label>
                <div className="mt-4 flex justify-between font-mono text-[0.62rem] uppercase tracking-[0.1em] text-monsoon/50">
                  <span>&lt; ₹50 Cr</span>
                  <span>₹500 Cr+</span>
                </div>
                <p className="mt-6 text-sm text-monsoon/60">
                  We quote against value at stake, not page count. Under ₹50 Cr
                  we will usually tell you a smaller engagement is the honest
                  answer.
                </p>
              </div>
            ) : null}

            {/* ----------------------------------------------- 3. audience */}
            {step === 3 ? (
              <fieldset className="mt-7">
                <legend className="sr-only">Primary buyer audience</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {AUDIENCES.map((option) => {
                    const isActive = state.audience === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => update("audience", option)}
                        className={[
                          "rounded-ledger border p-5 text-left transition-colors duration-450 ease-deliberate",
                          isActive
                            ? "border-brass bg-monsoon text-ivory"
                            : "border-monsoon/25 hover:border-brass",
                        ].join(" ")}
                      >
                        <span className="block font-display text-2xl leading-none">
                          {AUDIENCE_LABELS[option]}
                        </span>
                        <span
                          className={[
                            "mt-2 block text-sm leading-relaxed",
                            isActive ? "text-ivory/75" : "text-monsoon/65",
                          ].join(" ")}
                        >
                          {option === "NRI"
                            ? "Multi-currency, WhatsApp desk and Gulf/Pacific booking hours."
                            : "Domestic buyers across metros, sold on inventory clarity."}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            {/* ------------------------------------------------ 4. contact */}
            {step === 4 ? (
              <form
                className="mt-7 space-y-5"
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSubmit();
                }}
              >
                <Field id="bw-name" label="Full name" error={fieldErrors.name}>
                  <input
                    id="bw-name"
                    className="field-control"
                    value={state.name}
                    onChange={(event) => update("name", event.target.value)}
                    autoComplete="name"
                    required
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-[minmax(0,10rem)_1fr]">
                  <Field
                    id="bw-code"
                    label="Country code"
                    error={fieldErrors.countryCode}
                  >
                    <select
                      id="bw-code"
                      className="field-control"
                      value={state.countryCode}
                      onChange={(event) =>
                        update("countryCode", event.target.value)
                      }
                    >
                      {COUNTRY_CODES.map((entry) => (
                        <option key={entry.code} value={entry.code}>
                          {entry.code} · {entry.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="bw-phone" label="Phone / WhatsApp" error={fieldErrors.phone}>
                    <input
                      id="bw-phone"
                      className="field-control"
                      value={state.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="98200 00000"
                      required
                    />
                  </Field>
                </div>

                <Field id="bw-email" label="Work email" error={fieldErrors.email}>
                  <input
                    id="bw-email"
                    className="field-control"
                    type="email"
                    value={state.email}
                    onChange={(event) => update("email", event.target.value)}
                    autoComplete="email"
                    required
                  />
                </Field>

                <Field
                  id="bw-notes"
                  label="Anything we should read first (optional)"
                  error={fieldErrors.notes}
                >
                  <textarea
                    id="bw-notes"
                    className="field-control min-h-28 resize-y"
                    value={state.notes}
                    onChange={(event) => update("notes", event.target.value)}
                    maxLength={1200}
                    placeholder="Launch timeline, the floor that is not moving, your current site."
                  />
                </Field>

                {/* Honeypot: visually and programmatically hidden from humans. */}
                <div aria-hidden="true" className="hidden">
                  <label htmlFor="bw-company">Company</label>
                  <input
                    id="bw-company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={state.company}
                    onChange={(event) => update("company", event.target.value)}
                  />
                </div>

                <div aria-live="polite">
                  {submit.kind === "error" ? (
                    <p className="border-l-2 border-danger bg-danger/8 px-4 py-3 text-sm text-danger">
                      {submit.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <MagneticButton type="submit">
                    {submit.kind === "submitting"
                      ? "Recording…"
                      : "Save and pick a slot"}
                  </MagneticButton>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-monsoon/60 underline underline-offset-4 hover:text-monsoon"
                  >
                    Back
                  </button>
                </div>

                <p className="text-xs leading-relaxed text-monsoon/55">
                  Your details go to one desk, and one person replies. No
                  sequences, no newsletter, no reselling.
                </p>
              </form>
            ) : null}

            {/* ----------------------------------------------- 5. calendar */}
            {step === 5 ? (
              <div className="mt-6">
                <p className="text-sm leading-relaxed text-monsoon/70">
                  Recorded{submit.kind === "done" ? "" : ""}. Your brief is with
                  the studio — pick a time below and we will have read it before
                  we speak.
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-px border border-monsoon/15 bg-monsoon/15 sm:grid-cols-3">
                  <SummaryCell
                    label="Project"
                    value={
                      state.projectType
                        ? PROJECT_TYPE_LABELS[state.projectType]
                        : "—"
                    }
                  />
                  <SummaryCell label="GDV" value={GDV_LABELS[gdvCategory]} />
                  <SummaryCell
                    label="Audience"
                    value={state.audience ? AUDIENCE_LABELS[state.audience] : "—"}
                  />
                </dl>

                <div className="mt-6 overflow-hidden border border-monsoon/15 bg-ivory">
                  <iframe
                    title="Book a 25-minute brief"
                    src={calendarUrl}
                    className="h-[42rem] w-full border-0"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>

                <p className="mt-4 text-xs leading-relaxed text-monsoon/55">
                  Calendar not loading on your network? Reply to the WhatsApp
                  message we just sent and we will offer times manually.
                </p>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* ------------------------------------------------- step controls */}
        {step < 4 ? (
          <div className="mt-8 flex items-center gap-3">
            <MagneticButton
              onClick={() => setStep((current) => Math.min(current + 1, 4))}
              variant={canAdvance ? "solid" : "outline"}
            >
              Continue
            </MagneticButton>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(current - 1, 1))}
                className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-monsoon/60 underline underline-offset-4 hover:text-monsoon"
              >
                Back
              </button>
            ) : null}
            {!canAdvance ? (
              <span className="text-xs text-monsoon/55">
                Pick one to continue.
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- subcomponents */

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="data-label mb-2 block">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ivory p-4">
      <dt className="data-label">{label}</dt>
      <dd className="mt-1 text-sm text-monsoon">{value}</dd>
    </div>
  );
}
