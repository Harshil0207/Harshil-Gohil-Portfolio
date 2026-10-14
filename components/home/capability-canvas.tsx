"use client";

import "@/lib/three-console";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { services } from "@/content/capabilities";
import { copy } from "@/content/company";
import { techIcons } from "@/content/tech-icons";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";

const COUNT = 3600;
const STEPS = services.length;

const TOOLS: Record<string, string[]> = {
  "Full-stack web apps": ["React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL"],
  "Real-time systems": ["Socket.IO", "Node.js", "Redis", "BullMQ"],
  "E-commerce": ["React", "Next.js", "MongoDB", "Cloudinary", "Zod", "JWT"],
  "3D for the web": ["Three.js", "React Three Fiber", "Blender", "glTF Transform", "GSAP"],
  "AI integration": ["Claude API", "OpenAI API", "Google GenAI", "Python", "PyTorch"],
  "Desktop apps": ["Electron", "TypeScript", "Konva", "Vite"],
};

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

type Point = [number, number, number];

function onSegment(a: Point, b: Point, t: number): Point {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function onRectOutline(cx: number, cy: number, w: number, h: number, t: number): Point {
  const perimeter = 2 * (w + h);
  let d = t * perimeter;
  if (d < w) return [cx - w / 2 + d, cy + h / 2, 0];
  d -= w;
  if (d < h) return [cx + w / 2, cy + h / 2 - d, 0];
  d -= h;
  if (d < w) return [cx + w / 2 - d, cy - h / 2, 0];
  d -= w;
  return [cx - w / 2, cy - h / 2 + d, 0];
}

function onSphere(r: number, rand: () => number, center: Point): Point {
  const u = rand() * 2 - 1;
  const a = rand() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [center[0] + r * s * Math.cos(a), center[1] + r * u, center[2] + r * s * Math.sin(a)];
}

function buildShapes() {
  const shapes: Float32Array[] = [];
  const make = (fill: (i: number, rand: () => number) => Point, seed: number) => {
    const rand = seeded(seed);
    const out = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      const [x, y, z] = fill(i, rand);
      out[i * 3] = x;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = z;
    }
    return out;
  };

  shapes.push(
    make((i, rand) => {
      const layer = i % 3;
      const y = (1 - layer) * 0.95;
      const edge = rand() < 0.35;
      if (edge) {
        const [x, z] = onRectOutline(0, 0, 3.4, 3.4, rand());
        return [x, y, z];
      }
      return [(rand() - 0.5) * 3.4, y + (rand() - 0.5) * 0.03, (rand() - 0.5) * 3.4];
    }, 11),
  );

  const outer: Point[] = Array.from({ length: 5 }, (_, k) => {
    const a = (k / 5) * Math.PI * 2 + Math.PI / 2;
    return [Math.cos(a) * 2.3, Math.sin(a) * 1.7, Math.sin(a * 2) * 0.6];
  });
  shapes.push(
    make((i, rand) => {
      const pick = rand();
      if (pick < 0.3) return onSphere(0.55 + rand() * 0.04, rand, [0, 0, 0]);
      const node = outer[i % 5];
      if (pick < 0.55) return onSphere(0.24, rand, node);
      const p = onSegment([0, 0, 0], node, 0.18 + rand() * 0.7);
      return [p[0] + (rand() - 0.5) * 0.04, p[1] + (rand() - 0.5) * 0.04, p[2]];
    }, 23),
  );

  const stops = [-2.7, -0.9, 0.9, 2.7];
  shapes.push(
    make((i, rand) => {
      const pick = rand();
      if (pick < 0.3) {
        return [-2.7 + rand() * 5.4, (rand() - 0.5) * 0.05, (rand() - 0.5) * 0.05];
      }
      const x = stops[i % 4];
      const a = rand() * Math.PI * 2;
      const r = pick < 0.75 ? 0.5 : 0.5 * Math.sqrt(rand());
      return [x + (rand() - 0.5) * 0.04, Math.cos(a) * r, Math.sin(a) * r];
    }, 37),
  );

  const corners: Point[] = [];
  for (const x of [-1.3, 1.3]) for (const y of [-1.3, 1.3]) for (const z of [-1.3, 1.3]) corners.push([x, y, z]);
  const edges: [number, number][] = [];
  corners.forEach((a, i) =>
    corners.forEach((b, j) => {
      if (j > i && [0, 1, 2].filter((axis) => a[axis] !== b[axis]).length === 1) edges.push([i, j]);
    }),
  );
  shapes.push(
    make((i, rand) => {
      if (rand() < 0.62) {
        const [a, b] = edges[i % edges.length];
        return onSegment(corners[a], corners[b], rand());
      }
      const axis = Math.floor(rand() * 3);
      const p: Point = [(rand() - 0.5) * 2.6, (rand() - 0.5) * 2.6, (rand() - 0.5) * 2.6];
      p[axis] = rand() < 0.5 ? -1.3 : 1.3;
      return p;
    }, 41),
  );

  shapes.push(
    make((i, rand) => {
      const pick = rand();
      if (pick < 0.32) {
        const [x, y] = onRectOutline(0.95, 0.95, 2.6, 0.9, rand());
        return [x, y, (rand() - 0.5) * 0.1];
      }
      if (pick < 0.7) {
        const [x, y] = onRectOutline(-0.55, -0.65, 3.4, 1.5, rand());
        return [x, y, (rand() - 0.5) * 0.1];
      }
      if (pick < 0.86) {
        const line = i % 3;
        const width = [2.6, 2.1, 1.4][line];
        return [-2.0 + rand() * width, -0.3 - line * 0.35, 0];
      }
      return onSphere(0.07, rand, [1.6 + (i % 3) * 0.28, 0.95, 0]);
    }, 53),
  );

  shapes.push(
    make((i, rand) => {
      const pick = rand();
      if (pick < 0.38) {
        const [x, y] = onRectOutline(0, 0, 4.6, 2.9, rand());
        return [x, y, 0];
      }
      if (pick < 0.48) return [-2.3 + rand() * 4.6, 1.0, 0];
      if (pick < 0.56) return [-1.2, -1.45 + rand() * 2.45, 0];
      if (pick < 0.7) {
        const bar = i % 4;
        return [-2.05 + rand() * 0.6, 0.65 - bar * 0.4, 0];
      }
      if (pick < 0.9) {
        const [x, y] = onRectOutline(0.35, -0.15, 1.5, 1.05, rand());
        return [x, y, 0];
      }
      return onSphere(0.05, rand, [1.4 + (i % 3) * 0.22, 1.22, 0]);
    }, 67),
  );

  return shapes;
}

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function makeDot() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.7)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

