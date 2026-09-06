import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton.
 *
 * Next.js hot-reloads server modules in development, which would otherwise
 * open a new connection pool on every edit and exhaust Postgres connections.
 * Cache the client on `globalThis` outside production.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
