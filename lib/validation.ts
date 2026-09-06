import { z } from "zod";

/**
 * Shared contract between <BookingWizard /> and /api/book-brief.
 * Values mirror the Prisma enums exactly so the payload maps 1:1.
 */

export const PROJECT_TYPES = ["HIGH_RISE", "VILLA", "COMMERCIAL"] as const;

export const GDV_CATEGORIES = [
  "UNDER_50_CR",
  "BETWEEN_50_AND_100_CR",
  "BETWEEN_100_AND_250_CR",
  "BETWEEN_250_AND_500_CR",
  "ABOVE_500_CR",
] as const;

export const AUDIENCES = ["DOMESTIC", "NRI"] as const;

export type ProjectTypeValue = (typeof PROJECT_TYPES)[number];
export type GdvCategoryValue = (typeof GDV_CATEGORIES)[number];
export type AudienceValue = (typeof AUDIENCES)[number];

/** E.164-ish country code, e.g. +91, +971, +1. */
const countryCode = z
  .string()
  .trim()
  .regex(/^\+\d{1,4}$/, "Country code must look like +91");

/** Digits only after the country code, 6–14 digits covers IN/AE/US/UK/SG. */
const phone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s()-]/g, ""))
  .pipe(z.string().regex(/^\d{6,14}$/, "Enter a valid phone number"));

export const bookBriefSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid work email")
    .max(254),
  countryCode,
  phone,
  projectType: z.enum(PROJECT_TYPES),
  gdvCategory: z.enum(GDV_CATEGORIES),
  audience: z.enum(AUDIENCES),
  /** Optional free-text context; never trusted, always length-capped. */
  notes: z.string().trim().max(1200).optional().or(z.literal("")),
  /**
   * Honeypot. Deliberately *accepted* by the schema rather than rejected:
   * validation must not fail here, because a 422 listing the offending field
   * tells a bot precisely what to change. The route inspects this after
   * parsing and returns a convincing 200 instead.
   */
  company: z.string().max(200).optional(),
});

export type BookBriefInput = z.input<typeof bookBriefSchema>;
export type BookBriefPayload = z.output<typeof bookBriefSchema>;

export interface BookBriefIntegrationStatus {
  crm: "sent" | "skipped" | "failed";
  whatsapp: "sent" | "skipped" | "failed";
}

export interface BookBriefSuccessResponse {
  success: true;
  leadId: string;
  persisted: boolean;
  integrations: BookBriefIntegrationStatus;
}

export interface BookBriefErrorResponse {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export type BookBriefResponse =
  | BookBriefSuccessResponse
  | BookBriefErrorResponse;

/* ------------------------------------------------------------------ labels */

export const PROJECT_TYPE_LABELS: Record<ProjectTypeValue, string> = {
  HIGH_RISE: "High-Rise",
  VILLA: "Villa / Estate",
  COMMERCIAL: "Commercial",
};

export const GDV_LABELS: Record<GdvCategoryValue, string> = {
  UNDER_50_CR: "Under ₹50 Cr",
  BETWEEN_50_AND_100_CR: "₹50–100 Cr",
  BETWEEN_100_AND_250_CR: "₹100–250 Cr",
  BETWEEN_250_AND_500_CR: "₹250–500 Cr",
  ABOVE_500_CR: "₹500 Cr+",
};

export const AUDIENCE_LABELS: Record<AudienceValue, string> = {
  DOMESTIC: "Domestic",
  NRI: "NRI / Global",
};
