import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowUpRight } from "@/components/icons";
import { CaseHeroMount } from "@/components/webgl/case-hero-mount";
import { ShotPending } from "@/components/work/shot-pending";
import type { Project } from "@/content/projects";

/**
 * The stage a case study opens on.
 *
 * The name states what this is, and everything under it is the software. The
 * capture takes whatever height the rail and the name leave, which on any
 * ordinary screen is most of it — so the page opens on the client's own
 * interface rather than on a description of it.
 *
 * The ground is the client's ink lit from behind the plate — the same light the
 * work index uses, but here it is the only thing in the room.
 */
export function CaseStage({ project }: { project: Project }) {
  return (
    <section className="case-stage">
      <span aria-hidden className="case-stage-bloom" />
      <span aria-hidden className="case-stage-mesh" />
      <span aria-hidden className="case-stage-haze" />
      <span aria-hidden className="case-stage-grain" />

      <div className="case-stage-inner shell">
        <div className="flex items-baseline justify-between gap-6">
          <Link
            href="/#work"
            data-cursor="back"
            className="meta group inline-flex items-center gap-2.5 text-on-field-3 transition-colors hover:text-lit"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
            All work
          </Link>
          <p className="data text-on-field-3" data-figures>
            No. {project.index} · {project.year}
          </p>
        </div>

        {/* The name leads, with the address on the same line. */}
        <div className="flex flex-col gap-6 border-b border-line-on-field pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="meta text-lit">{project.kicker}</p>
            {/* Paired with the row on the work index: the name morphs into
                place rather than being re-animated from scratch. */}
            <ViewTransition
              name={`title-${project.slug}`}
              share="morph"
              default="none"
            >
              <h1 className="big mt-4">{project.name}</h1>
            </ViewTransition>
          </div>

          {/* A system without its own public address gets no dead link. */}
          {project.url && project.domain ? (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="visit"
              className="case-stage-visit group"
            >
              {project.domain}
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : null}
        </div>

        {/* The capture takes every pixel the name and the rail leave. */}
        <div className="case-stage-centre">
          <div className="case-stage-shot">
            {project.image ? (
              <CaseHeroMount project={project} />
            ) : (
              <ShotPending project={project} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
