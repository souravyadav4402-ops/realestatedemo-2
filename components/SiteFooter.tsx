import Link from "next/link";

import { NAV_LINKS, SITE } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-indigo-radial text-ivory">
      <div className="section-shell grid gap-12 py-20 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl leading-none text-ivory">
            Studio Meridian
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
            We build RERA-compliant sales platforms and 3D twins for developers
            of consequence. Sixteen engagements a year, no more.
          </p>
          <address className="mt-8 space-y-2 not-italic text-sm text-ivory/70">
            <p>{SITE.address}</p>
            <p>
              <a
                href={`tel:${SITE.phoneHref}`}
                className="font-mono transition-colors duration-450 ease-deliberate hover:text-brass-light"
              >
                {SITE.phoneDisplay}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${SITE.email}`}
                className="font-mono transition-colors duration-450 ease-deliberate hover:text-brass-light"
              >
                {SITE.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <p className="data-label text-ivory/50">Navigate</p>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors duration-450 ease-deliberate hover:text-brass-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="data-label text-ivory/50">Practice</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/70">
            <li>Mumbai · Goa · Bengaluru</li>
            <li>GST 27AABCS1429P1ZV</li>
            <li>Fixed-fee engagements only</li>
            <li>Code and design owned outright</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/15">
        <div className="section-shell flex flex-wrap items-center justify-between gap-4 py-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory/50">
          <span>© 2026 Studio Meridian</span>
          <span>Pipelines, not brochures</span>
        </div>
      </div>
    </footer>
  );
}
