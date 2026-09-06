import { getLeadSquaredConfig } from "@/lib/env";
import {
  AUDIENCE_LABELS,
  GDV_LABELS,
  PROJECT_TYPE_LABELS,
  type BookBriefPayload,
} from "@/lib/validation";

/**
 * LeadSquared CRM hook.
 * -------------------------------------------------------------------------
 * LeadSquared's Lead.Capture endpoint accepts a flat array of
 * `{ Attribute, Value }` pairs and is authenticated with query-string keys:
 *
 *   POST {host}/v2/LeadManagement.svc/Lead.Capture
 *        ?accessKey=...&secretKey=...
 *
 * Two behaviours matter for this business:
 *
 * 1. `SearchBy=EmailAddress` upserts on email, so a developer who submits
 *    twice updates one record rather than creating duplicate leads that
 *    two salespeople then chase.
 * 2. NRI leads must reach the premium desk. We stamp `mx_Lead_Tag` with
 *    LEADSQUARED_NRI_TAG and raise `mx_Sales_Desk`, which the CRM's
 *    automation rules use to route ownership. Domestic leads fall through
 *    to the standard desk.
 */

export type CrmResult =
  | { status: "sent"; providerLeadId: string | null }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

interface LeadSquaredField {
  Attribute: string;
  Value: string;
}

/** LeadSquared expects a single string; keep the raw parts in custom fields. */
function toE164(payload: BookBriefPayload): string {
  return `${payload.countryCode}${payload.phone}`;
}

function buildFields(
  payload: BookBriefPayload,
  nriTag: string,
): LeadSquaredField[] {
  const isNri = payload.audience === "NRI";

  // Split on the last space so single-word names do not produce an empty first name.
  const parts = payload.name.split(/\s+/);
  const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : payload.name;
  const lastName = parts.length > 1 ? parts[parts.length - 1]! : "";

  const fields: LeadSquaredField[] = [
    { Attribute: "SearchBy", Value: "EmailAddress" },
    { Attribute: "FirstName", Value: firstName },
    { Attribute: "LastName", Value: lastName },
    { Attribute: "EmailAddress", Value: payload.email },
    { Attribute: "Phone", Value: toE164(payload) },
    { Attribute: "mx_Country_Code", Value: payload.countryCode },
    { Attribute: "Source", Value: "Website" },
    { Attribute: "SourceMedium", Value: "Booking Wizard" },
    { Attribute: "SourceCampaign", Value: "studiomeridian.in/contact" },
    { Attribute: "mx_Project_Type", Value: PROJECT_TYPE_LABELS[payload.projectType] },
    { Attribute: "mx_GDV_Band", Value: GDV_LABELS[payload.gdvCategory] },
    { Attribute: "mx_GDV_Band_Code", Value: payload.gdvCategory },
    { Attribute: "mx_Audience", Value: AUDIENCE_LABELS[payload.audience] },
    { Attribute: "mx_NRI_Status", Value: isNri ? "Yes" : "No" },
    // Routing: the premium desk picks up on this tag.
    { Attribute: "mx_Sales_Desk", Value: isNri ? "Premium NRI Desk" : "Domestic Desk" },
    { Attribute: "mx_Lead_Tag", Value: isNri ? nriTag : "Domestic-Standard" },
  ];

  if (payload.notes) {
    fields.push({ Attribute: "mx_Brief_Notes", Value: payload.notes });
  }

  return fields;
}

export async function sendLeadToLeadSquared(
  payload: BookBriefPayload,
): Promise<CrmResult> {
  const env = getLeadSquaredConfig();

  if (!env.configured) {
    // Not an error: local/preview environments run without CRM credentials.
    return {
      status: "skipped",
      reason: `LeadSquared not configured (missing: ${env.missing.join(", ")})`,
    };
  }

  const { apiHost, accessKey, secretKey, nriTag } = env.config;
  const url =
    `${apiHost}/v2/LeadManagement.svc/Lead.Capture` +
    `?accessKey=${encodeURIComponent(accessKey)}` +
    `&secretKey=${encodeURIComponent(secretKey)}`;

  // Never let a slow CRM hold the user's request open.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(buildFields(payload, nriTag)),
      signal: controller.signal,
      cache: "no-store",
    });

    const raw = await response.text();

    if (!response.ok) {
      return {
        status: "failed",
        reason: `LeadSquared HTTP ${response.status}: ${raw.slice(0, 300)}`,
      };
    }

    // LeadSquared returns 200 with { Status: "Error", ExceptionMessage } on
    // validation problems, so the body must be inspected, not just the code.
    let providerLeadId: string | null = null;
    try {
      const parsed = JSON.parse(raw) as {
        Status?: string;
        Message?: { Id?: string };
        ExceptionMessage?: string;
      };

      if (parsed.Status && parsed.Status.toLowerCase() === "error") {
        return {
          status: "failed",
          reason: parsed.ExceptionMessage ?? "LeadSquared rejected the payload",
        };
      }

      providerLeadId = parsed.Message?.Id ?? null;
    } catch {
      // A 2xx with a non-JSON body still means the lead landed.
      providerLeadId = null;
    }

    return { status: "sent", providerLeadId };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? "LeadSquared request timed out after 8s"
        : error instanceof Error
          ? error.message
          : "Unknown LeadSquared transport error";
    return { status: "failed", reason };
  } finally {
    clearTimeout(timeout);
  }
}
