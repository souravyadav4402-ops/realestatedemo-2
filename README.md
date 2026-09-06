# Studio Meridian — B2B Agency Platform

A six-page platform selling high-ticket (₹10L – ₹25L+) digital builds to
ultra-luxury Indian developers and brokerages. Next.js App Router, TypeScript
(strict), Tailwind, Framer Motion, Prisma + PostgreSQL, Zod.

## Run it

```bash
npm install
cp .env.example .env          # DATABASE_URL is the only value needed to boot
npx prisma db push            # or: npm run prisma:migrate
npm run dev
```

## Pages

| Route       | Purpose                                                            |
| ----------- | ------------------------------------------------------------------ |
| `/`         | Flagship: hero, proof bar, capability grid, Vastu viewer, arithmetic |
| `/work`     | Filterable portfolio — Goa Estates / Mumbai High-Rises / NRI Flagships |
| `/services` | Capability matrix across the four disciplines                        |
| `/approach` | Subtle Vastu Integration, Sensorial Digital Luxury, process          |
| `/journal`  | SEO article grid                                                     |
| `/contact`  | Hard copy + `<BookingWizard />` at `#brief`                          |

## Key components

- **`<CurrencyToggle />`** — floating radiogroup switching every value between
  ₹ Cr, $ M and AED. All amounts are stored once in ₹ crore
  (`lib/currency.tsx`) and converted at render, so a USD figure can never drift
  out of sync with its rupee counterpart. Rates are pinned constants, not a live
  feed — a price sheet must not change while a buyer forwards the tab.
- **`<VastuFloorplanViewer />`** — plan viewer with a compass rose, SVG
  cross-ventilation corridors and five keyboard-reachable directional zones
  (NE entry, SE Agni, SW primary, NW utility, central Brahmasthan).
- **`<BookingWizard />`** — five-step qualification: project type → GDV band →
  audience → contact → Cal.com iframe prefilled from collected state.
  The lead is persisted at the end of step 4, so an abandoned calendar still
  leaves the desk a fully qualified record.

## `POST /api/book-brief`

Zod-validated, then three actions in order of importance:

1. **Persist** to Postgres via Prisma — the lead is the asset.
2. **LeadSquared CRM** (`lib/crm.ts`) — `Lead.Capture` with
   `SearchBy=EmailAddress` so repeat submissions upsert rather than creating
   duplicates two salespeople then chase. NRI leads are stamped with
   `mx_Lead_Tag` (`LEADSQUARED_NRI_TAG`) and `mx_Sales_Desk` for premium-desk
   routing.
3. **Meta WhatsApp Cloud API** (`lib/whatsapp.ts`) — sends the approved template
   `brief_demo_link`, where `{{1}}` is the first name and `{{2}}` the demo URL.

**Failure policy.** Steps 2 and 3 run concurrently via `allSettled` and are
best-effort: a CRM outage or an unapproved WhatsApp template must never surface
as an error to someone who has already handed over their details. Per-integration
status is returned for reconciliation and every failure is logged as structured
JSON with the lead id. Missing credentials yield `skipped`, not a crash, so the
app boots in preview environments with no integrations configured.

Responses: `201` captured · `422` validation (with `fieldErrors`) · `415` wrong
content type · `405` wrong verb. The honeypot field is deliberately *accepted*
by the schema and discarded in the handler with a convincing `200` — returning a
`422` that names the offending field would just tell a bot what to change.

### Rate limiting

Intentionally not implemented in-process: a per-instance counter resets on deploy
and splits across serverless instances. Apply it at the edge (Vercel WAF /
gateway) or with a shared Redis store keyed on IP + email.

## Design system

Tokens live in `tailwind.config.ts` and `app/globals.css`.

- Ivory `#FDFBF7` / Monsoon Indigo `#1A2B3C` / Sandstone `#EFECE6` / Brass `#D4AF37`
- Rozha One (display), Manrope (UI), JetBrains Mono (all numerals, RERA, pricing)
- Motion: `cubic-bezier(0.16, 1, 0.3, 1)` only. Magnetic cursor capped at ±8px,
  image hovers at 1.03×, nothing bouncy. Disabled under `prefers-reduced-motion`
  and on coarse pointers.
- Reveal animations start hidden only under an `.js` class that an inline head
  script adds and removes on any script error, so a broken bundle degrades to
  readable content rather than a blank page.

## Verification performed

- `npm run typecheck` and `npm run build` — clean, 9 routes, 6 pages prerendered
- `npm audit` — 0 vulnerabilities (Next pinned to the patched 15.5.x backport;
  `postcss` and `deepmerge-ts` raised via `overrides`)
- All six pages served over HTTP with copy assertions
- `POST /api/book-brief` against a real PostgreSQL 15 instance: row persisted
  with `nriStatus=true`, `gdvCategory=ABOVE_500_CR`; unique `reraNumber`
  constraint confirmed to reject duplicates
- Degradation paths: DB unreachable still returns `201` with `persisted:false`;
  absent CRM/WhatsApp credentials report `skipped`

## Not yet wired

- Journal articles are listed but individual `/journal/[slug]` pages are not built
- `Project` rows come from `lib/content.ts`; point `/work` at Prisma when the CMS
  is chosen — the shapes already match
- Cal.com link is a placeholder in `NEXT_PUBLIC_CAL_URL`
- The WhatsApp template must be approved in Meta Business Manager before sends
  succeed (error code 132001 until then)
