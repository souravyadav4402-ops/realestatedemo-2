"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Multi-currency engine.
 *
 * Every value in the codebase is stored once, in ₹ crore, and converted at
 * render time. Storing a single canonical unit prevents the classic bug where
 * a USD price drifts out of sync with its rupee counterpart.
 *
 * Rates are pinned constants, not a live feed: a luxury price sheet must not
 * change between a buyer opening a tab and forwarding it to their spouse.
 * Refresh them deliberately on each release.
 */

export const CURRENCIES = ["INR", "USD", "AED"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** INR per 1 unit of currency. Pinned 2026-09 close. */
const INR_PER_UNIT: Record<Currency, number> = {
  INR: 1,
  USD: 83.5,
  AED: 22.74,
};

export const CURRENCY_META: Record<
  Currency,
  { symbol: string; short: string; unitLabel: string }
> = {
  INR: { symbol: "₹", short: "INR", unitLabel: "Cr" },
  USD: { symbol: "$", short: "USD", unitLabel: "M" },
  AED: { symbol: "AED", short: "AED", unitLabel: "M" },
};

const CRORE_IN_INR = 10_000_000;
const STORAGE_KEY = "meridian:currency";

function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && CURRENCIES.includes(value as Currency);
}

/**
 * Convert ₹ crore into the active currency's display magnitude.
 * INR stays in crore; USD and AED are expressed in millions.
 */
export function convertFromCrores(crores: number, currency: Currency): number {
  if (currency === "INR") return crores;
  const inr = crores * CRORE_IN_INR;
  return inr / INR_PER_UNIT[currency] / 1_000_000;
}

/** Tabular-friendly formatting: no decimals once the number is large. */
export function formatGdv(crores: number, currency: Currency): string {
  const value = convertFromCrores(crores, currency);
  const { symbol, unitLabel } = CURRENCY_META[currency];
  const fractionDigits = value >= 100 ? 0 : value >= 10 ? 1 : 2;

  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

  return currency === "AED"
    ? `${symbol} ${formatted} ${unitLabel}`
    : `${symbol}${formatted} ${unitLabel}`;
}

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (next: Currency) => void;
  format: (crores: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");

  // Restore the buyer's last choice after mount to avoid hydration mismatch.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isCurrency(stored)) setCurrencyState(stored);
    } catch {
      /* Private-mode storage denial is not an error worth surfacing. */
    }
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      format: (crores: number) => formatGdv(crores, currency),
    }),
    [currency, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used inside <CurrencyProvider>");
  }
  return context;
}
