"use client";

import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/ProjectCard";
import { PROJECTS, WORK_FILTERS, type WorkFilterId } from "@/lib/content";

/**
 * Filterable portfolio grid.
 * Filtering is client-side over a fixed dataset — instant, no route change,
 * and the aggregate GDV recomputes so the filter itself carries proof.
 */
export function WorkGallery() {
  const [active, setActive] = useState<WorkFilterId>("all");

  const projects = useMemo(
    () =>
      active === "all"
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === active),
    [active],
  );

  const totalGdv = useMemo(
    () => projects.reduce((sum, project) => sum + project.gdvInCrores, 0),
    [projects],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-6 border-y border-monsoon/15 py-5">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter projects"
        >
          {WORK_FILTERS.map((filter) => {
            const isActive = filter.id === active;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(filter.id)}
                className={[
                  "rounded-ledger border px-4 py-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-450 ease-deliberate",
                  isActive
                    ? "border-monsoon bg-monsoon text-ivory"
                    : "border-monsoon/25 text-monsoon/70 hover:border-brass hover:text-monsoon",
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <p className="data-label">
          <span className="text-monsoon">{projects.length}</span> projects ·{" "}
          <span className="text-monsoon">
            ₹{totalGdv.toLocaleString("en-IN")} Cr
          </span>{" "}
          combined GDV
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="py-20 text-center text-lead text-monsoon/60">
          Nothing in this category yet.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              priority={index < 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}
