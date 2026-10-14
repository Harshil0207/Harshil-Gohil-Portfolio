import type { Project } from "@/content/projects";

/**
 * Stands in where a project has no screenshot yet.
 *
 * It wears the same frame as a real capture — same border, same ratio — so a
 * row without a screenshot reads as a system whose shot has not been taken,
 * not as a broken image. It carries the status where a capture would carry the
 * interface, because a system with no capture usually has no public one either.
 */
export function ShotPending({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <div className={`shot-frame ${className ?? ""}`}>
      {/* Same window as a real capture, minus the browser bar: there is no
          address to put in one until the system has a public URL. */}
      <div className="shot-window">
        <div
          className="shot-plate flex flex-col justify-between p-6 md:p-8"
          style={{
            background: `color-mix(in oklab, ${project.accent} 12%, transparent)`,
          }}
        >
          {/* A client ink chosen for fills is rarely legible at meta size, so
              the kicker takes it mixed toward the ground's own type colour. */}
          <p
            className="meta"
            style={{
              color: `color-mix(in oklab, ${project.accent} 55%, currentColor)`,
            }}
          >
            {project.kicker}
          </p>
          <div>
            <p className="big leading-[0.9]">{project.name}</p>
            <p className="data mt-3 opacity-60" data-figures>
              {project.category} · {project.year}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
