"use client";

import { useRef, useState } from "react";
import { capabilities } from "@/content/capabilities";
import { projects } from "@/content/projects";
import { techIcons } from "@/content/tech-icons";
import { gsap, useGSAP } from "@/lib/gsap";

const SYMBOLS: Record<string, string> = {
  React: "Re",
  "Next.js": "Nx",
  TypeScript: "Ts",
  JavaScript: "Js",
  Tailwind: "Tw",
  "styled-components": "Sc",
  Zustand: "Zu",
  "Radix UI": "Rx",
  "Node.js": "No",
  Express: "Ex",
  NestJS: "Ns",
  "Socket.IO": "So",
  REST: "Rs",
  Zod: "Zd",
  JWT: "Jw",
  MongoDB: "Mg",
  PostgreSQL: "Pg",
  MySQL: "My",
  Supabase: "Sb",
  Mongoose: "Mo",
  Sequelize: "Sq",
  "Drizzle ORM": "Dz",
  Redis: "Rd",
  BullMQ: "Bq",
  "Three.js": "Th",
  "React Three Fiber": "Rf",
  Blender: "Bl",
  "glTF Transform": "Gt",
  Electron: "El",
  Konva: "Kv",
  "Claude API": "Cl",
  "OpenAI API": "Oa",
  "AI agents": "Ag",
  "Google GenAI": "Gg",
  Python: "Py",
  PyTorch: "Pt",
  GSAP: "Gs",
  "Framer Motion": "Fm",
  Lenis: "Ln",
  Vite: "Vi",
  Leaflet: "Lf",
  Cloudinary: "Cd",
  Vercel: "Vc",
  Git: "Gi",
};

const FAMILY = ["#4cc9f0", "#f4a261", "#8fd694", "#b69cff", "#ff7aa8", "#ffd166"];

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

type Element = {
  number: number;
  name: string;
  symbol: string;
  family: number;
  familyName: string;
  builds: { slug: string; name: string }[];
};

let counter = 0;
const columns = capabilities.map((group, family) => ({
  title: group.title,
  family,
  elements: group.items.map<Element>((name) => {
    counter += 1;
    const key = normalise(name);
    return {
      number: counter,
      name,
      symbol: SYMBOLS[name] ?? name.slice(0, 2),
      family,
      familyName: group.title,
      builds: projects
        .filter((project) => project.stack.some((item) => normalise(item) === key))
        .map((project) => ({ slug: project.slug, name: project.name })),
    };
  }),
}));

const SLOTS: [number, number][] = [];
for (let column = 1; column <= 18; column += 1) {
  const rows =
    column === 1 || column === 18
      ? [1, 2, 3, 4]
      : column === 2 || column >= 13
        ? [2, 3, 4]
        : [4];
  for (const row of rows) SLOTS.push([column, row]);
}

const body = columns.slice(0, 5).flatMap((column) => column.elements);
const series = columns[5]?.elements ?? [];
const placed = [
  ...body.map((element, index) => {
    const [column, row] = SLOTS[index] ?? [((index - SLOTS.length) % 18) + 1, 7];
    return { element, column, row };
  }),
  ...series.map((element, index) => ({ element, column: index + 3, row: 6 })),
];

