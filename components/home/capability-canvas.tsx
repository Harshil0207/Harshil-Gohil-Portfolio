"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { services } from "@/content/capabilities";
import { copy } from "@/content/company";
import { techIcons } from "@/content/tech-icons";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";

const CapabilitySwarm = dynamic(() => import("./capability-swarm"), { ssr: false });

const STEPS = services.length;

const TOOLS: Record<string, string[]> = {
  "Full-stack web apps": ["React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL"],
  "Real-time systems": ["Socket.IO", "Node.js", "Redis", "BullMQ"],
  "E-commerce": ["React", "Next.js", "MongoDB", "Cloudinary", "Zod", "JWT"],
  "3D for the web": ["Three.js", "React Three Fiber", "Blender", "glTF Transform", "GSAP"],
  "AI integration": ["Claude API", "OpenAI API", "Google GenAI", "Python", "PyTorch"],
  "Desktop apps": ["Electron", "TypeScript", "Konva", "Vite"],
};

function subscribePalette(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-palette"] });
  return () => observer.disconnect();
}

function readAcid() {
  return getComputedStyle(document.documentElement).getPropertyValue("--acid").trim() || "#3db5ea";
}

function Tools({ names }: { names: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {names.map((name) => {
        const icon = techIcons[name];
        return (
          <li key={name} className="cc-tool">
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

const TICKS = Array.from({ length: 120 }, (_, index) => {
  const angle = (index / 120) * Math.PI * 2;
  const major = index % 10 === 0;
  const inner = major ? 432 : 446;
  return {
    major,
    x1: (Math.cos(angle) * inner).toFixed(2),
    y1: (Math.sin(angle) * inner).toFixed(2),
    x2: (Math.cos(angle) * 460).toFixed(2),
    y2: (Math.sin(angle) * 460).toFixed(2),
  };
});

function CcBackdrop({ active }: { active: number }) {
  return (
    <div aria-hidden className="cc-bg">
      <span className="cc-bg-wash" />
      <div className="cc-glow" />
      <div className="cc-floor">
        <span />
      </div>
      <div className="cc-orbit">
        <span className="cc-sweep" />
        <svg viewBox="-500 -500 1000 1000" className="cc-orbit-svg">
          <circle r="250" className="cc-ring-faint" />
          <circle r="380" className="cc-ring-dash" />
          <circle r="380" pathLength={1} className="cc-ring-progress" />
          <g className="cc-dial">
            <circle r="460" className="cc-ring-faint" />
            {TICKS.map((tick, index) => (
              <line
                key={index}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                className={tick.major ? "cc-tick cc-tick-major" : "cc-tick"}
              />
            ))}
          </g>
        </svg>
        <span className="cc-marker" />
        {services.map((service, index) => (
          <span
            key={service.title}
            className={`cc-station ${index === active ? "is-on" : ""}`}
            style={{ ["--a" as string]: `${180 + index * 60}deg` }}
          >
            <i />
            <b>{String(index + 1).padStart(2, "0")}</b>
          </span>
        ))}
      </div>
      <span className="cc-bg-grain" />
    </div>
  );
}

export function CapabilityCanvas() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const color = useSyncExternalStore(subscribePalette, readAcid, () => "#3db5ea");
  const motion = !usePrefersReducedMotion();
  const [live, setLive] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setLive(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [motion]);

  useGSAP(
    () => {
      const root = section.current;
      const pinned = stage.current;
      if (!root || !pinned || !motion) return;
      let last = 0;
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * (STEPS - 1) * 0.9}`,
        pin: pinned,
        scrub: 0.8,
        snap: {
          snapTo: 1 / (STEPS - 1),
          duration: { min: 0.25, max: 0.7 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          progress.current = self.progress * (STEPS - 1);
          pinned.style.setProperty("--cc-p", progress.current.toFixed(3));
          const next = Math.round(progress.current);
          if (next !== last) {
            last = next;
            setActive(next);
          }
        },
      });
      return () => trigger.kill();
    },
    { scope: section, dependencies: [motion] },
  );

  useGSAP(
    () => {
      const copyBlock = section.current?.querySelector<HTMLElement>("[data-cc-copy]");
      if (!copyBlock || !motion) return;
      gsap.fromTo(
        copyBlock.children,
        { opacity: 0, y: 24, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "expo.out", stagger: 0.06, overwrite: true },
      );
    },
    { scope: section, dependencies: [active, motion] },
  );

  const current = services[active];
  const pad = (value: number) => String(value).padStart(2, "0");

  if (!motion) {
    return (
      <section id="capabilities" ref={section} className="block-field">
        <div className="shell py-16 md:py-24">
          <h2 className="big">{copy.capabilitiesTitle}</h2>
          <p className="lede mt-6 max-w-[42ch] text-on-field-2">{copy.capabilitiesBody}</p>
          <ol className="mt-12 border-t border-line-on-field">
            {services.map((service, index) => (
              <li key={service.title} className="grid gap-4 border-b border-line-on-field py-8 md:grid-cols-[4rem_1fr_1.2fr]">
                <span className="data text-acid">{pad(index + 1)}</span>
                <h3 className="mid">{service.title}</h3>
                <div>
                  <p className="text-on-field-2">{service.body}</p>
                  <div className="mt-4">
                    <Tools names={TOOLS[service.title] ?? []} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="capabilities" ref={section} className="block-field relative">
      <div ref={stage} className="cc-stage relative h-dvh overflow-hidden">
        <CcBackdrop active={active} />
        <div aria-hidden className="absolute inset-0">
          {seen ? <CapabilitySwarm progress={progress} color={color} live={live} /> : null}
        </div>

        <div className="shell pointer-events-none relative z-10 flex h-full flex-col justify-between pb-10 pt-24 md:pb-14 md:pt-28">
          <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <h2 className="font-display text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[0.9]">
              {copy.capabilitiesTitle}
            </h2>
            <p className="max-w-[36ch] text-sm leading-relaxed text-on-field-2 md:text-base">
              {copy.capabilitiesBody}
            </p>
          </header>

          <div className="flex items-end justify-between gap-10">
            <div data-cc-copy className="max-w-xl" aria-live="polite">
              <p className="meta text-on-field-3">
                <span className="text-acid">{pad(active + 1)}</span> / {pad(STEPS)}
              </p>
              <h3 className="mt-4 font-display text-[clamp(2.6rem,7vw,6.5rem)] uppercase leading-[0.88]">
                {current.title}
              </h3>
              <p className="mt-5 max-w-[46ch] text-on-field-2 md:text-lg md:leading-relaxed">{current.body}</p>
              <div className="pointer-events-auto mt-6">
                <Tools names={TOOLS[current.title] ?? []} />
              </div>
            </div>

            <ol className="hidden flex-col gap-3 md:flex" aria-hidden>
              {services.map((service, index) => (
                <li key={service.title} className={`cc-step ${index === active ? "is-on" : ""}`}>
                  <span className="cc-step-label">{service.title}</span>
                  <span className="cc-step-bar" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
