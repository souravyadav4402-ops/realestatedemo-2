"use client";

import Image from "next/image";
import { useState } from "react";

import { SAMPLE_FLOORPLAN, type VastuZone } from "@/lib/content";

/**
 * <VastuFloorplanViewer />
 *
 * A floorplan viewer with two overlays a luxury Indian buyer actually asks for:
 *
 *  1. A compass rose fixed to true plan orientation, with the eight directions
 *     labelled — so "which way does the primary face" is answered on screen.
 *  2. Cross-ventilation paths, drawn as the diagonal air corridors between
 *     opposing openings.
 *
 * Zone markers are absolutely positioned by percentage so the overlay tracks
 * the plan at any breakpoint. Every marker is a real button: keyboard users
 * tab through the zones and read the same detail panel.
 */

const COMPASS_POINTS = [
  { label: "N", angle: 0 },
  { label: "NE", angle: 45 },
  { label: "E", angle: 90 },
  { label: "SE", angle: 135 },
  { label: "S", angle: 180 },
  { label: "SW", angle: 225 },
  { label: "W", angle: 270 },
  { label: "NW", angle: 315 },
] as const;

export function VastuFloorplanViewer() {
  const zones = SAMPLE_FLOORPLAN.zones;
  const [activeZoneId, setActiveZoneId] = useState<string>(zones[0]!.id);
  const [showVentilation, setShowVentilation] = useState(true);
  const [showCompass, setShowCompass] = useState(true);

  const activeZone: VastuZone =
    zones.find((zone) => zone.id === activeZoneId) ?? zones[0]!;

  return (
    <div className="ledger-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-monsoon/15 p-5">
        <div>
          <p className="data-label">Vastu floorplan viewer</p>
          <p className="mt-1 font-display text-xl leading-none">
            {SAMPLE_FLOORPLAN.unit}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowCompass((value) => !value)}
            aria-pressed={showCompass}
            className={[
              "rounded-ledger border px-3 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-450 ease-deliberate",
              showCompass
                ? "border-monsoon bg-monsoon text-ivory"
                : "border-monsoon/25 text-monsoon/70 hover:border-brass",
            ].join(" ")}
          >
            Compass
          </button>
          <button
            type="button"
            onClick={() => setShowVentilation((value) => !value)}
            aria-pressed={showVentilation}
            className={[
              "rounded-ledger border px-3 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-450 ease-deliberate",
              showVentilation
                ? "border-monsoon bg-monsoon text-ivory"
                : "border-monsoon/25 text-monsoon/70 hover:border-brass",
            ].join(" ")}
          >
            Cross-ventilation
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr]">
        <div className="relative aspect-[4/3] bg-sandstone">
          <Image
            src={SAMPLE_FLOORPLAN.image}
            alt={`Floorplan for ${SAMPLE_FLOORPLAN.unit}`}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover opacity-90"
          />

          {/* Vastu nine-square grid, drawn over the plan. */}
          <div className="pointer-events-none absolute inset-0 vastu-grid opacity-70" />

          {showVentilation ? (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="vent-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#D4AF37" />
                </marker>
              </defs>
              {/* NE ↔ SW and NW ↔ SE corridors: the two prevailing paths. */}
              <line
                x1="18"
                y1="24"
                x2="80"
                y2="76"
                stroke="#D4AF37"
                strokeWidth="0.7"
                strokeDasharray="3 2"
                markerEnd="url(#vent-arrow)"
              />
              <line
                x1="80"
                y1="22"
                x2="20"
                y2="78"
                stroke="#D4AF37"
                strokeWidth="0.7"
                strokeDasharray="3 2"
                markerEnd="url(#vent-arrow)"
              />
            </svg>
          ) : null}

          {zones.map((zone) => {
            const isActive = zone.id === activeZone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZoneId(zone.id)}
                aria-pressed={isActive}
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <span
                  className={[
                    "flex items-center gap-2 rounded-ledger border px-2.5 py-1.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] transition-all duration-450 ease-deliberate",
                    isActive
                      ? "border-brass bg-monsoon text-ivory shadow-brass"
                      : "border-monsoon/30 bg-ivory/92 text-monsoon backdrop-blur hover:border-brass",
                  ].join(" ")}
                >
                  <span className="text-brass">{zone.direction}</span>
                  <span className="hidden sm:inline">{zone.label}</span>
                </span>
              </button>
            );
          })}

          {showCompass ? (
            <div className="absolute bottom-4 right-4 h-24 w-24 rounded-full border border-monsoon/30 bg-ivory/92 backdrop-blur">
              <div className="relative h-full w-full">
                {COMPASS_POINTS.map((point) => (
                  <span
                    key={point.label}
                    className={[
                      "absolute left-1/2 top-1/2 font-mono text-[0.55rem] font-semibold tracking-tight",
                      point.label === "N" ? "text-brass-dark" : "text-monsoon/60",
                    ].join(" ")}
                    style={{
                      transform: `rotate(${point.angle}deg) translateY(-2.35rem) rotate(-${point.angle}deg) translate(-50%, -50%)`,
                    }}
                  >
                    {point.label}
                  </span>
                ))}
                <span className="absolute left-1/2 top-1/2 h-10 w-px -translate-x-1/2 -translate-y-full bg-brass" />
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-monsoon" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-between gap-6 bg-ivory p-6">
          <div>
            <p className="eyebrow">{activeZone.direction} zone</p>
            <h3 className="mt-4 text-2xl leading-tight">{activeZone.label}</h3>
            <p className="mt-3 text-sm leading-relaxed text-monsoon/75">
              {activeZone.detail}
            </p>

            <ul className="mt-6 space-y-2">
              {zones.map((zone) => (
                <li key={zone.id}>
                  <button
                    type="button"
                    onClick={() => setActiveZoneId(zone.id)}
                    className={[
                      "flex w-full items-center justify-between border-b border-monsoon/12 py-2.5 text-left text-sm transition-colors duration-450 ease-deliberate",
                      zone.id === activeZone.id
                        ? "text-monsoon"
                        : "text-monsoon/55 hover:text-monsoon",
                    ].join(" ")}
                  >
                    <span>{zone.label}</span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-brass-dark">
                      {zone.direction}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid grid-cols-2 gap-px border border-monsoon/15 bg-monsoon/15">
            <div className="bg-sandstone p-4">
              <dt className="data-label">Carpet area</dt>
              <dd className="mt-1 font-data text-base">
                {SAMPLE_FLOORPLAN.carpetArea}
              </dd>
            </div>
            <div className="bg-sandstone p-4">
              <dt className="data-label">RERA</dt>
              <dd className="mt-1 break-all font-data text-xs">
                {SAMPLE_FLOORPLAN.reraNumber}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
