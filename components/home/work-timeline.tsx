"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { agencies, projects, type Agency, type Project } from "@/content/projects";
import { gsap, useGSAP } from "@/lib/gsap";

const AGENCY_INK: Record<Agency, string> = {
  MulticodeGenius: "var(--lit)",
  "SSVL Technologies": "#f5a524",
  Independent: "#a594ff",
};

const REST = 30;
const PEAK = 78;
const REACH = 70;

function firstYear(year: string) {
  return Number(year.slice(0, 4));
}

function lastYear(year: string) {
  const match = year.match(/(\d{4})\s*$/);
  return match ? Number(match[1]) : firstYear(year);
}

export function WorkTimeline() {
  const scope = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState<{ index: number; left: number } | null>(null);
  const active = spot?.index ?? null;

  const point = (index: number, element: HTMLElement) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    const slot = element.getBoundingClientRect();
    setSpot({ index, left: ((slot.left + slot.width / 2 - box.left) / box.width) * 100 });
  };

  const ordered = useMemo(
    () =>
      [...projects].sort(
        (a, b) => lastYear(a.year) - lastYear(b.year) || firstYear(a.year) - firstYear(b.year),
      ),
    [],
  );

  const segments = useMemo(() => {
    const groups: { year: number; items: { project: Project; index: number }[] }[] = [];
    ordered.forEach((project, index) => {
      const year = lastYear(project.year);
      const last = groups[groups.length - 1];
      if (last && last.year === year) last.items.push({ project, index });
      else groups.push({ year, items: [{ project, index }] });
    });
    return groups;
  }, [ordered]);

  const counts = useMemo(
    () =>
      agencies.map((agency) => ({
        ...agency,
        total: projects.filter((project) => project.agency === agency.name).length,
      })),
    [],
  );

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const rail = root.querySelector<HTMLElement>("[data-rail]");
      const bars = Array.from(root.querySelectorAll<HTMLElement>("[data-bar]"));
      if (!rail) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          bars,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.9,
            ease: "expo.out",
            stagger: { each: 0.025, from: "start" },
            scrollTrigger: { trigger: rail, start: "top 90%", once: true },
          },
        );

        const grow = bars.map((bar) => gsap.quickTo(bar, "height", { duration: 0.45, ease: "power3.out" }));

        const onMove = (event: PointerEvent) => {
          bars.forEach((bar, index) => {
            const box = bar.getBoundingClientRect();
            const distance = (event.clientX - (box.left + box.width / 2)) / REACH;
            grow[index](REST + (PEAK - REST) * Math.exp(-distance * distance));
          });
        };

        const onLeave = () => grow.forEach((to) => to(REST));

        rail.addEventListener("pointermove", onMove);
        rail.addEventListener("pointerleave", onLeave);
        return () => {
          rail.removeEventListener("pointermove", onMove);
          rail.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => media.revert();
    },
    { scope },
  );

  const focus: Project | null = active === null ? null : ordered[active];
  const position = spot?.left ?? 0;
  const flip = position > 72;

  return (
    <div ref={scope} className="wt mt-12 md:mt-16">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-line-on-field pt-5">
        <p className="meta text-on-field-3">Every build, in order</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {counts.map((agency) => (
            <li key={agency.name} className="meta flex items-center gap-2 text-on-field-2">
              <span aria-hidden className="h-3 w-[3px] rounded-full" style={{ background: AGENCY_INK[agency.name] }} />
              {agency.name}
              <span className="text-on-field-3" data-figures>
                {agency.total}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="wt-scroll mt-6 overflow-x-auto pb-2 md:overflow-visible">
        <div ref={frame} className="relative min-w-[760px] pt-24">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20">
            <p
              className={`meta absolute bottom-1 left-0 text-on-field-3 transition-opacity duration-300 ${focus ? "opacity-0" : "opacity-100"}`}
            >
              Point at a line to read the build
            </p>
            <div
              className={`wt-tip absolute bottom-0 transition-opacity duration-300 ${focus ? "opacity-100" : "opacity-0"} ${flip ? "wt-tip-flip" : ""}`}
              style={{
                left: `${position}%`,
                ["--ink" as string]: focus ? AGENCY_INK[focus.agency] : "transparent",
              }}
            >
              {focus ? (
                <>
                  <span className="meta block whitespace-nowrap text-on-field-3">
                    {focus.category} · {focus.year}
                  </span>
                  <span className="mt-1.5 block whitespace-nowrap font-display text-[clamp(1.4rem,2.2vw,2rem)] uppercase leading-none text-on-field">
                    {focus.name}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <div data-rail className="relative flex gap-3" onPointerLeave={() => setSpot(null)}>
            {segments.map((segment) => (
              <div
                key={segment.year}
                className="wt-seg"
                style={{ flex: `${segment.items.length} 1 0%` }}
              >
                <ol className="flex h-[84px] items-end">
                  {segment.items.map(({ project, index }) => (
                    <li key={project.slug} className="flex h-full flex-1 items-end justify-center">
                      <Link
                        href={`/work/${project.slug}`}
                        aria-label={`${project.name}, ${project.category}, ${project.year}`}
                        data-cursor="open"
                        data-slot={index}
                        onPointerEnter={(event) => point(index, event.currentTarget)}
                        onFocus={(event) => point(index, event.currentTarget)}
                        onBlur={() => setSpot(null)}
                        className={`wt-slot ${active === index ? "is-on" : ""}`}
                        style={{ ["--ink" as string]: AGENCY_INK[project.agency] }}
                      >
                        <span data-bar className="wt-bar" />
                      </Link>
                    </li>
                  ))}
                </ol>
                <div aria-hidden className="wt-base">
                  <span className="wt-sweep" />
                </div>
                <span aria-hidden className="wt-year">
                  {segment.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
