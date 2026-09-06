import type { Metadata } from "next";

import { BookingWizard } from "@/components/BookingWizard";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Twenty-five minutes, screen shared, no deck. Qualify your project and book a brief with Studio Meridian.",
};

export default function ContactPage() {
  return (
    <section className="section-shell pb-section pt-16 lg:pt-20">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        {/* ------------------------------------------------------ hard copy */}
        <div>
          <Reveal>
            <p className="eyebrow">Booking engine</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-7 text-display-lg">
              25 minutes. Screen shared. No deck.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 text-lead text-monsoon/70">
              I will tell you plainly if this is worth your money.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-10 space-y-6 border-t border-monsoon/15 pt-10">
              <div>
                <p className="data-label">What happens on the call</p>
                <p className="mt-3 text-sm leading-relaxed text-monsoon/75">
                  We open a live build, not slides. You tell me which floor is
                  not moving and what your current site fails to do. I tell you
                  what I would change, what it costs, and whether a smaller
                  engagement would serve you better.
                </p>
              </div>

              <div>
                <p className="data-label">What I will ask for</p>
                <p className="mt-3 text-sm leading-relaxed text-monsoon/75">
                  Your RERA registration number, current absorption rate, and
                  the buyer mix you are actually closing. Rough figures are
                  fine — I am checking fit, not auditing you.
                </p>
              </div>

              <div>
                <p className="data-label">What will not happen</p>
                <p className="mt-3 text-sm leading-relaxed text-monsoon/75">
                  No proposal deck sent three days later. No follow-up sequence.
                  No junior account manager. One reply, from the person who
                  would run your build.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <dl className="mt-10 grid gap-px border border-monsoon/15 bg-monsoon/15 sm:grid-cols-2">
              <div className="bg-sandstone p-5">
                <dt className="data-label">Direct</dt>
                <dd className="mt-2 text-sm">
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="font-data transition-colors duration-450 ease-deliberate hover:text-brass-dark"
                  >
                    {SITE.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div className="bg-sandstone p-5">
                <dt className="data-label">Email</dt>
                <dd className="mt-2 break-all text-sm">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="font-data transition-colors duration-450 ease-deliberate hover:text-brass-dark"
                  >
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div className="bg-sandstone p-5 sm:col-span-2">
                <dt className="data-label">Studio</dt>
                <dd className="mt-2 text-sm text-monsoon/75">{SITE.address}</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* -------------------------------------------------- booking wizard */}
        <div id="brief" className="scroll-mt-28">
          <Reveal delay={0.08}>
            <BookingWizard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
