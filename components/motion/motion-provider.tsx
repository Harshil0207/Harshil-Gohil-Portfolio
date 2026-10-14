"use client";

import { useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerSmoothScroll } from "@/lib/smooth-scroll";
import { usePrefersReducedMotion } from "@/lib/use-media";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Owns the two global motion concerns: the `js-motion` flag that lets CSS
 * pre-hide reveal targets, and the Lenis instance that drives ScrollTrigger.
 *
 * The flag is set in a layout effect rather than an inline script so that a
 * failed or blocked bundle leaves every section visible.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const root = document.documentElement;
    root.classList.add("js-motion");
    return () => root.classList.remove("js-motion");
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);
    // Published so anything that moves the page goes through Lenis rather than
    // fighting it with a native scroll.
    registerSmoothScroll(lenis);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      registerSmoothScroll(null);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return children;
}
