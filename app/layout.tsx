import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Rozha_One } from "next/font/google";

import { CurrencyToggle } from "@/components/CurrencyToggle";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CurrencyProvider } from "@/lib/currency";

import "./globals.css";

/* Display serif for headlines, geometric sans for UI, mono for all numerals. */
const display = Rozha_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-rozha-one",
});

const body = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studiomeridian.in"),
  title: {
    default: "Studio Meridian — RERA-compliant sales platforms for Indian developers",
    template: "%s · Studio Meridian",
  },
  description:
    "We build bespoke digital platforms and 3D twins for luxury residences across South Mumbai, Goa and Bengaluru. ₹4,500 Cr+ digitized.",
  keywords: [
    "real estate web design India",
    "RERA compliant website",
    "luxury developer marketing Mumbai",
    "NRI investor portal",
    "3D property twin",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Studio Meridian",
    title: "Most developer sites are brochures. We build pipelines.",
    description:
      "Bespoke digital platforms and 3D twins for luxury residences across South Mumbai, Goa and Bengaluru.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1A2B3C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <CurrencyProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-[60] focus:bg-monsoon focus:px-4 focus:py-2 focus:text-ivory"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="pt-20">
            {children}
          </main>
          <SiteFooter />
          <CurrencyToggle />
        </CurrencyProvider>
      </body>
    </html>
  );
}
