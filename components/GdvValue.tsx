"use client";

import { useCurrency } from "@/lib/currency";

/**
 * Renders a ₹-crore value in whatever currency the buyer selected.
 * Kept tiny and client-only so surrounding pages stay server components.
 */
export function GdvValue({
  crores,
  className,
}: {
  crores: number;
  className?: string;
}) {
  const { format } = useCurrency();
  return (
    <span className={`font-data tabular-nums ${className ?? ""}`.trim()}>
      {format(crores)}
    </span>
  );
}
