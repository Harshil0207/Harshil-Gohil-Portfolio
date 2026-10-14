"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { EASE, gsap, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(SplitText);

type SplitHeadlineProps = {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  /** Play on mount instead of waiting for the element to scroll into view. */
  immediate?: boolean;
  delay?: number;
};

/**
 * Line-by-line mask reveal. The text is split at runtime, so the server HTML
 * stays a plain heading and remains readable to crawlers and screen readers.
 */
export function SplitHeadline({
  children,
  className,
  as: Tag = "h2",
  immediate = false,
  delay = 0,
}: SplitHeadlineProps) {
  const scope = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element) return;

      gsap.set(element, { opacity: 1 });

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const split = new SplitText(element, {
          type: "lines",
          mask: "lines",
          linesClass: "overflow-hidden",
        });

        gsap.from(split.lines, {
          yPercent: 115,
          duration: 1.2,
          delay,
          ease: EASE.out,
          stagger: 0.09,
          scrollTrigger: immediate
            ? undefined
            : { trigger: element, start: "top 88%", once: true },
        });

        return () => split.revert();
      });

      return () => media.revert();
    },
    { scope, dependencies: [immediate, delay] },
  );

  return (
    <Tag ref={scope} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
