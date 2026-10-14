import Image from "next/image";
import type { Project } from "@/content/projects";

export function WorkPlate({
  project,
  priority,
  flipped,
}: {
  project: Project;
  priority: boolean;
  flipped: boolean;
}) {
  return (
    <div
      className={`work-slab relative aspect-[1440/780] w-full ${
        flipped ? "work-slab-flipped" : ""
      }`}
    >
      {project.image ? (
        <div className="work-slab-edge relative h-full w-full">
          <Image
            src={project.image}
            alt={project.imageAlt ?? `${project.name} — ${project.category}`}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            priority={priority}
            className="work-slab-shot object-cover"
          />
          <span aria-hidden data-scan className="work-scan" />
        </div>
      ) : (
        <div className="work-slab-edge work-plate-pending relative h-full w-full">
          <span aria-hidden className="work-hatch" />

          {/* Held clear of the masked band at the top, and of the soft bottom. */}
          <div className="relative z-10 flex h-full items-end px-5 pb-[7%] md:px-10">
            <div className="flex w-full flex-wrap items-end justify-between gap-x-6 gap-y-2">
              {/* A system with a public address is simply awaiting its capture;
                  one without has nothing to point a browser at, and says so. */}
              <p className="data text-lit">
                {project.url ? "Capture pending" : "Not publicly addressable"}
              </p>
              <p className="data flex items-center gap-2 text-on-field-2">
                <span className="work-led" aria-hidden />
                {project.statusShort}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
