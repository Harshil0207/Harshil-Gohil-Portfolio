"use client";

import { useRef } from "react";
import { EASE, gsap, useGSAP } from "@/lib/gsap";
import { useFittedText } from "@/lib/use-fitted-text";

/**
 * Two registers, not two matching lines.
 *
 * Set at the same size and stacked tight, the solid line and the outlined one
 * collided and read as one muddled block. So the claim is a crescendo instead: a
 * lead-in at roughly a third scale, then the second half solved to fill the
 * whole measure edge to edge, drawn rather than filled. Sizing the second line
 * by measurement rather than by clamp is the same move the opening headline
 * makes, which is what ties the two mastheads together.
 */
export function WorkHeadline({ className }: { className?: string }) {
  const scope = useRef<HTMLHeadingElement>(null);
  const fitted = useFittedText<HTMLSpanElement>(0.995);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          root.querySelectorAll("[data-void]"),
          { yPercent: 118, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: EASE.out,
            stagger: 0.12,
            scrollTrigger: { trigger: root, start: "top 88%", once: true },
          },
        );
        return () => tween.kill();
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <h2 ref={scope} className={className}>
      <span className="block overflow-hidden">
        <span data-void className="work-lead block pb-[0.06em]">
          The work,
        </span>
      </span>

      <span className="mt-2 block overflow-hidden md:mt-4">
        <span
          ref={fitted}
          data-void
          className="work-outline block w-max whitespace-nowrap pb-[0.05em] font-display uppercase leading-[0.95]"
        >
          system by system
        </span>
      </span>
    </h2>
  );
}
