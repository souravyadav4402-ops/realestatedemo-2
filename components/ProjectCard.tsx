import Image from "next/image";

import { GdvValue } from "@/components/GdvValue";
import type { ProjectRecord } from "@/lib/content";

const RERA_TONE: Record<ProjectRecord["reraStatus"], string> = {
  Registered: "text-success",
  "Phase II Filed": "text-monsoon/70",
  "Pre-Registration": "text-brass-dark",
};

export function ProjectCard({
  project,
  priority = false,
}: {
  project: ProjectRecord;
  priority?: boolean;
}) {
  return (
    <article className="ledger-card group flex h-full flex-col overflow-hidden">
      <div className="image-luxury relative aspect-[4/3] w-full">
        <Image
          src={project.image}
          alt={`${project.title} — ${project.location}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-900 ease-deliberate group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-ledger bg-ivory/95 px-3 py-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-monsoon backdrop-blur">
          {project.year}
        </span>
        {project.isVastuCompliant ? (
          <span className="absolute right-4 top-4 rounded-ledger bg-brass px-3 py-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-monsoon-dark">
            Vastu
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="data-label">{project.developer}</p>
        <h3 className="mt-2 text-2xl leading-tight">{project.title}</h3>
        <p className="mt-1 text-sm text-monsoon/60">{project.location}</p>

        <p className="mt-4 text-sm leading-relaxed text-monsoon/75">
          {project.summary}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-px border border-monsoon/15 bg-monsoon/15">
          <div className="bg-ivory p-4">
            <dt className="data-label">GDV</dt>
            <dd className="mt-1 text-lg text-monsoon">
              <GdvValue crores={project.gdvInCrores} />
            </dd>
          </div>
          <div className="bg-ivory p-4">
            <dt className="data-label">RERA</dt>
            <dd
              className={`mt-1 font-mono text-xs leading-snug ${RERA_TONE[project.reraStatus]}`}
            >
              {project.reraStatus}
              <span className="mt-1 block break-all text-monsoon/55">
                {project.reraNumber}
              </span>
            </dd>
          </div>
        </dl>

        <p className="mt-5 border-t border-monsoon/15 pt-4 font-mono text-xs leading-relaxed text-brass-dark">
          {project.outcome}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.capabilities.map((capability) => (
            <li
              key={capability}
              className="rounded-ledger border border-monsoon/20 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-monsoon/70"
            >
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
