"use client";

import { CURRENCIES, CURRENCY_META, useCurrency } from "@/lib/currency";

/**
 * <CurrencyToggle />
 *
 * Floating, always-reachable control that re-prices every GDV figure on the
 * page. Positioned bottom-right so it never covers primary navigation, and
 * rendered as a radiogroup so keyboard and screen-reader users get the same
 * affordance as a mouse user.
 */
export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:justify-end sm:px-0">
      <div
        className="pointer-events-auto flex items-center gap-1 rounded-ledger border border-monsoon/25 bg-ivory/95 p-1 shadow-float backdrop-blur"
        role="radiogroup"
        aria-label="Display currency"
      >
        <span className="data-label hidden pl-2 pr-1 sm:inline">Values in</span>
        {CURRENCIES.map((option) => {
          const isActive = option === currency;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setCurrency(option)}
              className={[
                "rounded-ledger px-3 py-2 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-450 ease-deliberate",
                isActive
                  ? "bg-monsoon text-ivory"
                  : "text-monsoon/70 hover:bg-sandstone hover:text-monsoon",
              ].join(" ")}
            >
              {CURRENCY_META[option].symbol}
              <span className="ml-1 hidden xs:inline">
                {CURRENCY_META[option].short}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
