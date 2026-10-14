import Image from "next/image";
import type { Project } from "@/content/projects";

export function ShotFrame({
  project,
  priority = false,
  sizes = "(min-width: 1024px) 52vw, 92vw",
  overlay,
  className,
}: {
  project: Project;
  priority?: boolean;
  sizes?: string;
  overlay?: React.ReactNode;
  className?: string;
}) {
  if (!project.image) return null;

  return (
    <div className={`shot-frame ${className ?? ""}`}>
      <div className="shot-window">
        {/* Decorative: the address is already a real link on the stage above,
            so repeating it here is chrome, not information. */}
        <div aria-hidden className="shot-chrome">
          <span className="shot-chrome-dots">
            <span />
            <span />
            <span />
          </span>
          {project.domain ? (
            <span className="shot-chrome-url">{project.domain}</span>
          ) : null}
          <span className="shot-chrome-tick" />
        </div>

        <div className="shot-plate">
          <Image
            src={project.image}
            alt={project.imageAlt ?? `${project.name} — ${project.category}`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-center"
          />
          {overlay}
        </div>
      </div>
    </div>
  );
}
