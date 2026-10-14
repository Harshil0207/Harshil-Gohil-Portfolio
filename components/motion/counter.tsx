"use client";

import { useRef } from "react";
import { EASE, gsap, useGSAP } from "@/lib/gsap";

/** Splits "50,000+" into "", 50000, "+" so only the number animates. */
function parse(value: string) {
  const match = value.match(/^(\D*)([\d,.]+)([\s\S]*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const numeric = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return null;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  const grouped = digits.includes(",");
  return { prefix, numeric, suffix, decimals, grouped };
}

function format(value: number, decimals: number, grouped: boolean) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
}

/**
 * Counts a figure up on enter. Non-numeric outcomes ("Per session", "Slack")
 * pass straight through — they are rendered as-is and never animate.
 */
export function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const scope = useRef<HTMLSpanElement>(null);
  const parsed = parse(value);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element || !parsed) return;
      const target = element.querySelector("[data-count]");
      if (!target) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { value: 0 };
        gsap.to(state, {
          value: parsed.numeric,
          duration: 1.6,
          ease: EASE.soft,
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
          onUpdate: () => {
            target.textContent = format(
              state.value,
              parsed.decimals,
              parsed.grouped,
            );
          },
        });
      });

      return () => media.revert();
    },
    { scope },
  );

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={scope} className={className}>
      {parsed.prefix}
      <span data-count="">
        {format(parsed.numeric, parsed.decimals, parsed.grouped)}
      </span>
      {parsed.suffix}
    </span>
  );
}
