/**
 * Editorial + portfolio content.
 *
 * Kept as typed constants so pages stay server-rendered and fast. The shapes
 * mirror `prisma.Project`, so swapping this for a Prisma query later is a
 * data-source change, not a component rewrite.
 */

export const SITE = {
  name: "Studio Meridian",
  tagline: "Digital platforms for Indian real estate",
  phoneDisplay: "+91 22 6100 4402",
  phoneHref: "+912261004402",
  email: "studio@studiomeridian.in",
  address: "Kalpataru Prestige, Worli, Mumbai 400018",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/approach", label: "Approach" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------------ proof */

export interface ProofMetric {
  value: string;
  label: string;
  note: string;
}

export const PROOF_METRICS: readonly ProofMetric[] = [
  {
    value: "₹4,500 Cr+",
    label: "GDV digitized",
    note: "Across 34 launches in Mumbai, Goa and Bengaluru since 2017.",
  },
  {
    value: "98%",
    label: "NRI conversion lift",
    note: "Median improvement in qualified NRI enquiry-to-site-visit rate.",
  },
  {
    value: "11 days",
    label: "Median time to first booking",
    note: "From platform launch to first registered expression of interest.",
  },
  {
    value: "100%",
    label: "RERA-compliant builds",
    note: "Every disclosure, QR and carpet-area statement audited pre-launch.",
  },
] as const;

/* --------------------------------------------------------------- projects */

export const WORK_FILTERS = [
  { id: "all", label: "All Work" },
  { id: "goa", label: "Goa Estates" },
  { id: "mumbai", label: "Mumbai High-Rises" },
  { id: "nri", label: "NRI Flagships" },
] as const;

export type WorkFilterId = (typeof WORK_FILTERS)[number]["id"];

export type ReraStatus = "Registered" | "Pre-Registration" | "Phase II Filed";

export interface ProjectRecord {
  slug: string;
  title: string;
  developer: string;
  location: string;
  category: Exclude<WorkFilterId, "all">;
  /** Gross Development Value in ₹ crore — the single stored unit. */
  gdvInCrores: number;
  reraNumber: string;
  reraStatus: ReraStatus;
  isVastuCompliant: boolean;
  year: number;
  summary: string;
  outcome: string;
  capabilities: readonly string[];
  image: string;
}

const render = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PROJECTS: readonly ProjectRecord[] = [
  {
    slug: "aranya-siolim",
    title: "Aranya, Siolim",
    developer: "Verdant Estates",
    location: "Siolim, North Goa",
    category: "goa",
    gdvInCrores: 480,
    reraNumber: "PRGO01230918",
    reraStatus: "Registered",
    isVastuCompliant: true,
    year: 2025,
    summary:
      "Fourteen laterite-and-glass villas sold off-plan to buyers who never saw the site before booking.",
    outcome: "72% of inventory reserved from the 3D twin alone.",
    capabilities: ["WebGL 3D twin", "Sun-path study", "NRI portal"],
    image: render("1613490493576-7fde63acd811"),
  },
  {
    slug: "the-worli-meridian",
    title: "The Worli Meridian",
    developer: "Kanchan Group",
    location: "Worli Sea Face, Mumbai",
    category: "mumbai",
    gdvInCrores: 1240,
    reraNumber: "P51900049812",
    reraStatus: "Registered",
    isVastuCompliant: true,
    year: 2026,
    summary:
      "A 62-storey tower with per-floor view simulation — buyers compare the 41st and 52nd floor before an agent calls.",
    outcome: "₹310 Cr booked in the first 45 days of the private release.",
    capabilities: ["Floor-wise view engine", "Vastu floorplans", "Multi-currency"],
    image: render("1600585154526-990dced4db0d"),
  },
  {
    slug: "casa-dourada",
    title: "Casa Dourada",
    developer: "Sequeira & Sons",
    location: "Assagao, North Goa",
    category: "goa",
    gdvInCrores: 265,
    reraNumber: "PRGO02241104",
    reraStatus: "Phase II Filed",
    isVastuCompliant: false,
    year: 2025,
    summary:
      "Restored Portuguese-Goan manor split into nine residences, marketed to Bombay and London simultaneously.",
    outcome: "Average enquiry-to-visit time cut from 19 days to 6.",
    capabilities: ["Heritage CGI", "Timezone-aware booking", "WhatsApp desk"],
    image: render("1416331108676-a22ccb276e35"),
  },
  {
    slug: "prabhadevi-atelier",
    title: "Prabhadevi Atelier",
    developer: "Nirvaan Realty",
    location: "Prabhadevi, Mumbai",
    category: "mumbai",
    gdvInCrores: 720,
    reraNumber: "P51900051277",
    reraStatus: "Registered",
    isVastuCompliant: true,
    year: 2024,
    summary:
      "Eighteen full-floor residences where every plan ships with a Vastu overlay and cross-ventilation diagram.",
    outcome: "41% fewer pre-booking site visits required per closure.",
    capabilities: ["Vastu viewer", "Ledger-grade pricing", "CRM routing"],
    image: render("1600607687920-4e2a09cf159d"),
  },
  {
    slug: "the-emirates-gateway",
    title: "The Emirates Gateway",
    developer: "Kanchan Group",
    location: "Bandra Kurla Complex, Mumbai",
    category: "nri",
    gdvInCrores: 960,
    reraNumber: "P51800052904",
    reraStatus: "Registered",
    isVastuCompliant: true,
    year: 2026,
    summary:
      "Built for Gulf capital: AED-first pricing, Dubai-hour booking slots, and a repatriation FAQ vetted by counsel.",
    outcome: "63% of registered interest originated in the UAE.",
    capabilities: ["AED/USD engine", "FEMA guidance", "Gulf-hour scheduling"],
    image: render("1602343168117-bb8ffe3e2e9f"),
  },
  {
    slug: "indiranagar-house",
    title: "Indiranagar House",
    developer: "Yellow Brick Developments",
    location: "Indiranagar, Bengaluru",
    category: "nri",
    gdvInCrores: 148,
    reraNumber: "PRM/KA/RERA/1251/446/PR/241118",
    reraStatus: "Registered",
    isVastuCompliant: true,
    year: 2025,
    summary:
      "Twenty-two units aimed squarely at Bay Area engineers buying their first Indian asset.",
    outcome: "Pacific-hour booking slots produced 58% of all calls taken.",
    capabilities: ["USD toggle", "PST/IST booking", "Title transparency"],
    image: render("1523217582562-09d0def993a6"),
  },
  {
    slug: "vagator-cliff-estates",
    title: "Vagator Cliff Estates",
    developer: "Verdant Estates",
    location: "Vagator, North Goa",
    category: "goa",
    gdvInCrores: 340,
    reraNumber: "PRGO03250216",
    reraStatus: "Pre-Registration",
    isVastuCompliant: false,
    year: 2027,
    summary:
      "A cliff parcel sold on monsoon-accurate renders — we modelled the site in July light, not brochure light.",
    outcome: "Pre-registration waitlist of 400 verified buyers.",
    capabilities: ["Monsoon-light CGI", "Waitlist engine", "Drone survey twin"],
    image: render("1613977257363-707ba9348227"),
  },
  {
    slug: "malabar-hill-residences",
    title: "Malabar Hill Residences",
    developer: "Shringar Estates",
    location: "Malabar Hill, Mumbai",
    category: "mumbai",
    gdvInCrores: 1580,
    reraNumber: "P51900048330",
    reraStatus: "Registered",
    isVastuCompliant: true,
    year: 2024,
    summary:
      "South Mumbai's most discreet release — no public listing, a gated platform, and invitation-only access.",
    outcome: "Entire release placed without a single public advertisement.",
    capabilities: ["Gated access", "NDA-gated 3D", "Private ledger"],
    image: render("1600585154340-be6161a56a0c"),
  },
  {
    slug: "the-singapore-line",
    title: "The Singapore Line",
    developer: "Nirvaan Realty",
    location: "Lower Parel, Mumbai",
    category: "nri",
    gdvInCrores: 610,
    reraNumber: "P51900050441",
    reraStatus: "Phase II Filed",
    isVastuCompliant: true,
    year: 2026,
    summary:
      "SGD-aware pricing and a documentation vault that answers the questions Singapore buyers ask before they ask them.",
    outcome: "Document-vault users converted at 3.1x the site average.",
    capabilities: ["Document vault", "Multi-currency", "WhatsApp API"],
    image: render("1600047509807-ba8f99d2cdde"),
  },
] as const;

/* --------------------------------------------------------------- services */

export interface ServiceRecord {
  index: string;
  title: string;
  promise: string;
  deliverables: readonly string[];
  engagement: string;
}

export const SERVICES: readonly ServiceRecord[] = [
  {
    index: "01",
    title: "Brand Strategy & Positioning",
    promise:
      "Before a pixel exists we settle who this building is for and what it is worth. Most developer branding fails because it describes concrete instead of buyers.",
    deliverables: [
      "Buyer-cohort definition (domestic, NRI, investor)",
      "Price-narrative and comparable positioning",
      "Naming, identity system and typographic voice",
      "Sales-collateral architecture",
    ],
    engagement: "3–4 weeks · ₹6L – ₹12L",
  },
  {
    index: "02",
    title: "CGI & Virtual Architecture",
    promise:
      "Renders that survive a site visit. We model true site orientation, real monsoon light and honest sightlines — because a buyer who feels misled at handover never refers you.",
    deliverables: [
      "Exterior and interior CGI stills, print-grade",
      "WebGL 3D twins with per-floor view simulation",
      "Sun-path and shadow studies across seasons",
      "Cinematic flythrough and drone-plate compositing",
    ],
    engagement: "6–10 weeks · ₹8L – ₹22L",
  },
  {
    index: "03",
    title: "Next.js Web Platforms",
    promise:
      "A platform, not a page. Server-rendered, RERA-audited, and fast on a 4G phone in Andheri — which is where half your traffic actually is.",
    deliverables: [
      "Next.js App Router build with typed data layer",
      "RERA disclosure, QR and carpet-area compliance",
      "Inventory, pricing and availability ledger",
      "Core Web Vitals budget enforced in CI",
    ],
    engagement: "8–12 weeks · ₹10L – ₹25L",
  },
  {
    index: "04",
    title: "NRI Investor Portals",
    promise:
      "The highest-margin buyer you are currently losing to timezones. Multi-currency, WhatsApp-native, and scheduled in the buyer's working day, not yours.",
    deliverables: [
      "Multi-currency engine (₹ Cr / $ M / AED)",
      "Meta WhatsApp Business API conversation desk",
      "Timezone-aware booking across IST, GST and PST",
      "FEMA, repatriation and title documentation vault",
    ],
    engagement: "6–9 weeks · ₹9L – ₹18L",
  },
] as const;

export const CAPABILITY_GRID = [
  {
    title: "WebGL 3D sun-paths",
    body: "Buyers scrub through the day and watch light move across the actual plot. Sells upper floors without a site visit.",
  },
  {
    title: "Multi-currency engines",
    body: "One toggle re-prices the entire inventory in ₹ Cr, $ M or AED. No mental arithmetic between a buyer and a booking.",
  },
  {
    title: "Vastu floorplan overlays",
    body: "Directional compass, cross-ventilation paths and Brahmasthan marked on every plan. Answers the question your buyer's family will ask.",
  },
  {
    title: "RERA-native compliance",
    body: "Registration numbers, QR codes and carpet-area disclosures are structured data, not footnote images.",
  },
  {
    title: "WhatsApp lead desk",
    body: "Meta Business API hooks the enquiry the moment it lands. Median first response falls from hours to under a minute.",
  },
  {
    title: "Timezone-aware booking",
    body: "A Dubai buyer sees Gulf hours; a Sunnyvale buyer sees Pacific. Your sales head still sees IST.",
  },
] as const;

/* --------------------------------------------------------------- approach */

export const APPROACH_PRINCIPLES = [
  {
    index: "01",
    title: "Subtle Vastu Integration",
    body:
      "We do not decorate a site with astrology. We respect directional harmony in the interface itself: entry points weighted north-east, dense financial data placed south-west, and floorplans that surface the compass instead of hiding it. When a buyer's family asks about the Brahmasthan, the answer is already on screen.",
  },
  {
    index: "02",
    title: "Sensorial Digital Luxury",
    body:
      "Luxury online is restraint, not motion. Slow deliberate easing, marble-warm ivory, brass used once per screen, and typography with real contrast. Nothing bounces. Nothing autoplays with sound. The interface behaves like a well-made door — heavy, quiet, precise.",
  },
  {
    index: "03",
    title: "Ledger-Grade Honesty",
    body:
      "Price, carpet area, RERA number and possession date are stated plainly on every unit. Hiding the number to force an enquiry is a 2011 tactic that filters out exactly the buyer you want — the one who has already done their maths.",
  },
  {
    index: "04",
    title: "Built for the Family Decision",
    body:
      "An ₹18 Cr apartment is never bought alone. Every page is designed to be forwarded — to a spouse in Dubai, a father in Pune, a CA in Bandra. Shareable state, printable plans, and copy that survives being read out loud.",
  },
] as const;

export const PROCESS_STEPS = [
  {
    phase: "Week 1",
    title: "Positioning session",
    body:
      "Ninety minutes with your sales head, not your marketing agency. Who is actually buying, what they object to, and which floor is not moving.",
  },
  {
    phase: "Week 2–3",
    title: "One page, fully designed",
    body:
      "We design the hardest screen first — usually the unit-detail page. You approve direction on real content, never on a mood board.",
  },
  {
    phase: "Week 4–9",
    title: "Build and CGI in parallel",
    body:
      "Platform engineering and 3D production run together on a private staging link you can watch fill up daily.",
  },
  {
    phase: "Week 10",
    title: "Launch and handover",
    body:
      "RERA audit, CRM routing tested against your live desk, WhatsApp templates approved, and a recorded walkthrough for your team.",
  },
] as const;

/* ---------------------------------------------------------------- journal */

export interface JournalPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readingTime: string;
  publishedOn: string;
  image: string;
}

