"use client";

import { ArrowUp } from "@/components/icons";
import { scrollToTop } from "@/lib/smooth-scroll";

/**
 * Back to top, sitting in the footer rather than floating over the page.
 *
 * It is a labelled control, not a lone glyph: there is room for words at the
 * end of the page, and "Back to top" is unambiguous where an arrow in a circle
 * has to be guessed at. The label is the accessible name, so no aria-label is
 * needed and none is added.
 *
 * The arrow is doubled on purpose — the pair runs a conveyor on hover, the one
 * you are looking at leaving upward while its replacement arrives from below.
 * That is the movement the button performs, so it is the movement it shows.
 */
export function ScrollTop() {
  return (
    <button type="button" onClick={scrollToTop} data-cursor="top" className="to-top">
      Back to top
      <span className="to-top-glyph" aria-hidden>
        <ArrowUp />
        <ArrowUp />
      </span>
    </button>
  );
}