function Swarm({ progress, color }: { progress: { current: number }; color: string }) {
  const shapes = useMemo(() => buildShapes(), []);
  const delays = useMemo(() => {
    const rand = seeded(97);
    return Float32Array.from({ length: COUNT }, () => rand() * 0.35);
  }, []);
  const start = useMemo(() => shapes[0].slice(), [shapes]);
  const dot = useMemo(() => makeDot(), []);
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => () => dot.dispose(), [dot]);

  useFrame((state) => {
    const cloud = points.current;
    if (!cloud) return;
    const p = Math.min(STEPS - 1, Math.max(0, progress.current));
    const from = Math.floor(p);
    const to = Math.min(STEPS - 1, from + 1);
    const t = p - from;
    const a = shapes[from];
    const b = shapes[to];
    const attribute = cloud.geometry.getAttribute("position") as THREE.BufferAttribute;
    const out = attribute.array as Float32Array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i += 1) {
      const local = ease(Math.min(1, Math.max(0, (t - delays[i]) / 0.65)));
      const j = i * 3;
      const wobble = Math.sin(time * 1.3 + i * 0.37) * 0.012;
      out[j] = a[j] + (b[j] - a[j]) * local + wobble;
      out[j + 1] = a[j + 1] + (b[j + 1] - a[j + 1]) * local + wobble;
      out[j + 2] = a[j + 2] + (b[j + 2] - a[j + 2]) * local;
    }
    attribute.needsUpdate = true;

    const node = group.current;
    if (node) {
      const wide = state.viewport.aspect > 1.15;
      const targetX = wide ? state.viewport.width * 0.17 : 0;
      const targetY = wide ? 0.15 : state.viewport.height * 0.12;
      const targetScale = wide ? 1 : 0.62;
      node.position.x += (targetX - node.position.x) * 0.08;
      node.position.y += (targetY - node.position.y) * 0.08;
      node.scale.setScalar(node.scale.x + (targetScale - node.scale.x) * 0.08);
      const tilt = from === 0 && t < 0.5 ? 0.55 : 0.18;
      node.rotation.y += (time * 0.12 + pointer.current.x * 0.5 - node.rotation.y) * 0.05;
      node.rotation.x += (tilt + pointer.current.y * 0.25 - node.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[start, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={dot}
          color={color}
        />
      </points>
    </group>
  );
}

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
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [0, 0, 8.2], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <Swarm progress={progress} color={color} />
          </Canvas>
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
