import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { sendLeadToLeadSquared } from "@/lib/crm";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  bookBriefSchema,
  type BookBriefIntegrationStatus,
  type BookBriefPayload,
  type BookBriefResponse,
} from "@/lib/validation";
import { sendBriefWhatsApp } from "@/lib/whatsapp";

/**
 * POST /api/book-brief
 * -------------------------------------------------------------------------
 * Receives the payload from <BookingWizard /> step 4 and performs three
 * actions, in deliberate order of importance:
 *
 *   1. Persist the lead to Postgres via Prisma            (must not be lost)
 *   2. Push to LeadSquared CRM, tagging NRI for the premium desk
 *   3. Fire the Meta WhatsApp template with the live demo link
 *
 * Failure policy: the lead is the asset. Actions 2 and 3 are best-effort and
 * run concurrently via `allSettled` — a CRM outage or an unapproved WhatsApp
 * template must never surface as an error to a prospect who has already given
 * us their details. Per-integration status is returned so the studio can
 * reconcile, and every failure is logged with the lead id for replay.
 *
 * NOTE ON RATE LIMITING: this route is intentionally not protected by an
 * in-process counter, which would reset on deploy and split across serverless
 * instances. Apply limiting at the edge (Vercel WAF / gateway) or with a shared
 * Redis store keyed on IP + email. A honeypot field blocks naive bots.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LogContext {
  requestId: string;
  [key: string]: unknown;
}

function log(
  level: "info" | "warn" | "error",
  message: string,
  context: LogContext,
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    scope: "book-brief",
    message,
    ...context,
  };
  // Structured single-line JSON so log drains can index the fields.
  console[level === "error" ? "error" : "log"](JSON.stringify(entry));
}

function jsonResponse(
  body: BookBriefResponse,
  status: number,
): NextResponse<BookBriefResponse> {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/** Persist the lead. Returns the row id, or null when the DB is unreachable. */
async function persistLead(
  payload: BookBriefPayload,
  requestId: string,
): Promise<string | null> {
  if (!isDatabaseConfigured()) {
    log("warn", "DATABASE_URL absent — skipping persistence", { requestId });
    return null;
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        countryCode: payload.countryCode,
        // `audience` is the UI concept; the column is the boolean it implies.
        nriStatus: payload.audience === "NRI",
        gdvCategory: payload.gdvCategory,
        projectType: payload.projectType,
      },
      select: { id: true },
    });
    return lead.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      log("error", "Prisma rejected the lead", {
        requestId,
        prismaCode: error.code,
        detail: error.message.slice(0, 400),
      });
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      log("error", "Prisma could not reach the database", {
        requestId,
        detail: error.message.slice(0, 400),
      });
    } else {
      log("error", "Unexpected persistence failure", {
        requestId,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  }
}

export async function POST(
  request: Request,
): Promise<NextResponse<BookBriefResponse>> {
  const requestId = crypto.randomUUID();

  /* ------------------------------------------------------- 0. parse body */
  let raw: unknown;
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return jsonResponse(
        { success: false, error: "Expected application/json" },
        415,
      );
    }
    raw = await request.json();
  } catch {
    return jsonResponse(
      { success: false, error: "Malformed JSON body" },
      400,
    );
  }

  /* ---------------------------------------------------- 1. strict validation */
  let payload: BookBriefPayload;
  try {
    payload = bookBriefSchema.parse(raw);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const key = typeof issue.path[0] === "string" ? issue.path[0] : "_form";
        (fieldErrors[key] ??= []).push(issue.message);
      }
      log("warn", "Validation failed", { requestId, fields: Object.keys(fieldErrors) });
      return jsonResponse(
        {
          success: false,
          error: "Please correct the highlighted fields.",
          fieldErrors,
        },
        422,
      );
    }
    log("error", "Unknown validation error", { requestId });
    return jsonResponse(
      { success: false, error: "Could not read that submission." },
      400,
    );
  }

  /* --------------------------------------------------------- 2. honeypot */
  // Schema caps `company` at length 0, so anything here is automated. Return a
  // 200 so the bot believes it succeeded and does not retry with variations.
  if (payload.company) {
    log("warn", "Honeypot triggered", { requestId });
    return jsonResponse(
      {
        success: true,
        leadId: requestId,
        persisted: false,
        integrations: { crm: "skipped", whatsapp: "skipped" },
      },
      200,
    );
  }

  /* ------------------------------------------------ 3. persist (priority) */
  const leadId = await persistLead(payload, requestId);
  const persisted = leadId !== null;

  log("info", "Lead received", {
    requestId,
    leadId,
    persisted,
    projectType: payload.projectType,
    gdvCategory: payload.gdvCategory,
    nri: payload.audience === "NRI",
  });

  /* ------------------------------- 4. CRM + WhatsApp, concurrent best-effort */
  const [crmOutcome, whatsappOutcome] = await Promise.allSettled([
    sendLeadToLeadSquared(payload),
    sendBriefWhatsApp(payload),
  ]);

  const integrations: BookBriefIntegrationStatus = {
    crm: "failed",
    whatsapp: "failed",
  };

  if (crmOutcome.status === "fulfilled") {
    integrations.crm =
      crmOutcome.value.status === "sent"
        ? "sent"
        : crmOutcome.value.status === "skipped"
          ? "skipped"
          : "failed";

    if (crmOutcome.value.status === "failed") {
      log("error", "LeadSquared push failed", {
        requestId,
        leadId,
        reason: crmOutcome.value.reason,
      });
    } else if (crmOutcome.value.status === "skipped") {
      log("warn", "LeadSquared skipped", {
        requestId,
        reason: crmOutcome.value.reason,
      });
    }
  } else {
    log("error", "LeadSquared adapter threw", {
      requestId,
      leadId,
      detail: String(crmOutcome.reason).slice(0, 400),
    });
  }

  if (whatsappOutcome.status === "fulfilled") {
    integrations.whatsapp =
      whatsappOutcome.value.status === "sent"
        ? "sent"
        : whatsappOutcome.value.status === "skipped"
          ? "skipped"
          : "failed";

    if (whatsappOutcome.value.status === "failed") {
      log("error", "WhatsApp send failed", {
        requestId,
        leadId,
        reason: whatsappOutcome.value.reason,
      });
    } else if (whatsappOutcome.value.status === "skipped") {
      log("warn", "WhatsApp skipped", {
        requestId,
        reason: whatsappOutcome.value.reason,
      });
    }
  } else {
    log("error", "WhatsApp adapter threw", {
      requestId,
      leadId,
      detail: String(whatsappOutcome.reason).slice(0, 400),
    });
  }

  /* ----------------------------------------------------------- 5. respond */
  // The wizard only needs to know the brief was captured; integration status is
  // returned for observability, not for the prospect to act on.
  return jsonResponse(
    {
      success: true,
      leadId: leadId ?? requestId,
      persisted,
      integrations,
    },
    201,
  );
}

/** Explicitly reject other verbs so probes get a correct 405. */
export function GET(): NextResponse<BookBriefResponse> {
  return jsonResponse(
    { success: false, error: "Method not allowed. Use POST." },
    405,
  );
}
