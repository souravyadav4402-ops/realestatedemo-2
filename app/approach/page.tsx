import type { Metadata } from "next";

import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { VastuFloorplanViewer } from "@/components/VastuFloorplanViewer";
import { APPROACH_PRINCIPLES, PROCESS_STEPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "Subtle Vastu integration, sensorial digital luxury and ledger-grade honesty — the four principles behind every Studio Meridian build.",
};

export default function ApproachPage() {
  return (
    <>
      <section className="section-shell pb-12 pt-16 lg:pt-20">
        <Reveal>
          <p className="eyebrow">The ethos</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-7 max-w-4xl text-display-lg">
            Restraint is the most expensive thing on the page.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-2xl text-lead text-monsoon/70">
            Four principles decide every argument we have internally about a
            build. They are why our work looks like a private bank rather than a
            property portal.
          </p>
        </Reveal>
      </section>

      {/* ====================================================== principles */}
      <section className="section-shell pb-section">
        <div className="border-t border-monsoon/15">
          {APPROACH_PRINCIPLES.map((principle, index) => (
            <Reveal
              key={principle.index}
              delay={index * 0.05}
              className="grid gap-6 border-b border-monsoon/15 py-12 lg:grid-cols-[6rem_1fr_1.2fr] lg:gap-12"
            >
              <p className="font-mono text-[0.7rem] font-semibold tracking-[0.16em] text-brass-dark">
                {principle.index}
              </p>
              <h2 className="text-display-md leading-none">{principle.title}</h2>
              <p className="text-sm leading-relaxed text-monsoon/75">
                {principle.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================================================== vastu */}
      <section className="bg-sandstone/60 section-space">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Subtle Vastu integration"
            title="Directional data, not decoration."
            lead="The interface itself respects orientation: entry weighted north-east, dense financial tables placed south-west, and the Brahmasthan left visibly clear."
          />
          <Reveal className="mt-14">
            <VastuFloorplanViewer />
          </Reveal>
        </div>
      </section>

      {/* ========================================================= process */}
      <section className="section-shell section-space">
        <SectionHeading
          eyebrow="How it runs"
          title="Ten weeks. Four decisions from you."
          lead="You are running a development business, not a web project. Your total time commitment is roughly five hours across the entire build."
        />

        <div className="mt-14 border-t border-monsoon/15">
          {PROCESS_STEPS.map((step, index) => (
            <Reveal
              key={step.phase}
              delay={index * 0.05}
              className="grid gap-4 border-b border-monsoon/15 py-8 lg:grid-cols-[9rem_1fr_1.4fr] lg:gap-10"
            >
              <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brass-dark">
                {step.phase}
              </p>
              <h3 className="text-2xl leading-tight">{step.title}</h3>
              <p className="text-sm leading-relaxed text-monsoon/70">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ====================================================== what we say no to */}
      <section className="bg-indigo-radial text-ivory">
        <div className="section-shell section-space">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-brass-light">Plainly</p>
            <h2 className="mt-6 text-display-md text-ivory">
              What we will decline.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px bg-ivory/10 md:grid-cols-3">
            {[
              {
                title: "Renders that flatter the site",
                body: "If the tower blocks the sea view from the 12th floor, the render shows it. A buyer who feels misled at handover never refers you.",
              },
              {
                title: "Hiding the price",
                body: "“Price on request” filters out the buyer who has already done their maths — which is precisely the buyer you want.",
              },
              {
                title: "Retainers with no ceiling",
                body: "Fixed fee, fixed scope, owned outright. We would rather you did not need us in month seven.",
              },
            ].map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 0.06}
                className="bg-monsoon p-8"
              >
                <h3 className="text-xl leading-tight text-ivory">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-12">
            <MagneticButton href="/contact#brief">
              Book a 25-minute brief
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
