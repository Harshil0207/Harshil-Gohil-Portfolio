"use client";

import { Asterisk } from "@/components/icons";

/**
 * An item may carry `accent` so a single word in a band can take the spark
 * colour, the way it does in a static headline.
 */
export type MarqueeItem = string | { label: string; accent?: boolean };

/**
 * One continuous band of facts. The list is rendered twice so a -50% shift
 * loops seamlessly; the animation is CSS so it costs nothing on the main
 * thread and stops outright under reduced motion.
 */
export function Marquee({
  items,
  className,
  reverse = false,
  gap = "gap-8 pr-8",
  markClassName = "size-3 text-accent",
}: {
  items: MarqueeItem[];
  className?: string;
  /** Run right-to-left instead, so stacked bands read as counter-currents. */
  reverse?: boolean;
  /** Spacing between an item and its separator, tuned per band size. */
  gap?: string;
  markClassName?: string;
}) {
  const resolved = items.map((item) =>
    typeof item === "string" ? { label: item, accent: false } : item,
  );

  return (
    <div
      className={`relative flex overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      <div
        className={`marquee-track flex w-max shrink-0 ${reverse ? "marquee-reverse" : ""}`}
      >
        {[0, 1].map((pass) => (
          <ul key={pass} className="flex shrink-0 items-center">
            {resolved.map((item) => (
              <li
                key={item.label}
                className={`flex shrink-0 items-center ${gap}`}
              >
                <span className={item.accent ? "text-spark" : undefined}>
                  {item.label}
                </span>
                <Asterisk className={markClassName} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
