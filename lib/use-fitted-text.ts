"use client";

import { useEffect, useRef } from "react";

/**
 * Sizes an element so one unwrapped line exactly fills its parent's content box.
 *
 * A line of display type has a geometric ceiling — a fixed number of Anton
 * characters across a given measure — so measuring is what makes it as large as
 * it can possibly be, where a clamp only ever guesses under that ceiling. It
 * also self-corrects: if the face falls back to something wider, the solved size
 * simply comes out smaller and the line still fills the measure exactly.
 *
 * The element must be `width: max-content` and `white-space: nowrap`, or
 * `scrollWidth` measures the wrapped box rather than the line.
 */
export function useFittedText<T extends HTMLElement>(fill = 1) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const fit = () => {
      const parent = element.parentElement;
      if (!parent) return;

      // clientWidth includes the parent's padding, so solving against it
      // overflows the content box.
      const styles = getComputedStyle(parent);
      const available =
        parent.clientWidth -
        parseFloat(styles.paddingLeft) -
        parseFloat(styles.paddingRight);

      const target = available * fill;
      if (target <= 0) return;

      const reference = 100;
      element.style.fontSize = `${reference}px`;
      const natural = element.scrollWidth;
      if (!natural) return;

      element.style.fontSize = `${(reference * target) / natural}px`;
    };

    fit();
    // The first pass runs on the fallback face; this one runs on Anton.
    document.fonts?.ready.then(fit).catch(() => {});
    window.addEventListener("resize", fit);

    return () => window.removeEventListener("resize", fit);
  }, [fill]);

  return ref;
}
