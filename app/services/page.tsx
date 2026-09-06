import type { Metadata } from "next";

import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CAPABILITY_GRID, SERVICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand strategy, CGI and virtual architecture, Next.js web platforms, and NRI investor portals with WhatsApp API and timezone-aware booking.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="section-shell pb-12 pt-16 lg:pt-20">
        <Reveal>
          <p className="eyebrow">The engine</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-7 max-w-4xl text-display-lg">
            Four disciplines, priced against value at stake.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-2xl text-lead text-monsoon/70">
            We do not sell hours or page counts. Each engagement below is fixed
            fee, agreed in writing before work starts, and delivered by the
            people who scoped it.
          </p>
        </Reveal>
      </section>

      {/* ================================================= capability matrix */}
      <section className="section-shell pb-section">
        <div className="border-t border-monsoon/15">
          {SERVICES.map((service, index) => (
            <Reveal
              key={service.index}
              delay={index * 0.05}
              className="grid gap-8 border-b border-monsoon/15 py-12 lg:grid-cols-[6rem_1fr_1fr] lg:gap-12"
            >
              <p className="font-mono text-[0.7rem] font-semibold tracking-[0.16em] text-brass-dark">
                {service.index}
              </p>

              <div>
                <h2 className="text-display-md leading-none">{service.title}</h2>
                <p className="mt-5 text-sm leading-relaxed text-monsoon/70">
                  {service.promise}
                </p>
                <p className="mt-6 inline-block rounded-ledger border border-monsoon/20 px-3 py-2 font-mono text-xs tracking-tight text-monsoon/70">
                  {service.engagement}
                </p>
              </div>

              <div>
                <p className="data-label">Deliverables</p>
                <ul className="mt-4 space-y-3">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 border-b border-monsoon/10 pb-3 text-sm leading-relaxed text-monsoon/75"
                    >
                      <span aria-hidden="true" className="text-brass-dark">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================================================= platform */}
      <section className="border-y border-monsoon/15 bg-ivory-deep section-space">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Shipped capabilities"
            title="What actually ends up in the build."
            lead="Not a roadmap. Each of these is running in a live developer platform today."
          />
          <div className="mt-14 grid gap-px border border-monsoon/15 bg-monsoon/15 md:grid-cols-2 xl:grid-cols-3">
            {CAPABILITY_GRID.map((capability, index) => (
              <Reveal
                key={capability.title}
                delay={index * 0.05}
                className="bg-ivory p-8"
              >
                <h3 className="text-xl leading-tight">{capability.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-monsoon/70">
                  {capability.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== NRI */}
      <section className="section-shell section-space">
        <SectionHeading
          eyebrow="NRI investor portals"
          title="The buyer you are losing to a timezone."
          lead="Roughly a fifth of luxury Indian inventory is bought from abroad, and most developer sites are built as though everyone is in Mumbai at 3pm."
        />

        <div className="mt-14 grid gap-px border border-monsoon/15 bg-monsoon/15 md:grid-cols-3">
          {[
            {
              title: "Multi-currency engine",
              body: "One control re-prices the whole inventory in ₹ Cr, $ M or AED. A Dubai buyer never has to do mental arithmetic at 11pm GST.",
            },
            {
              title: "WhatsApp API desk",
              body: "Meta Business API fires an approved template the second a brief lands, then routes the thread to a named advisor — not a shared inbox.",
            },
            {
              title: "Timezone-aware booking",
              body: "Slots render in the buyer's working day across IST, GST and PST. Your sales head still sees a single IST calendar.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06} className="bg-ivory p-8">
              <h3 className="text-xl leading-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-monsoon/70">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12">
          <MagneticButton href="/contact#brief">
            Scope an engagement
          </MagneticButton>
        </Reveal>
      </section>
    </>
  );
}
