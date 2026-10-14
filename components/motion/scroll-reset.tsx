"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { scrollToPosition } from "@/lib/smooth-scroll";

/**
 * Opens every route at the top.
 *
 * Next already scrolls the window on navigation, but Lenis owns the scroll
 * position: it takes the next frame and animates back to where it was, so a
 * case study opened from halfway down the index opens halfway down itself.
 * Told directly, it lands where it should.
 *
 * The exception is an anchor. The header links to `/#work` and friends, so a
 * hash is an instruction about where to land and outranks the reset — otherwise
 * fixing this would break the nav.
 */

/** `#` alone, or a hash that is not a valid selector, must not throw. */
function targetFor(hash: string) {
  if (!hash || hash === "#") return null;
  try {
    return document.querySelector(hash);
  } catch {
    return null;
  }
}

function offsetOf(target: Element) {
  return target.getBoundingClientRect().top + window.scrollY;
}

export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // With no hash there is nothing to measure, so land immediately — waiting a
    // frame on a reload shows the old offset before it is corrected.
    if (!targetFor(window.location.hash)) scrollToPosition(0, true);

    // Two frames for an anchor: the incoming route has to be laid out before it
    // can be measured, and Lenis has to have spent the frame it would otherwise
    // use animating back to the old position.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const target = targetFor(window.location.hash);
        scrollToPosition(target ? offsetOf(target) : 0, true);
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  // Same-page anchors go through Lenis too, or the native jump is animated
  // back the same way.
  useEffect(() => {
    const onHashChange = () => {
      const target = targetFor(window.location.hash);
      if (target) scrollToPosition(offsetOf(target));
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
