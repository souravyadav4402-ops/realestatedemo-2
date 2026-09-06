import type { Metadata } from "next";

import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { WorkGallery } from "@/components/WorkGallery";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Nine launches across Goa estates, Mumbai high-rises and NRI flagships. GDV, RERA status and outcome stated on every project.",
};

export default function WorkPage() {
  return (
    <>
      <section className="section-shell pb-12 pt-16 lg:pt-20">
        <Reveal>
          <p className="eyebrow">Portfolio</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-7 max-w-4xl text-display-lg">
            Nine launches. Every number stated plainly.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-2xl text-lead text-monsoon/70">
            Gross development value, RERA registration and the commercial
            outcome for each engagement. Where a project is not Vastu-planned we
            say so rather than quietly omitting it.
          </p>
        </Reveal>
      </section>

      <section className="section-shell pb-section">
        <WorkGallery />
      </section>

      <section className="bg-indigo-radial text-ivory">
        <div className="section-shell section-space">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-brass-light">Under NDA</p>
            <h2 className="mt-6 text-display-md text-ivory">
              Four more launches are not on this page.
            </h2>
            <p className="mt-6 text-lead text-ivory/70">
              Some developers require that their pre-launch platform never
              appears in a portfolio. If you are evaluating us for a discreet
              release, ask on the call and we will walk the build live instead.
            </p>
            <div className="mt-10">
              <MagneticButton href="/contact#brief">
                Request a private walkthrough
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
