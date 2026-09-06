import type { Metadata } from "next";
import Image from "next/image";

import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { JOURNAL_POSTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Market analysis, conversion research and CGI practice for Indian luxury real estate — including selling off-plan in Goa with 3D.",
};

const [leadPost, ...restPosts] = JOURNAL_POSTS;

export default function JournalPage() {
  return (
    <>
      <section className="section-shell pb-12 pt-16 lg:pt-20">
        <Reveal>
          <p className="eyebrow">Journal</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-7 max-w-4xl text-display-lg">
            What we have learned selling ₹4,500 Cr of inventory.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-2xl text-lead text-monsoon/70">
            Written for developers and sales heads, not for search engines. No
            gated PDFs and no email wall.
          </p>
        </Reveal>
      </section>

      {/* ======================================================= lead article */}
      {leadPost ? (
        <section className="section-shell pb-16">
          <Reveal>
            <article className="ledger-card group grid overflow-hidden lg:grid-cols-[1.2fr_1fr]">
              <div className="image-luxury relative aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]">
                <Image
                  src={leadPost.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-900 ease-deliberate group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <p className="data-label">
                  {leadPost.category} · {leadPost.readingTime} · {leadPost.publishedOn}
                </p>
                <h2 className="mt-5 text-display-md leading-none">
                  {leadPost.title}
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-monsoon/75">
                  {leadPost.excerpt}
                </p>
                <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brass-dark">
                  Featured analysis
                </p>
              </div>
            </article>
          </Reveal>
        </section>
      ) : null}

      {/* =========================================================== SEO grid */}
      <section className="section-shell pb-section">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {restPosts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.06}>
              <article className="group flex h-full flex-col">
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
                <p className="mt-auto pt-5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-monsoon/50">
                  {post.publishedOn}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-monsoon/15 bg-ivory-deep">
        <div className="section-shell section-space">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Monthly note</p>
            <h2 className="mt-6 text-display-md">
              One email a month. Numbers, not news.
            </h2>
            <p className="mt-6 text-lead text-monsoon/70">
              Absorption data and conversion findings from live launches in
              Mumbai, Goa and Bengaluru. Sent on the first. Unsubscribe in one
              click.
            </p>
            <div className="mt-10">
              <MagneticButton href="/contact#brief" variant="outline">
                Ask to be added
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
