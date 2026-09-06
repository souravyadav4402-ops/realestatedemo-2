import type { ReactNode } from "react";

import { Reveal } from "@/components/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <Reveal
      className={[
        isCentered ? "mx-auto max-w-reading text-center" : "max-w-3xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className={isCentered ? "eyebrow justify-center" : "eyebrow"}>{eyebrow}</p>
      <h2 className="mt-5 text-display-md">{title}</h2>
      {lead ? (
        <p
          className={[
            "mt-6 text-lead text-monsoon/70",
            isCentered ? "mx-auto" : "",
          ].join(" ")}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}
