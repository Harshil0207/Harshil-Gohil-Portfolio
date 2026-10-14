"use client";

import { useRef } from "react";
import { EASE, gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";

/**
 * Pulls its child toward the pointer. Purely decorative: the wrapped element
 * keeps its own hit area, so keyboard and touch users lose nothing.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const scope = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const element = scope.current;
      if (!element || reducedMotion) return;

      const move = gsap.quickTo(element, "x", { duration: 0.5, ease: EASE.soft });
      const lift = gsap.quickTo(element, "y", { duration: 0.5, ease: EASE.soft });

      const onMove = (event: PointerEvent) => {
        const box = element.getBoundingClientRect();
        move((event.clientX - (box.left + box.width / 2)) * strength);
        lift((event.clientY - (box.top + box.height / 2)) * strength);
      };

      const onLeave = () => {
        move(0);
        lift(0);
      };

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
      return () => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope, dependencies: [reducedMotion, strength] },
  );

  return (
    <span ref={scope} className={className}>
      {children}
    </span>
  );
}
