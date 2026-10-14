"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";

/**
 * The three pillars on a single line, solved to fill their container exactly.
 *
 * One line of this phrase is geometrically bounded — around 30 characters of
 * Anton across the viewport — so the measurement is what makes it as large as it
 * can possibly be rather than a clamp guessing under the ceiling.
 */
export function FittedLine() {
  const scope = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const fit = () => {
        const parent = root.parentElement;
        if (!parent) return;

        // clientWidth includes the parent's padding, so solving against it
        // overflows the content box. Measure the box the line actually gets, and
        // hold back a little so the last glyph never kisses the frame.
        const styles = getComputedStyle(parent);
        const available =
          parent.clientWidth -
          parseFloat(styles.paddingLeft) -
          parseFloat(styles.paddingRight);
        const target = available * 0.97;
        if (target <= 0) return;

        const reference = 100;
        root.style.fontSize = `${reference}px`;
        const natural = root.scrollWidth;
        if (!natural) return;
        root.style.fontSize = `${(reference * target) / natural}px`;
      };

      fit();
      document.fonts?.ready.then(fit).catch(() => {});
      window.addEventListener("resize", fit);

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const letters = Array.from(root.children) as HTMLElement[];
        gsap.set(letters, { transformOrigin: "50% 100%" });

        const intro = gsap.timeline({ paused: true });
        intro
          .fromTo(
            letters,
            { yPercent: 70, clipPath: "inset(100% -10% 0% -10%)", scaleY: 1.35 },
            {
              yPercent: 0,
              clipPath: "inset(-10% -10% -10% -10%)",
              scaleY: 1,
              duration: 1.1,
              ease: "expo.out",
              stagger: { each: 0.075, from: "center" },
            },
          )
          .to(
            letters,
            {
              keyframes: [
                { scaleY: 1.12, duration: 0.18, ease: "power2.out" },
                { scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.35)" },
              ],
              stagger: 0.06,
            },
            "-=0.35",
          );

        const stretch = letters.map((letter) =>
          gsap.quickTo(letter, "scaleY", { duration: 0.55, ease: "power3.out" }),
        );
        const lean = letters.map((letter) =>
          gsap.quickTo(letter, "skewX", { duration: 0.6, ease: "power3.out" }),
        );

        const stopWaiting = onIntroDone(() => intro.play());

        let ready = false;
        intro.eventCallback("onComplete", () => {
          gsap.set(letters, { clipPath: "none" });
          ready = true;
        });

        const onMove = (event: PointerEvent) => {
          if (!ready || event.pointerType === "touch") return;
          const bounds = root.getBoundingClientRect();
          const reach = bounds.height * 0.9;
          const vertical =
            event.clientY < bounds.top - reach || event.clientY > bounds.bottom + reach ? 0 : 1;
          letters.forEach((letter, index) => {
            const box = letter.getBoundingClientRect();
            const offset = (event.clientX - (box.left + box.width / 2)) / (box.width * 1.4);
            const pull = Math.exp(-offset * offset) * vertical;
            stretch[index](1 + pull * 0.1);
            lean[index](Math.sign(offset) * pull * -3);
          });
        };

        const settle = () => {
          if (!ready) return;
          stretch.forEach((to) => to(1));
          lean.forEach((to) => to(0));
        };

        const drift = gsap.to(letters, {
          y: (index: number) => (index % 2 === 0 ? -1 : 1) * (40 + index * 6),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerleave", settle);
        return () => {
          window.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerleave", settle);
          stopWaiting();
          intro.kill();
          drift.scrollTrigger?.kill();
          drift.kill();
        };
      });

      return () => {
        window.removeEventListener("resize", fit);
        media.revert();
      };
    },
    { scope },
  );

  return (
    <h1
      ref={scope}
      aria-label="Harshil"
      data-cursor-grow
      // w-max plus the fit's holdback leaves a little slack; mx-auto splits it
      // evenly instead of stacking it all on the right.
      className="mx-auto flex w-max items-center gap-[0.015em] whitespace-nowrap font-display text-[calc((100vw-2rem)*0.222)] uppercase leading-[0.9] tracking-[-0.005em] md:text-[calc((100vw-3rem)*0.222)]"
    >
      {"Harshil".split("").map((letter, index) => (
        <span key={index} aria-hidden className="inline-block will-change-transform">
          {letter}
        </span>
      ))}
    </h1>
  );
}
