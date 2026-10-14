import Link from "next/link";
import { ArrowUpRight, Asterisk } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { FittedLine } from "./fitted-line";
import { StackShowcase } from "./stack-showcase";
import { company, copy } from "@/content/company";
import { projectsByAgency } from "@/content/projects";

/**
 * C + D merged. The claim arrives as a display-scale band rather than a static
 * headline, the evidence sits immediately under it as a real index, and the
 * stack runs as an inverted counter-band between the two. Nothing is hidden
 * behind words and there is no empty space to compose around.
 */

function coreStack(items: string[]) {
  if (!items.length) return "—";
  const shown = items.slice(0, 3).join(" · ");
  const rest = items.length - 3;
  return rest > 0 ? `${shown} · +${rest}` : shown;
}

export function HeroMerge() {
  return (
    <section className="block-field">
      <div className="border-b border-line-on-field pb-4 pt-24 md:pt-28">
        <div className="shell flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="meta text-on-field-3">{company.role}</p>
          <p className="meta text-on-field-3">
            {company.tagline} · {company.address.city}, India
          </p>
        </div>
      </div>

      {/* The claim sits still on one line, solved to fill the frame edge to
          edge — one line of this phrase is geometrically capped, so measuring is
          what makes it as large as it can be. */}
      <div className="border-b border-line-on-field px-4 py-8 md:px-6 md:py-10">
        <FittedLine />
      </div>

      <div className="border-b border-line-on-field px-4 py-5 md:px-6 md:py-7">
        <Reveal delay={0.2}>
          <p className="flex flex-wrap items-center justify-center gap-x-[0.3em] font-display text-[clamp(2rem,5.5vw,5rem)] uppercase leading-[0.95] tracking-[-0.005em]">
            <span>Full-stack</span>
            <Asterisk className="size-[0.4em] shrink-0 text-mark" aria-hidden />
            <span className="text-spark">3D</span>
            <Asterisk className="size-[0.4em] shrink-0 text-mark" aria-hidden />
            <span>AI</span>
          </p>
        </Reveal>
      </div>

      <StackShowcase />

      {/* The evidence: every client legible without scrolling. A table needs
          five columns to work, which a phone cannot give it, so small screens
          get the same rows stacked instead of a sideways scroll. */}
      <div className="shell py-10 md:py-12">
        <div className="grid gap-10 md:hidden">
          {projectsByAgency.map((group) => (
            <div key={group.name}>
              <div className="flex items-baseline justify-between gap-4 pb-3">
                <h3 className="font-display text-2xl uppercase leading-none tracking-[0.012em] text-acid">
                  {group.name}
                </h3>
                <p className="meta text-on-field-3">{group.note}</p>
              </div>
              <ul className="border-t border-line-on-field">
                {group.projects.map((project) => (
                  <li
                    key={project.slug}
                    style={{ ["--accent" as string]: project.accent }}
                    className="border-b border-line-on-field py-5"
                  >
                    <Link
                      href={`/work/${project.slug}`}
                      data-cursor="open"
                      className="group block"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-display text-xl uppercase leading-none tracking-[0.012em]">
                          {project.name}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-2">
                          <span
                            aria-hidden
                            className="size-2 rounded-full bg-accent"
                          />
                          <span className="meta">{project.statusShort}</span>
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-on-field-2">
                        {project.category} · {project.year}
                      </p>
                      <p className="data mt-2 text-on-field-3">
                        {coreStack(project.stack)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hidden md:block">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <caption className="sr-only">
              Projects grouped by where they were built, with category, year,
              core stack and status
            </caption>
            <thead>
              <tr className="border-b border-line-on-field">
                <th scope="col" className="meta pb-3 pr-6 text-on-field-3">
                  Project
                </th>
                <th scope="col" className="meta pb-3 pr-6 text-on-field-3">
                  Category
                </th>
                <th scope="col" className="meta pb-3 pr-6 text-on-field-3">
                  Year
                </th>
                <th scope="col" className="meta pb-3 pr-6 text-on-field-3">
                  Core stack
                </th>
                <th scope="col" className="meta pb-3 text-right text-on-field-3">
                  Status
                </th>
              </tr>
            </thead>
            {projectsByAgency.map((group) => (
              <tbody key={group.name}>
                <tr className="border-b border-line-on-field">
                  <th
                    scope="rowgroup"
                    colSpan={5}
                    className="pb-3 pt-12 text-left font-normal"
                  >
                    <span className="flex items-baseline justify-between gap-6">
                      <span className="font-display text-3xl uppercase leading-none tracking-[0.012em] text-acid md:text-4xl">
                        {group.name}
                      </span>
                      <span className="meta text-on-field-3">{group.note}</span>
                    </span>
                  </th>
                </tr>
                {group.projects.map((project) => (
                  <tr
                    key={project.slug}
                    style={{ ["--accent" as string]: project.accent }}
                    className="group border-b border-line-on-field"
                  >
                    <td className="py-4 pr-6">
                      <Link
                        href={`/work/${project.slug}`}
                        data-cursor="open"
                        className="flex items-center gap-3 font-display text-xl uppercase leading-none tracking-[0.012em] transition-colors duration-300 group-hover:text-hover md:text-2xl"
                      >
                        {project.name}
                        <ArrowUpRight className="size-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </Link>
                    </td>
                    <td className="py-4 pr-6 text-sm text-on-field-2">
                      {project.category}
                    </td>
                    <td className="data py-4 pr-6 text-on-field-2" data-figures>
                      {project.year}
                    </td>
                    <td className="data py-4 pr-6 text-on-field-2">
                      {coreStack(project.stack)}
                    </td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden
                          className="size-2 rounded-full bg-accent"
                        />
                        <span className="meta">{project.statusShort}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>

        <div className="mt-10 grid items-end gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <Reveal delay={0.25}>
            <p className="lede max-w-[52ch] text-on-field-2">{copy.heroBody}</p>
          </Reveal>
          <Reveal delay={0.35} className="lg:justify-self-end">
            <Link
              href="/#work"
              data-cursor="see"
              className="pill-acid transition-transform duration-500 ease-out hover:scale-[1.03]"
            >
              Read the case studies
              <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
