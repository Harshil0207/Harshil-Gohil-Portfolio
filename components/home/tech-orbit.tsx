"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Node = {
  el: HTMLElement;
  x: number;
  y: number;
  z: number;
  group: string;
  back: boolean;
};

type Ring = { front: SVGPathElement; back: SVGPathElement; points: number[][] };

const RING_STEPS = 72;

function circle(map: (t: number) => number[]) {
  const points: number[][] = [];
  for (let i = 0; i <= RING_STEPS; i++) points.push(map((i / RING_STEPS) * Math.PI * 2));
  return points;
}

function parallel(lat: number) {
  const phi = (lat * Math.PI) / 180;
  return circle((t) => [Math.cos(phi) * Math.cos(t), Math.sin(phi), Math.cos(phi) * Math.sin(t)]);
}

function meridian(lon: number) {
  const lambda = (lon * Math.PI) / 180;
  return circle((t) => [Math.cos(t) * Math.cos(lambda), Math.sin(t), Math.cos(t) * Math.sin(lambda)]);
}

export function TechOrbit({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const orbit = root.querySelector<HTMLElement>("[data-orbit]");
    if (!orbit) return;
    const chips = Array.from(orbit.querySelectorAll<HTMLElement>("[data-chip]"));
    const rows = Array.from(root.querySelectorAll<HTMLElement>("li[data-group]"));
    const groups = Array.from(orbit.querySelectorAll<SVGGElement>("[data-grid] g"));
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const count = chips.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const nodes: Node[] = chips.map((el, i) => {
      const y = 1 - ((i + 0.5) / count) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * golden;
      return {
        el,
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        group: el.dataset.group ?? "",
        back: false,
      };
    });

    const shapes = [parallel(0), parallel(40), parallel(-40), parallel(70), meridian(0), meridian(60), meridian(120), parallel(-70)];
    const rings: Ring[] = groups.map((g, i) => ({
      front: g.querySelector<SVGPathElement>("[data-front]")!,
      back: g.querySelector<SVGPathElement>("[data-back]")!,
      points: shapes[i % shapes.length],
    }));

    let radius = 200;
    let cx = 0;
    let cy = 0;
    const measure = () => {
      const size = orbit.clientWidth;
      radius = size * 0.36;
      cx = size / 2;
      cy = orbit.clientHeight / 2;
      orbit.style.setProperty("--r", `${radius}px`);
    };
    measure();

    const restPitch = -14;
    let yaw = 20;
    let pitch = restPitch;
    const cruise = calm ? 0 : 0.14;
    let velYaw = cruise;
    let velPitch = 0;
    let dragging = false;
    let hovering = false;
    let lastX = 0;
    let lastY = 0;
    let visible = true;
    let frame = 0;

    const project = (x: number, y: number, z: number, m: number[]) => {
      const x1 = x * m[0] + z * m[1];
      const z1 = -x * m[1] + z * m[0];
      const y2 = y * m[2] - z1 * m[3];
      const z2 = y * m[3] + z1 * m[2];
      const focal = 3.4;
      const s = focal / (focal - z2);
      return [x1 * radius * s, -y2 * radius * s, z2, s];
    };

    const render = () => {
      const ay = (yaw * Math.PI) / 180;
      const ax = (pitch * Math.PI) / 180;
      const m = [Math.cos(ay), Math.sin(ay), Math.cos(ax), Math.sin(ax)];

      for (const n of nodes) {
        const [px, py, z, s] = project(n.x, n.y, n.z, m);
        const depth = (z + 1) / 2;
        const back = z < -0.05;
        const scale = s * (back ? 0.78 : 0.94);
        n.el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        n.el.style.opacity = (back ? 0.12 + depth * 0.5 : 0.55 + depth * 0.45).toFixed(3);
        n.el.style.zIndex = String(back ? Math.round(depth * 40) : 60 + Math.round(depth * 40));
        if (back !== n.back) {
          n.back = back;
          if (back) n.el.setAttribute("data-back", "");
          else n.el.removeAttribute("data-back");
        }
      }

      for (const ring of rings) {
        let front = "";
        let back = "";
        let prev: boolean | null = null;
        for (const p of ring.points) {
          const [px, py, z] = project(p[0], p[1], p[2], m);
          const isFront = z >= 0;
          const cmd = `${(cx + px).toFixed(1)} ${(cy + py).toFixed(1)}`;
          if (isFront) front += (prev === true ? " L" : " M") + cmd;
          else back += (prev === false ? " L" : " M") + cmd;
          prev = isFront;
        }
        ring.front.setAttribute("d", front.trim());
        ring.back.setAttribute("d", back.trim());
      }
    };

    const tick = () => {
      if (!dragging) {
        const target = hovering ? 0 : cruise;
        velYaw += (target - velYaw) * (hovering ? 0.12 : 0.025);
        yaw += velYaw;
        pitch += velPitch;
        velPitch *= 0.93;
        pitch += (restPitch - pitch) * 0.012;
      }
      render();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(frame);
    });
    observer.observe(orbit);
    render();

    const onDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      orbit.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      velYaw = dx * 0.32;
      velPitch = -dy * 0.32;
      yaw += velYaw;
      pitch = Math.max(-75, Math.min(75, pitch + velPitch));
      if (!visible) render();
    };
    const onUp = (event: PointerEvent) => {
      dragging = false;
      try {
        orbit.releasePointerCapture(event.pointerId);
      } catch {}
    };

    const onOver = (event: PointerEvent) => {
      hovering = !!(event.target as HTMLElement | null)?.closest?.("[data-chip]");
    };
    const onOut = () => {
      hovering = false;
    };

    const focus = (group: string | null) => {
      if (group === null) orbit.removeAttribute("data-focus");
      else orbit.setAttribute("data-focus", "");
      for (const n of nodes) {
        if (group !== null && n.group === group) n.el.setAttribute("data-lit", "");
        else n.el.removeAttribute("data-lit");
      }
      for (const row of rows) {
        if (group !== null && row.dataset.group === group) row.setAttribute("data-active", "");
        else row.removeAttribute("data-active");
      }
    };

    const rowEnter = (event: Event) => focus((event.currentTarget as HTMLElement).dataset.group ?? null);
    const rowLeave = () => focus(null);
    rows.forEach((row) => {
      row.addEventListener("pointerenter", rowEnter);
      row.addEventListener("pointerleave", rowLeave);
    });

    const onResize = () => {
      measure();
      render();
    };

    orbit.addEventListener("pointerdown", onDown);
    orbit.addEventListener("pointermove", onMove);
    orbit.addEventListener("pointerup", onUp);
    orbit.addEventListener("pointercancel", onUp);
    orbit.addEventListener("pointerover", onOver);
    orbit.addEventListener("pointerleave", onOut);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      rows.forEach((row) => {
        row.removeEventListener("pointerenter", rowEnter);
        row.removeEventListener("pointerleave", rowLeave);
      });
      orbit.removeEventListener("pointerdown", onDown);
      orbit.removeEventListener("pointermove", onMove);
      orbit.removeEventListener("pointerup", onUp);
      orbit.removeEventListener("pointercancel", onUp);
      orbit.removeEventListener("pointerover", onOver);
      orbit.removeEventListener("pointerleave", onOut);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
