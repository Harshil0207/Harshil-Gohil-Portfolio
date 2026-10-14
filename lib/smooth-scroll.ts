"use client";

import type Lenis from "lenis";

/**
 * The one Lenis instance, held at module scope.
 *
 * Anything that wants to move the page has to go through Lenis rather than
 * `window.scrollTo`: Lenis owns the scroll position, so a native jump is
 * animated straight back to where it was. A module-level handle is enough —
 * there is only ever one instance, and putting it in context would re-render
 * the whole tree to share a value nothing renders from.
 */
let instance: Lenis | null = null;
let locked = false;

export function registerSmoothScroll(lenis: Lenis | null) {
  instance = lenis;
  if (lenis && locked) lenis.stop();
}

export function setSmoothScrollLocked(value: boolean) {
  locked = value;
  if (value) instance?.stop();
  else instance?.start();
}

/**
 * Moves the page to an absolute offset.
 *
 * `immediate` skips the easing, which is what a scrollbar drag needs: the bar
 * must sit under the pointer on the frame it is dragged to, not ease toward it
 * a fifth of a second later.
 */
export function scrollToPosition(top: number, immediate = false) {
  if (instance) {
    instance.scrollTo(top, immediate ? { immediate: true } : { duration: 0.7 });
    return;
  }

  window.scrollTo({ top, behavior: "auto" });
}

/**
 * Returns the page to the top. Falls back to a native jump when Lenis is not
 * running — which is the reduced-motion case, where an instant move is the
 * correct behaviour anyway.
 */
export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.1 });
    return;
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}
