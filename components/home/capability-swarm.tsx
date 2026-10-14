"use client";

import "@/lib/three-console";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { services } from "@/content/capabilities";

const COUNT = 3600;
const STEPS = services.length;

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

export default function CapabilitySwarm({
  progress,
  color,
  live,
}: {
  progress: { current: number };
  color: string;
  live: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={live ? "always" : "never"}
      camera={{ position: [0, 0, 8.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Swarm progress={progress} color={color} />
    </Canvas>
  );
}
