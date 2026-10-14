"use client";

import { useRef } from "react";
import { SplitHeadline } from "@/components/motion/split-headline";
import { copy } from "@/content/company";
import { process } from "@/content/process";
import { gsap, useGSAP } from "@/lib/gsap";

export function Process() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rule = scope.current?.querySelector("[data-rule]");
      const list = scope.current?.querySelector("[data-steps]");
      if (!rule || !list) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // The line draws down the stages as you read them: the order is the
        // argument, so the motion follows the order.
        gsap.fromTo(
          rule,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: list,
              start: "top 72%",
              end: "bottom 78%",
              scrub: 0.5,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <section id="process" ref={scope} className="block-ink">
      <div className="shell py-16 md:py-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SplitHeadline className="big max-w-[18ch]">
            {copy.processTitle}
          </SplitHeadline>
          <p className="lede max-w-[36ch] text-white/72">{copy.processBody}</p>
        </div>

        <div className="relative mt-16 md:mt-20">
          <span
            aria-hidden
            data-rule
            className="absolute left-0 top-2 hidden h-[calc(100%-1rem)] w-px bg-acid-lift md:block"
          />
          <ol data-steps className="grid gap-10 md:pl-14">
            {process.map((step) => (
              <li
                key={step.index}
                className="grid gap-4 border-b border-white/15 pb-9 last:border-0 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:gap-12"
              >
                <h3 className="mid flex items-baseline gap-4">
                  <span className="data text-acid-lift" data-figures>
                    {step.index}
                  </span>
                  {step.title}
                </h3>
                <p className="text-white/72 md:text-lg md:leading-relaxed">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
