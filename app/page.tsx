import Image from "next/image";
import Link from "next/link";

import { GdvValue } from "@/components/GdvValue";
import { MagneticButton } from "@/components/MagneticButton";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { VastuFloorplanViewer } from "@/components/VastuFloorplanViewer";
import {
  CAPABILITY_GRID,
  JOURNAL_POSTS,
  PROJECTS,
  PROOF_METRICS,
  SERVICES,
} from "@/lib/content";

const featuredProjects = PROJECTS.slice(0, 3);
const featuredPosts = JOURNAL_POSTS.slice(0, 3);

export default function HomePage() {
  return (
    <>
      {/* ============================================================ HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hairline-grid opacity-60" />
        <div className="section-shell relative grid gap-16 pb-20 pt-16 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:pt-24">
          <div>
            <Reveal>
              <p className="eyebrow">South Mumbai · Goa · Bengaluru</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-7 text-display-xl">
                Most developer sites are brochures.{" "}
                <span className="text-brass-dark">
                  We build RERA-compliant pipelines.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-8 max-w-xl text-lead text-monsoon/70">
                Bespoke digital platforms and 3D twins for luxury residences
                across South Mumbai, Goa, and Bengaluru.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-3">
                <MagneticButton href="/contact#brief">
                  Book a 25-minute brief
                </MagneticButton>
                <MagneticButton href="/work" variant="outline">
                  See the work
                </MagneticButton>
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <p className="mt-8 font-mono text-xs leading-relaxed text-monsoon/55">
                Sixteen engagements a year. Fixed fee, agreed before a line is
                written. You own the code outright.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="image-luxury relative aspect-[4/5] w-full border border-monsoon/15">
              <Image
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
                alt="A luxury residence with a timber-lined loggia opening onto a pool terrace"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======================================================= PROOF BAR */}
      <section className="border-y border-monsoon/15 bg-indigo-radial text-ivory">
        <div className="section-shell">
          <dl className="grid gap-px bg-ivory/10 md:grid-cols-2 xl:grid-cols-4">
            {PROOF_METRICS.map((metric, index) => (
              <Reveal
                key={metric.label}
                delay={index * 0.06}
                className="bg-monsoon px-6 py-10"
              >
                <dt className="data-label text-ivory/55">{metric.label}</dt>
                <dd className="mt-3 font-display text-metric text-ivory">
                  {metric.value}
                </dd>
                <p className="mt-3 text-sm leading-relaxed text-ivory/60">
                  {metric.note}
                </p>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ===================================================== CAPABILITIES */}
      <section className="section-shell section-space">
        <SectionHeading
          eyebrow="The engine"
          title="Built in, not bolted on."
          lead="Every capability below is shipped code, running in production for a developer who is selling with it right now."
        />

        <div className="mt-14 grid gap-px border border-monsoon/15 bg-monsoon/15 md:grid-cols-2 xl:grid-cols-3">
          {CAPABILITY_GRID.map((capability, index) => (
            <Reveal
              key={capability.title}
              delay={index * 0.05}
              className="bg-ivory p-8"
            >
              <p className="font-mono text-[0.7rem] font-semibold tracking-[0.16em] text-brass-dark">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-2xl leading-tight">{capability.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-monsoon/70">
                {capability.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================================================== VASTU */}
      <section className="bg-sandstone/60 section-space">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Directional harmony"
            title="The question the family will ask, answered on screen."
            lead="Vastu is not decoration here. The compass, the cross-ventilation corridors and the Brahmasthan are structured data on every plan we publish."
          />
          <Reveal className="mt-14">
            <VastuFloorplanViewer />
          </Reveal>
        </div>
      </section>

      {/* ============================================================ WORK */}
      <section className="section-shell section-space">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Selected work"
            title="Nine launches. ₹4,500 Cr digitized."
            className="max-w-2xl"
          />
          <Reveal delay={0.1}>
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 border-b border-monsoon/25 pb-1.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-450 ease-deliberate hover:border-brass hover:text-brass-dark"
            >
              Full portfolio
              <span className="transition-transform duration-450 ease-deliberate group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.07}>
              <ProjectCard project={project} priority={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ======================================================== SERVICES */}
      <section className="border-y border-monsoon/15 bg-ivory-deep section-space">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Capability matrix"
            title="Four disciplines. One accountable studio."
            lead="No subcontracted CGI, no white-labelled development. The people who scope the work build the work."
          />

          <div className="mt-14 divide-y divide-monsoon/15 border-y border-monsoon/15">
            {SERVICES.map((service, index) => (
              <Reveal
                key={service.index}
                delay={index * 0.05}
                className="grid gap-6 py-8 lg:grid-cols-[6rem_1fr_1fr] lg:gap-10"
              >
                <p className="font-mono text-[0.7rem] font-semibold tracking-[0.16em] text-brass-dark">
                  {service.index}
                </p>
                <div>
                  <h3 className="text-2xl leading-tight">{service.title}</h3>
                  <p className="mt-3 font-mono text-xs tracking-tight text-monsoon/55">
                    {service.engagement}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-monsoon/70">
                  {service.promise}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-12">
            <MagneticButton href="/services" variant="outline">
              Read the full matrix
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ==================================================== THE ARITHMETIC */}
      <section className="section-shell section-space">
        <SectionHeading
          eyebrow="The arithmetic"
          title="One extra closure pays for the platform several times over."
          lead="Substitute your own numbers. The conclusion rarely changes."
        />

        <Reveal className="mt-14 grid gap-px border border-monsoon/15 bg-monsoon/15 md:grid-cols-2 xl:grid-cols-4">
          <div className="bg-ivory p-8">
            <p className="data-label">Typical unit</p>
            <p className="mt-3 font-display text-4xl leading-none">
              <GdvValue crores={12} />
            </p>
            <p className="mt-3 text-sm text-monsoon/65">
              One mid-book residence in a South Mumbai release.
            </p>
          </div>
          <div className="bg-ivory p-8">
            <p className="data-label">Developer margin at 22%</p>
            <p className="mt-3 font-display text-4xl leading-none">
              <GdvValue crores={2.64} />
            </p>
            <p className="mt-3 text-sm text-monsoon/65">
              Contribution from a single additional closure.
            </p>
          </div>
          <div className="bg-ivory p-8">
            <p className="data-label">Platform investment</p>
            <p className="mt-3 font-display text-4xl leading-none">
              <GdvValue crores={0.18} />
            </p>
            <p className="mt-3 text-sm text-monsoon/65">
              Flagship build, one-off, owned outright.
            </p>
          </div>
          <div className="bg-monsoon p-8 text-ivory">
            <p className="data-label text-ivory/55">Break-even</p>
            <p className="mt-3 font-display text-4xl leading-none text-brass-light">
              6.8%
            </p>
            <p className="mt-3 text-sm text-ivory/65">
              Of one closure&apos;s margin. Everything after that is yours.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-6 font-mono text-xs text-monsoon/55">
            Figures illustrative. Toggle the currency control to price this in $
            or AED.
          </p>
        </Reveal>
      </section>

      {/* ========================================================= JOURNAL */}
      <section className="bg-sandstone/60 section-space">
        <div className="section-shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              eyebrow="Journal"
              title="Notes from the desk."
              className="max-w-2xl"
            />
            <Reveal delay={0.1}>
              <Link
                href="/journal"
                className="group inline-flex items-center gap-3 border-b border-monsoon/25 pb-1.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-450 ease-deliberate hover:border-brass hover:text-brass-dark"
              >
                All writing
                <span className="transition-transform duration-450 ease-deliberate group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.07}>
                <article className="group">
                  <div className="image-luxury relative aspect-[16/10] border border-monsoon/15">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-900 ease-deliberate group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-5 data-label">
                    {post.category} · {post.readingTime}
                  </p>
                  <h3 className="mt-3 text-xl leading-tight transition-colors duration-450 ease-deliberate group-hover:text-brass-dark">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-monsoon/70">
                    {post.excerpt}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= CTA */}
      <section className="bg-indigo-radial text-ivory">
        <div className="section-shell section-space">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-brass-light">Next step</p>
            <h2 className="mt-6 text-display-md text-ivory">
              Twenty-five minutes. Screen shared. No deck.
            </h2>
            <p className="mt-6 text-lead text-ivory/70">
              I will walk you through a live build, ask what your current site
              fails to do, and tell you plainly whether this is worth your money.
              If it is not, I will say so.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <MagneticButton href="/contact#brief">
                Book the brief
              </MagneticButton>
              <MagneticButton href="/approach" variant="outline-light">
                How we work
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