function brandInk(name: string) {
  const icon = techIcons[name];
  if (!icon) return "#ffffff";
  const value = parseInt(icon.hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.3 ? "#ffffff" : icon.hex;
}

function Logo({ name, className }: { name: string; className: string }) {
  const icon = techIcons[name];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

const GLOWS = [
  { family: 0, left: "-6%", top: "8%", size: "38%" },
  { family: 1, left: "18%", top: "58%", size: "34%" },
  { family: 2, left: "56%", top: "22%", size: "30%" },
  { family: 3, left: "70%", top: "4%", size: "28%" },
  { family: 4, left: "82%", top: "30%", size: "30%" },
  { family: 5, left: "8%", top: "78%", size: "36%" },
];

function Backdrop() {
  return (
    <div aria-hidden className="pt-bg">
      {GLOWS.map((glow) => (
        <span
          key={glow.family}
          className="pt-bg-glow"
          style={{
            left: glow.left,
            top: glow.top,
            width: glow.size,
            ["--el" as string]: FAMILY[glow.family],
          }}
        />
      ))}
      <span className="pt-bg-grid" />
      <span className="pt-bg-scan" />
      <span className="pt-bg-grain" />
    </div>
  );
}

export function TechStack() {
  const scope = useRef<HTMLDivElement>(null);
  const [family, setFamily] = useState<number | null>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cells = Array.from(root.querySelectorAll<HTMLElement>("[data-cell]"));
        const intro = Array.from(root.querySelectorAll<HTMLElement>("[data-pt-intro]"));
        gsap.set(cells, { opacity: 0, rotateX: -70, y: 26, transformPerspective: 600, transformOrigin: "50% 100%" });
        gsap.set(intro, { opacity: 0, y: 24 });
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
          onComplete: () => {
            gsap.set(cells, { clearProps: "transform,opacity" });
          },
        });
        timeline
          .to(intro, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0)
          .to(
            cells,
            {
              opacity: 1,
              rotateX: 0,
              y: 0,
              duration: 0.95,
              ease: "expo.out",
              stagger: (index, target) => Number((target as HTMLElement).dataset.wave ?? index) * 0.045,
            },
            0.15,
          );
        return () => timeline.kill();
      });
      return () => media.revert();
    },
    { scope },
  );


  return (
    <div ref={scope} className="block-ink pt-stage relative isolate overflow-x-clip">
      <Backdrop />
      <div className="shell relative z-[1] py-16 md:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
          <p className="meta text-white/45">The periodic table of the stack</p>
          <p className="meta text-white/45">
            {columns.length} groups · {placed.length} elements
          </p>
        </div>

        <div className="pt-scroll mt-10 overflow-x-auto pb-4 lg:overflow-visible">
          <div className={`pt-grid ${family !== null ? "has-family" : ""}`}>
            <div className="pt-gap">
              <h3 data-pt-intro className="font-display text-[clamp(2rem,3.6vw,3.6rem)] uppercase leading-[0.9]">
                Everything these
                <br />
                systems run on
              </h3>
              <div className="pt-gap-row">
                <ul data-pt-intro className="pt-legend" onPointerLeave={() => setFamily(null)}>
                  {columns.map((column) => (
                    <li key={column.title}>
                      <button
                        type="button"
                        onPointerEnter={() => setFamily(column.family)}
                        onFocus={() => setFamily(column.family)}
                        onBlur={() => setFamily(null)}
                        className={`pt-key ${family === column.family ? "is-on" : ""}`}
                        style={{ ["--el" as string]: FAMILY[column.family] }}
                      >
                        <span aria-hidden className="pt-key-dot" />
                        {column.title}
                      </button>
                    </li>
                  ))}
                </ul>
                <div data-pt-intro className="pt-anatomy" aria-hidden style={{ ["--el" as string]: FAMILY[0] }}>
                  <div className="pt-cell pt-cell-key">
                    <span className="pt-cell-num">1</span>
                    <span className="pt-cell-mass">25</span>
                    <span className="pt-cell-sym">Re</span>
                    <span className="pt-cell-name">React</span>
                  </div>
                  <ul className="pt-anatomy-notes">
                    <li>Number</li>
                    <li>Builds using it</li>
                    <li>Symbol</li>
                    <li>Tool</li>
                  </ul>
                </div>
              </div>
            </div>

            <p data-pt-intro className="pt-series-label" style={{ gridRow: 6, gridColumn: "1 / 3" }}>
              <span>{columns[5].title}</span>
            </p>

            {placed.map(({ element, column, row }) => (
              <div
                key={element.name}
                tabIndex={0}
                data-cell
                data-wave={column + row * 1.4}
                aria-label={`${element.name}, ${element.familyName}, used in ${element.builds.length} builds`}
                className={`pt-cell pt-flipper ${family !== null && family !== element.family ? "is-dim" : ""}`}
                style={{
                  gridColumn: column,
                  gridRow: row,
                  ["--el" as string]: FAMILY[element.family],
                  ["--brand" as string]: brandInk(element.name),
                }}
              >
                <div className="pt-flip">
                  <div className="pt-face pt-front">
                    <span className="pt-cell-num">{element.number}</span>
                    <span className="pt-cell-mass">{element.builds.length}</span>
                    <span className="pt-cell-sym">{element.symbol}</span>
                    <span className="pt-cell-name">{element.name}</span>
                  </div>
                  <div className="pt-face pt-back" aria-hidden>
                    {techIcons[element.name] ? (
                      <Logo name={element.name} className="pt-back-logo" />
                    ) : (
                      <span className="pt-back-mono">{element.symbol}</span>
                    )}
                    <span className="pt-back-name">{element.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
