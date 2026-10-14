"use client";

import { useRef } from "react";
import { EASE, gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds of delay before this element starts. */
  delay?: number;
  /** Stagger direct children instead of animating the wrapper itself. */
  stagger?: number;
  /** Travel distance in pixels. */
  distance?: number;
  as?: "div" | "section" | "ul" | "ol" | "p" | "header" | "footer" | "dl";
};

export function Reveal({
  children,
  className,
  delay = 0,
  stagger,
  distance = 24,
  as = "div",
}: RevealProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element) return;

      const targets = stagger ? Array.from(element.children) : element;

      // Nothing is tweened for readers who asked for reduced motion — the
      // markup already renders in its final state.
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: distance },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay,
            ease: EASE.out,
            stagger: stagger ?? 0,
            scrollTrigger: { trigger: element, start: "top 85%", once: true },
          },
        );
      });

      return () => media.revert();
    },
    { scope },
  );

  const Tag = as;
  const revealAttrs = stagger
    ? { "data-reveal-mask": "" }
    : { "data-reveal": "" };

  return (
    <Tag ref={scope as React.Ref<never>} className={className} {...revealAttrs}>
      {children}
    </Tag>
  );
}
