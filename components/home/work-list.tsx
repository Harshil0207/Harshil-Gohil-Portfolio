"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, ViewTransition } from "react";
import { ArrowUpRight } from "@/components/icons";
import type { Project } from "@/content/projects";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const CHIPS = 3;

function Preview({ project }: { project: Project }) {
  return (
    <div className="wl-card-body" style={{ ["--accent" as string]: project.accent }}>
      {project.image ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="360px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="wl-card-plate">
          <span className="wl-card-index">{project.index}</span>
          <span className="meta wl-card-cat">{project.category}</span>
        </div>
      )}
      <div className="p-5">
        {project.domain ? <p className="data text-lit">{project.domain}</p> : null}
        <p className="mt-2 line-clamp-4 text-[0.92rem] leading-relaxed text-on-field-2">
          {project.summary}
        </p>
        {project.stack.length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 6).map((item) => (
            <li key={item} className="work-chip">
              {item}
            </li>
          ))}
        </ul>
        ) : null}
      </div>
    </div>
  );
}

export function WorkList({ projects }: { projects: Project[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<Project | null>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const preview = card.current;
      if (!root || !preview) return;
      const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-row]"));

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(rows, { opacity: 0, y: 34 });
        const batch = ScrollTrigger.batch(rows, {
          start: "top 88%",
          once: true,
          onEnter: (entered) =>
            gsap.to(entered, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });
        return () => batch.forEach((trigger) => trigger.kill());
      });

      media.add("(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 1024px)", () => {
        gsap.set(preview, { xPercent: 0, yPercent: -50, autoAlpha: 0, scale: 0.9 });
        const moveX = gsap.quickTo(preview, "x", { duration: 0.55, ease: "power3.out" });
        const moveY = gsap.quickTo(preview, "y", { duration: 0.55, ease: "power3.out" });
        const tilt = gsap.quickTo(preview, "rotation", { duration: 0.6, ease: "power3.out" });
        let lastX = 0;
        let current = "";

        const show = (slug: string) => {
          if (slug === current) return;
          current = slug;
          setFocus(projects.find((item) => item.slug === slug) ?? null);
          gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "expo.out", overwrite: "auto" });
        };

        const hide = () => {
          if (!current) return;
          current = "";
          gsap.to(preview, { autoAlpha: 0, scale: 0.92, duration: 0.3, ease: "power2.in", overwrite: "auto" });
          tilt(0);
        };

        const onMove = (event: PointerEvent) => {
          const row = (event.target as Element | null)?.closest<HTMLElement>("[data-row]");
          if (!row?.dataset.slug) {
            hide();
            return;
          }
          const box = root.getBoundingClientRect();
          const localX = event.clientX - box.left;
          const localY = event.clientY - box.top;
          const width = preview.offsetWidth;
          const room = box.width - localX - 72 > width;
          moveX(room ? localX + 72 : localX - width - 72);
          moveY(localY);
          tilt(gsap.utils.clamp(-3, 3, (event.clientX - lastX) * 0.2));
          lastX = event.clientX;
          show(row.dataset.slug);
        };

        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", hide);
        window.addEventListener("scroll", hide, { passive: true });

        return () => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", hide);
          window.removeEventListener("scroll", hide);
        };
      });

      return () => media.revert();
    },
    { scope, dependencies: [projects] },
  );

  return (
    <div ref={scope} className="shell relative pb-16 md:pb-24">
      <div className="wl-head meta hidden text-on-field-3 lg:grid">
        <span>No.</span>
        <span>Project</span>
        <span>Category</span>
        <span>Built with</span>
        <span className="text-right">Status</span>
      </div>

      <ol className="wl-list">
        {projects.map((project) => {
          const chips = project.stack.slice(0, CHIPS);
          const extra = project.stack.length - chips.length;
          return (
            <li
              key={project.slug}
              data-row
              data-slug={project.slug}
              className="wl-row"
              style={{ ["--accent" as string]: project.accent }}
            >
              <Link href={`/work/${project.slug}`} data-cursor="open" className="wl-link">
                <span aria-hidden className="wl-wash" />
                <span className="wl-index" data-figures>
                  {project.index}
                </span>

                <span className="min-w-0">
                  <span className="meta block text-lit">{project.kicker}</span>
                  <ViewTransition name={`title-${project.slug}`} share="morph" default="none">
                    <h3 className="wl-name">{project.name}</h3>
                  </ViewTransition>
                  <span className="mt-3 block max-w-[52ch] text-[0.95rem] leading-relaxed text-on-field-2 lg:hidden">
                    {project.summary}
                  </span>
                </span>

                <span className="hidden flex-col gap-1 md:flex">
                  <span className="data text-on-field">{project.category}</span>
                  <span className="data text-on-field-3" data-figures>
                    {project.year}
                  </span>
                </span>

                <span className="hidden flex-wrap gap-1.5 lg:flex">
                  {chips.map((item) => (
                    <span key={item} className="work-chip">
                      {item}
                    </span>
                  ))}
                  {extra > 0 ? (
                    <span className="work-chip" data-figures>
                      +{extra}
                    </span>
                  ) : null}
                </span>

                <span className="flex items-center justify-between gap-4 md:justify-end">
                  <span className="data flex items-center gap-2 whitespace-nowrap text-on-field-2">
                    <span className="work-led" aria-hidden />
                    {project.statusShort}
                  </span>
                  <span aria-hidden className="wl-arrow">
                    <ArrowUpRight className="size-4" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div ref={card} aria-hidden className="wl-card pointer-events-none absolute left-0 top-0 z-20 hidden lg:block">
        {focus ? <Preview project={focus} /> : null}
      </div>
    </div>
  );
}
