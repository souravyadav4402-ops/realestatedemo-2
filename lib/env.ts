/**
 * Central, typed access to server environment variables.
 *
 * Integrations are intentionally *optional*: a missing CRM or WhatsApp
 * credential must never break lead capture. Each accessor returns a
 * discriminated result so `app/api/book-brief/route.ts` can degrade
 * gracefully and report per-integration status instead of throwing.
 */

function read(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export type IntegrationConfig<T> =
  | { configured: true; config: T }
  | { configured: false; missing: string[] };

export interface LeadSquaredConfig {
  apiHost: string;
  accessKey: string;
  secretKey: string;
  nriTag: string;
}

export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  templateName: string;
  templateLanguage: string;
  graphVersion: string;
  demoUrl: string;
}

/** LeadSquared requires host + both keys; the NRI tag has a safe default. */
export function getLeadSquaredConfig(): IntegrationConfig<LeadSquaredConfig> {
  const apiHost = read("LEADSQUARED_API_HOST");
  const accessKey = read("LEADSQUARED_ACCESS_KEY");
  const secretKey = read("LEADSQUARED_SECRET_KEY");

  const missing: string[] = [];
  if (!apiHost) missing.push("LEADSQUARED_API_HOST");
  if (!accessKey) missing.push("LEADSQUARED_ACCESS_KEY");
  if (!secretKey) missing.push("LEADSQUARED_SECRET_KEY");

  if (!apiHost || !accessKey || !secretKey) {
    return { configured: false, missing };
  }

  return {
    configured: true,
    config: {
      apiHost: apiHost.replace(/\/+$/, ""),
      accessKey,
      secretKey,
      nriTag: read("LEADSQUARED_NRI_TAG") ?? "NRI-Premium-Desk",
    },
  };
}

/** Meta WhatsApp Cloud API requires a phone number id and a system token. */
export function getWhatsAppConfig(): IntegrationConfig<WhatsAppConfig> {
  const phoneNumberId = read("WHATSAPP_PHONE_NUMBER_ID");
  const accessToken = read("WHATSAPP_ACCESS_TOKEN");

  const missing: string[] = [];
  if (!phoneNumberId) missing.push("WHATSAPP_PHONE_NUMBER_ID");
  if (!accessToken) missing.push("WHATSAPP_ACCESS_TOKEN");

  if (!phoneNumberId || !accessToken) {
    return { configured: false, missing };
  }

  return {
    configured: true,
    config: {
      phoneNumberId,
      accessToken,
      templateName: read("WHATSAPP_TEMPLATE_NAME") ?? "brief_demo_link",
      templateLanguage: read("WHATSAPP_TEMPLATE_LANGUAGE") ?? "en",
      graphVersion: read("WHATSAPP_GRAPH_VERSION") ?? "v21.0",
      demoUrl: read("NEXT_PUBLIC_DEMO_URL") ?? "https://studiomeridian.in/work",
    },
  };
}

export function isDatabaseConfigured(): boolean {
  return read("DATABASE_URL") !== undefined;
}
