"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Agency, Project } from "@/content/projects";
import { ScrollTrigger } from "@/lib/gsap";
import { WorkList } from "./work-list";

type Group = { name: Agency; note: string; projects: Project[] };

function slugOf(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function WorkTabs({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = groups[active];

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [active]);

  const select = (next: number) => {
    const index = (next + groups.length) % groups.length;
    setActive(index);
    tabs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") select(active + 1);
    else if (event.key === "ArrowLeft") select(active - 1);
    else if (event.key === "Home") select(0);
    else if (event.key === "End") select(groups.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <>
      <div className="shell">
        <div
          role="tablist"
          aria-label="Projects by agency"
          onKeyDown={onKeyDown}
          className="flex flex-wrap gap-x-10 gap-y-4 border-b border-line-on-field pb-5"
        >
          {groups.map((group, index) => {
            const selected = index === active;
            const id = slugOf(group.name);
            return (
              <button
                key={group.name}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`work-tab-${id}`}
                aria-selected={selected}
                aria-controls={`work-panel-${id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                data-cursor="see"
                className="group flex flex-col items-start gap-2 text-left"
              >
                <span
                  className={`font-display text-2xl uppercase leading-none tracking-[0.012em] transition-colors duration-300 md:text-4xl ${
                    selected
                      ? "text-acid"
                      : "text-on-field-3 group-hover:text-on-field-2"
                  }`}
                >
                  {group.name}
                </span>
                <span className="meta flex items-center gap-2 text-on-field-3">
                  <span
                    aria-hidden
                    className={`size-1.5 rounded-full transition-colors duration-300 ${
                      selected ? "bg-acid" : "bg-line-on-field"
                    }`}
                  />
                  {group.note} · {group.projects.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={current.name}
        role="tabpanel"
        id={`work-panel-${slugOf(current.name)}`}
        aria-labelledby={`work-tab-${slugOf(current.name)}`}
        className="mt-10 md:mt-14"
      >
        <WorkList projects={current.projects} />
      </div>
    </>
  );
}