export const JOURNAL_POSTS: readonly JournalPost[] = [
  {
    slug: "selling-off-plan-in-goa",
    title: "Selling Off-Plan in Goa: The Case for 3D",
    category: "Market Analysis",
    excerpt:
      "Goa's buyer is rarely in Goa. We looked at 14 North Goa launches to see what a credible 3D twin does to off-plan absorption — and where it quietly backfires.",
    readingTime: "9 min",
    publishedOn: "2 September 2026",
    image: render("1613977257363-707ba9348227", 900),
  },
  {
    slug: "nri-buyer-loses-patience",
    title: "The 47 Seconds Where You Lose the NRI Buyer",
    category: "Conversion",
    excerpt:
      "It is not the price. It is the moment a Dubai buyer has to convert ₹12.4 Cr into dirhams in their head, on a phone, at 11pm GST.",
    readingTime: "6 min",
    publishedOn: "21 August 2026",
    image: render("1600585154084-4e5fe7c39198", 900),
  },
  {
    slug: "rera-as-a-sales-asset",
    title: "RERA Is a Sales Asset, Not a Legal Chore",
    category: "Compliance",
    excerpt:
      "Most developers bury their registration number in a footer image. The ones who publish it as structured data rank better and get fewer time-wasting calls.",
    readingTime: "7 min",
    publishedOn: "9 August 2026",
    image: render("1600210492486-724fe5c67fb0", 900),
  },
  {
    slug: "vastu-on-screen",
    title: "Putting Vastu On Screen Without Losing the Architect",
    category: "Design",
    excerpt:
      "A practical method for surfacing directional data on floorplans that satisfies the family, the architect and the RERA carpet-area statement at once.",
    readingTime: "8 min",
    publishedOn: "28 July 2026",
    image: render("1584622650111-993a426fbf0a", 900),
  },
  {
    slug: "why-brochure-sites-fail",
    title: "Why Brochure Sites Fail Above ₹5 Crore",
    category: "Strategy",
    excerpt:
      "Under ₹2 Cr, a brochure site is survivable. Above ₹5 Cr the buyer expects underwriting-grade information, and a gallery plus a contact form reads as evasion.",
    readingTime: "5 min",
    publishedOn: "14 July 2026",
    image: render("1600607686527-6fb886090705", 900),
  },
  {
    slug: "monsoon-accurate-renders",
    title: "Model the Monsoon: Renders That Survive Handover",
    category: "CGI",
    excerpt:
      "Every Indian render is shot in golden December light. Here is what happens to referral rates when you show the buyer July instead.",
    readingTime: "6 min",
    publishedOn: "30 June 2026",
    image: render("1615529162924-f8605388461d", 900),
  },
] as const;

