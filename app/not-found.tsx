import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { projects } from "@/content/projects";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center py-32">
      <h1 className="huge max-w-[14ch]">That page was never shipped</h1>
      <p className="lede mt-8 text-on-field-2">
        The link is wrong or the page moved. Every project is listed
        below.
      </p>

      <ul className="mt-12 border-t border-line-on-field">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/work/${project.slug}`}
              data-cursor="open"
              className="group flex items-baseline justify-between gap-6 border-b border-line-on-field py-5"
            >
              <span className="mid transition-colors group-hover:text-acid">
                {project.name}
              </span>
              <span className="flex items-center gap-3 text-sm text-on-field-2">
                {project.category}
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
