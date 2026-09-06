import { getWhatsAppConfig } from "@/lib/env";
import type { BookBriefPayload } from "@/lib/validation";

/**
 * Meta WhatsApp Cloud API hook.
 * -------------------------------------------------------------------------
 * POST https://graph.facebook.com/{version}/{phoneNumberId}/messages
 *
 * Business-initiated messages MUST use a template approved in Meta Business
 * Manager — free-form text is only allowed inside a 24-hour customer service
 * window, which does not exist for a first-touch lead. We therefore send:
 *
 *   template: WHATSAPP_TEMPLATE_NAME (default "brief_demo_link")
 *   body placeholder {{1}} -> prospect first name
 *   body placeholder {{2}} -> live demo URL
 *
 * Approved copy this maps to:
 *   "Thanks for inquiring, {{1}}. Here is a link to our live demo to review
 *    before our call: {{2}}"
 *
 * If the template is not yet approved the Graph API returns error code 132001;
 * we surface that reason rather than silently failing, because the lead is
 * already saved and the sales desk needs to know the nudge did not go out.
 */

export type WhatsAppResult =
  | { status: "sent"; messageId: string | null }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

export async function sendBriefWhatsApp(
  payload: BookBriefPayload,
): Promise<WhatsAppResult> {
  const env = getWhatsAppConfig();

  if (!env.configured) {
    return {
      status: "skipped",
      reason: `WhatsApp not configured (missing: ${env.missing.join(", ")})`,
    };
  }

  const {
    phoneNumberId,
    accessToken,
    templateName,
    templateLanguage,
    graphVersion,
    demoUrl,
  } = env.config;

  // Cloud API expects the full international number without "+" or spaces.
  const recipient = `${payload.countryCode}${payload.phone}`.replace(/\D/g, "");
  const firstName = payload.name.split(/\s+/)[0] ?? payload.name;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: recipient,
          type: "template",
          template: {
            name: templateName,
            language: { code: templateLanguage },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: firstName },
                  { type: "text", text: demoUrl },
                ],
              },
            ],
          },
        }),
        signal: controller.signal,
        cache: "no-store",
      },
    );

    const raw = await response.text();

    if (!response.ok) {
      let reason = `WhatsApp HTTP ${response.status}`;
      try {
        const parsed = JSON.parse(raw) as {
          error?: { message?: string; code?: number };
        };
        if (parsed.error?.message) {
          reason = `WhatsApp error ${parsed.error.code ?? response.status}: ${parsed.error.message}`;
        }
      } catch {
        reason = `${reason}: ${raw.slice(0, 300)}`;
      }
      return { status: "failed", reason };
    }

    let messageId: string | null = null;
    try {
      const parsed = JSON.parse(raw) as {
        messages?: Array<{ id?: string }>;
      };
      messageId = parsed.messages?.[0]?.id ?? null;
    } catch {
      messageId = null;
    }

    return { status: "sent", messageId };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? "WhatsApp request timed out after 8s"
        : error instanceof Error
          ? error.message
          : "Unknown WhatsApp transport error";
    return { status: "failed", reason };
  } finally {
    clearTimeout(timeout);
  }
}
