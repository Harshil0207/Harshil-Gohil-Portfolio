import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import type { Project } from "@/content/projects";

export function NextProject({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="open"
      className="group block block-ink"
    >
      <div className="shell flex flex-col gap-4 py-14 md:flex-row md:items-baseline md:justify-between md:py-20">
        <div>
          <p className="meta text-white/55">Next project</p>
          <p className="big mt-4 transition-colors duration-300 group-hover:text-acid-lift">
            {project.name}
          </p>
        </div>
        <p className="flex items-center gap-3 text-sm text-white/70">
          {project.category}
          <span className="grid size-11 place-items-center rounded-full border border-white/30 transition-all duration-300 group-hover:border-acid-lift group-hover:bg-acid-lift group-hover:text-ink">
            <ArrowUpRight className="size-4" />
          </span>
        </p>
      </div>
    </Link>
  );
}
