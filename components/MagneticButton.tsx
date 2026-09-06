"use client";

import Link from "next/link";
import { useCallback, useRef, type ReactNode } from "react";

/**
 * Magnetic cursor button.
 *
 * The element drifts a few pixels toward the pointer using CSS custom
 * properties (`--magnetic-x` / `--magnetic-y`) so the transform stays on the
 * compositor. Deliberately capped at ±8px — this should read as weight, not
 * playfulness. Disabled on coarse pointers via globals.css.
 */

const MAX_OFFSET = 8;

interface BaseProps {
  children: ReactNode;
  /** `outline-light` is the variant for use on the indigo sections. */
  variant?: "solid" | "outline" | "outline-light";
  className?: string;
}

type MagneticButtonProps = BaseProps &
  (
    | { href: string; onClick?: never; type?: never }
    | { href?: never; onClick?: () => void; type?: "button" | "submit" }
  );

export function MagneticButton({
  children,
  variant = "solid",
  className = "",
  href,
  onClick,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);

  const handleMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node || event.pointerType !== "mouse") return;

    const rect = node.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    node.style.setProperty("--magnetic-x", `${relativeX * MAX_OFFSET * 2}px`);
    node.style.setProperty("--magnetic-y", `${relativeY * MAX_OFFSET}px`);
  }, []);

  const handleLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--magnetic-x", "0px");
    node.style.setProperty("--magnetic-y", "0px");
  }, []);

  const shared = {
    className: `magnetic-button ${className}`.trim(),
    "data-variant": variant,
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
  } as const;

  if (href) {
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);

    if (isExternal) {
      return (
        <a
          {...shared}
          ref={(node) => {
            ref.current = node;
          }}
          href={href}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        {...shared}
        ref={(node) => {
          ref.current = node;
        }}
        href={href}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...shared}
      ref={(node) => {
        ref.current = node;
      }}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