/* ----------------------------------------------------------- floorplan UI */

export interface VastuZone {
  id: string;
  direction: string;
  label: string;
  detail: string;
  /** Percentage coordinates over the plan image. */
  x: number;
  y: number;
}

export const SAMPLE_FLOORPLAN = {
  unit: "Residence 4102 · Malabar Hill",
  carpetArea: "4,120 sq ft",
  reraNumber: "P51900048330",
  image: render("1600607687939-ce8a6c25118c", 1400),
  zones: [
    {
      id: "ne-entry",
      direction: "NE",
      label: "Entry & Puja",
      detail:
        "Primary entry weighted north-east, with the puja niche set on the Ishanya corner.",
      x: 74,
      y: 20,
    },
    {
      id: "se-kitchen",
      direction: "SE",
      label: "Agni · Kitchen",
      detail: "Kitchen placed in the Agneya corner with the cooking axis facing east.",
      x: 76,
      y: 74,
    },
    {
      id: "sw-primary",
      direction: "SW",
      label: "Primary Suite",
      detail:
        "Heaviest mass and the primary suite anchored south-west for stability.",
      x: 22,
      y: 78,
    },
    {
      id: "nw-guest",
      direction: "NW",
      label: "Guest & Utility",
      detail: "Guest bedroom and utility on the Vayavya side for movement and air.",
      x: 20,
      y: 22,
    },
    {
      id: "center",
      direction: "Center",
      label: "Brahmasthan",
      detail: "Central volume left unbuilt as a double-height court — no columns, no ducting.",
      x: 49,
      y: 49,
    },
  ] satisfies readonly VastuZone[],
} as const;
