import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/content/projects";

/**
 * The rail no longer carries the screenshot or the live-site link: the stage
 * at the top of the page shows the capture full screen and states the address
 * under it, and printing either twice on one page is just noise.
 */

export function SpecRail({ project }: { project: Project }) {
  const specRows = [
    ["Client", project.spec.client],
    ["Year", project.spec.year],
    ["Role", project.spec.role],
    ["Category", project.spec.category],
    ["Status", project.spec.status],
  ] as const;

  return (
    <div className="lg:sticky lg:top-28">
      <Reveal as="dl" stagger={0.05} className="border-t border-line-on-field">
        {specRows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-6 border-b border-line-on-field py-3"
          >
            <dt className="meta text-on-field-3">{label}</dt>
            <dd className="text-right text-sm font-medium" data-figures>
              {value}
            </dd>
          </div>
        ))}
      </Reveal>

      <div className="mt-12">
        {/* Only a live system does anything "in production" — a build still in
            development gets a heading that doesn't overclaim. */}
        <h2 className="mid">
          {project.statusShort === "Live"
            ? "What it does in production"
            : "What it does today"}
        </h2>
        <Reveal
          as="dl"
          stagger={0.08}
          className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8"
        >
          {project.outcomes.map((outcome) => (
            <div key={outcome.label}>
              <dt className="meta text-on-field-3">{outcome.label}</dt>
              <dd className="mid mt-2 text-acid" data-figures>
                <Counter value={outcome.value} />
              </dd>
            </div>
          ))}
        </Reveal>
        {project.outcomesFootnote ? (
          <p className="mt-6 text-sm text-on-field-2">
            {project.outcomesFootnote}
          </p>
        ) : null}
      </div>
    </div>
  );
}
