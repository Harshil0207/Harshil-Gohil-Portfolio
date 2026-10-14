import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowLeft } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/content/projects";

/**
 * The head of the dossier.
 *
 * The spec used to sit in a sidebar table beside the body copy, which is what
 * made this page read as documentation. It runs across the masthead instead, as
 * an instrument strip — five readings on one rule, the register the work index
 * already uses — so the facts are stated once, at the top, and the rest of the
 * page is free to be full width.
 */
export function CaseMasthead({ project }: { project: Project }) {
  const readings = [
    ["Client", project.spec.client],
    ["Year", project.spec.year],
    ["Role", project.spec.role],
    ["Category", project.spec.category],
    ["Status", project.spec.status],
  ] as const;

  return (
    <header className="shell relative z-[1] pb-14 pt-28 md:pb-20 md:pt-36">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-b border-line-on-field pb-4">
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

      <p data-void="line" className="meta mt-12 text-lit md:mt-16">
        {project.kicker}
      </p>

      <ViewTransition name={`title-${project.slug}`} share="morph" default="none">
        <h1 className="huge mt-6 max-w-[13ch]">{project.name}</h1>
      </ViewTransition>

      <span
        aria-hidden
        className="mt-8 block h-px w-full origin-left bg-lit/55"
      />

      <Reveal delay={0.2}>
        <p className="lede mt-8 max-w-[52ch] text-xl text-on-field-2 md:text-2xl">
          {project.summary}
        </p>
      </Reveal>

      {/* Five readings on one rule, rather than a table in a column. */}
      <Reveal
        as="dl"
        stagger={0.05}
        delay={0.3}
        className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line-on-field pt-8 md:mt-20 lg:grid-cols-5"
      >
        {readings.map(([label, value]) => (
          <div key={label}>
            <dt className="meta text-on-field-3">{label}</dt>
            <dd
              className="data mt-3 text-sm text-on-field md:text-base"
              data-figures
            >
              {value}
            </dd>
          </div>
        ))}
      </Reveal>
    </header>
  );
}
