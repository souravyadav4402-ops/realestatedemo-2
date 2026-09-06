"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MagneticButton } from "@/components/MagneticButton";
import { NAV_LINKS, SITE } from "@/lib/content";

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet on navigation and lock the body while it is open.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-450 ease-deliberate",
        isScrolled
          ? "border-b border-monsoon/15 bg-ivory/90 backdrop-blur-md"
          : "border-b border-transparent",
      ].join(" ")}
    >
      <div className="section-shell flex h-full items-center justify-between gap-6">
        <Link href="/" className="flex items-baseline gap-2" aria-label={`${SITE.name} — home`}>
          <span className="font-display text-2xl leading-none tracking-tight">
            Studio Meridian
          </span>
          <span className="data-label hidden sm:inline">EST. 2017</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.filter((link) => link.href !== "/").map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className="group relative py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
              >
                {link.label}
                <span
                  className={[
                    "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-brass transition-transform duration-450 ease-deliberate",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.phoneHref}`}
            className="hidden font-mono text-xs tracking-tight text-monsoon/80 transition-colors duration-450 ease-deliberate hover:text-brass-dark xl:inline"
          >
            {SITE.phoneDisplay}
          </a>
          <MagneticButton href="/contact#brief" className="hidden sm:inline-flex">
            Book a brief
          </MagneticButton>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 flex-col items-end justify-center gap-1.5 lg:hidden"
          >
            <span
              className={[
                "h-px bg-monsoon transition-all duration-450 ease-deliberate",
                isMenuOpen ? "w-6 translate-y-[3.5px] rotate-45" : "w-6",
              ].join(" ")}
            />
            <span
              className={[
                "h-px bg-monsoon transition-all duration-450 ease-deliberate",
                isMenuOpen ? "w-6 -translate-y-[3.5px] -rotate-45" : "w-4",
              ].join(" ")}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!isMenuOpen}
        className="fixed inset-0 top-20 bg-ivory px-gutter pb-10 pt-8 lg:hidden"
      >
        <ul className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-monsoon/10">
              <Link
                href={link.href}
                className="block py-4 font-display text-4xl leading-tight"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3">
          <MagneticButton href="/contact#brief">Book a brief</MagneticButton>
          <a href={`tel:${SITE.phoneHref}`} className="font-mono text-xs tracking-tight">
            {SITE.phoneDisplay}
          </a>
          <a href={`mailto:${SITE.email}`} className="font-mono text-xs tracking-tight">
            {SITE.email}
          </a>
        </div>
      </div>
    </header>
  );
}
