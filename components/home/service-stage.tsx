"use client";

import { useRef, useState } from "react";
import { services } from "@/content/capabilities";
import { techIcons } from "@/content/tech-icons";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const TOOLS: Record<string, string[]> = {
  "Full-stack web apps": ["React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL"],
  "Real-time systems": ["Socket.IO", "Node.js", "Redis", "BullMQ"],
  "E-commerce": ["React", "Next.js", "MongoDB", "Cloudinary", "Zod", "JWT"],
  "3D for the web": ["Three.js", "React Three Fiber", "Blender", "glTF Transform", "GSAP"],
  "AI integration": ["Claude API", "OpenAI API", "Google GenAI", "Python", "PyTorch"],
  "Desktop apps": ["Electron", "TypeScript", "Konva", "Vite"],
};

function Layers() {
  return (
    <div className="sv-layers" aria-hidden>
      {["Interface", "API", "Database"].map((label, index) => (
        <div key={label} className="sv-slab" style={{ ["--i" as string]: index }}>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Pulse() {
  const nodes = [
    [50, 14],
    [86, 34],
    [80, 78],
    [20, 78],
    [14, 34],
  ];
  return (
    <svg viewBox="0 0 100 92" className="sv-pulse" aria-hidden>
      {nodes.map(([x, y], index) => (
        <g key={index}>
          <line x1="50" y1="48" x2={x} y2={y} className="sv-wire" />
          <line
            x1="50"
            y1="48"
            x2={x}
            y2={y}
            className="sv-spark"
            style={{ animationDelay: `${index * 0.42}s` }}
          />
          <circle cx={x} cy={y} r="4.2" className="sv-node" style={{ animationDelay: `${index * 0.42 + 0.5}s` }} />
        </g>
      ))}
      <circle cx="50" cy="48" r="9" className="sv-core" />
      <circle cx="50" cy="48" r="9" className="sv-ring" />
    </svg>
  );
}

function Checkout() {
  const steps = ["Catalogue", "Cart", "Payment", "Shipped"];
  return (
    <div className="sv-flow" aria-hidden>
      <div className="sv-track">
        <span className="sv-runner" />
      </div>
      <ol className="sv-steps">
        {steps.map((step, index) => (
          <li key={step} style={{ animationDelay: `${index * 0.75}s` }}>
            <span className="sv-dot" style={{ animationDelay: `${index * 0.75}s` }} />
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Cube() {
  return (
    <div className="sv-cube-wrap" aria-hidden>
      <div className="sv-cube">
        {["front", "back", "left", "right", "top", "bottom"].map((face) => (
          <span key={face} className={`sv-face sv-${face}`} />
        ))}
      </div>
      <span className="sv-floor" />
    </div>
  );
}

function Chat() {
  return (
    <div className="sv-chat" aria-hidden>
      <div className="sv-bubble sv-ask">Summarise the open orders</div>
      <div className="sv-bubble sv-reply">
        <span className="sv-typing">
          <i />
          <i />
          <i />
        </span>
        <span className="sv-lines">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}

function Window() {
  return (
    <div className="sv-window" aria-hidden>
      <div className="sv-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="sv-body">
        <div className="sv-side">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="sv-canvas">
          <span className="sv-shape sv-shape-a" />
          <span className="sv-shape sv-shape-b" />
          <span className="sv-cursor" />
        </div>
      </div>
      <div className="sv-bridge">
        <span>ipc</span>
        <span className="sv-bridge-line" />
        <span>fs</span>
      </div>
    </div>
  );
}

const VISUALS = [Layers, Pulse, Checkout, Cube, Chat, Window];

function ToolList({ names }: { names: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {names.map((name) => {
        const icon = techIcons[name];
        return (
          <li key={name} className="sv-tool">
            {icon ? (
              <svg viewBox="0 0 24 24" aria-hidden className="size-3.5 shrink-0">
                <path d={icon.path} fill="currentColor" />
              </svg>
            ) : null}
            {name}
          </li>
        );
      })}
    </ul>
  );
}

export function ServiceStage() {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const hovering = useRef(false);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>("[data-service]"));
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px)", () => {
        const triggers = items.map((item, index) =>
          ScrollTrigger.create({
            trigger: item,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive && !hovering.current) setActive(index);
            },
          }),
        );
        return () => triggers.forEach((trigger) => trigger.kill());
      });
      return () => media.revert();
    },
    { scope },
  );

  useGSAP(
    () => {
      const stage = scope.current?.querySelector<HTMLElement>("[data-stage-copy]");
      if (!stage) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          stage.children,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.05, overwrite: true },
        );
      });
      return () => media.revert();
    },
    { scope, dependencies: [active] },
  );

  const current = services[active];
  const Visual = VISUALS[active] ?? Layers;
  const total = String(services.length).padStart(2, "0");

  return (
    <div ref={scope} className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
      <ol
        className="border-t border-line-on-field"
        onPointerLeave={() => {
          hovering.current = false;
        }}
      >
        {services.map((service, index) => {
          const on = index === active;
          const Mini = VISUALS[index] ?? Layers;
          return (
            <li key={service.title} data-service className="border-b border-line-on-field">
              <button
                type="button"
                aria-pressed={on}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  hovering.current = true;
                  setActive(index);
                }}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                className={`sv-item group ${on ? "is-on" : ""}`}
              >
                <span className="data sv-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="sv-title">{service.title}</span>
                <span aria-hidden className="sv-arrow">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </button>

              <div className="pb-8 lg:hidden">
                <div className="sv-screen sv-screen-sm">
                  <Mini />
                </div>
                <p className="mt-5 text-on-field-2">{service.body}</p>
                <div className="mt-4">
                  <ToolList names={TOOLS[service.title] ?? []} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:block">
        <div className="sv-stage sticky top-28">
          <div className="sv-stage-head">
            <span className="meta text-on-field-3">
              <span className="text-acid">{String(active + 1).padStart(2, "0")}</span> / {total}
            </span>
            <span className="meta text-on-field-3">{current.title}</span>
          </div>
          <div className="sv-screen">
            <div key={current.title} className="sv-swap">
              <Visual />
            </div>
          </div>
          <div data-stage-copy className="p-7">
            <p className="text-lg leading-relaxed text-on-field">{current.body}</p>
            <div className="mt-6">
              <ToolList names={TOOLS[current.title] ?? []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
