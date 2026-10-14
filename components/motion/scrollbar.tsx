"use client";

import { useEffect, useRef } from "react";
import { scrollToPosition } from "@/lib/smooth-scroll";

/** Below this the thumb stops being a handle and becomes a dot. */
const MIN_THUMB = 40;
/** How hard the bar stretches with speed, and how far it is allowed to go. */
const STRETCH = 0.32;
const STRETCH_CAP = 0.7;
/** Velocity below this counts as stopped, in pixels per millisecond. */
const STILL = 0.004;

/**
 * The page's scrollbar, drawn and alive.
 *
 * The native bar is hidden in `globals.css` and this replaces it, so it stays a
 * scrollbar rather than becoming an ornament: the thumb is sized to the
 * proportion of the document in view, it drags, and the rail can be clicked to
 * jump.
 *
 * What makes it read as part of this site rather than a widget is that it
 * responds to how the page is moving. The thumb stretches with scroll velocity
 * and trails behind the direction of travel — origin at the leading edge, so
 * the tail is what elongates — then settles back as the page comes to rest.
 * While it is moving it wakes up: wider, in the action colour, lit. A second of
 * stillness and it thins back down to a hairline.
 *
 * Every write goes straight to the DOM. This runs on each animation frame, and
 * re-rendering to move one transform would be the most expensive thing on the
 * page.
 */
export function Scrollbar() {
  const rail = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const railEl = rail.current;
    const thumbEl = thumb.current;
    if (!railEl || !thumbEl) return;

    // Touch platforms overlay their own transient bar and have nothing
    // persistent to replace.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    let railHeight = 0;
    let thumbHeight = 0;
    let reach = 0;

    let frame = 0;
    let velocity = 0;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let idle: ReturnType<typeof setTimeout> | undefined;

    const measure = () => {
      const viewport = window.innerHeight;
      const page = document.documentElement.scrollHeight;
      railHeight = railEl.clientHeight;
      reach = page - viewport;

      // A page that fits has nothing to scroll, so it gets no bar.
      if (reach <= 1 || railHeight <= 0) {
        railEl.dataset.enabled = "false";
        return;
      }

      railEl.dataset.enabled = "true";
      thumbHeight = Math.max(MIN_THUMB, (viewport / page) * railHeight);
      thumbEl.style.height = `${thumbHeight}px`;
      render();
    };

    const render = () => {
      if (reach <= 0) return;
      const progress = Math.min(Math.max(window.scrollY / reach, 0), 1);
      const offset = progress * (railHeight - thumbHeight);
      const stretch =
        1 + Math.min(Math.abs(velocity) * STRETCH, STRETCH_CAP);

      // Origin at the leading edge, so the tail is what elongates.
      thumbEl.style.transformOrigin = velocity > 0 ? "bottom" : "top";
      thumbEl.style.transform = `translateY(${offset}px) scaleY(${stretch})`;
    };

    /** Runs only while the page is moving, then lets the stretch settle out. */
    const tick = () => {
      frame = 0;
      const now = performance.now();
      const elapsed = Math.max(now - lastTime, 1);
      const travelled = window.scrollY - lastY;

      lastTime = now;
      lastY = window.scrollY;

      // Smoothed, so a single jumpy frame does not snap the bar to full stretch.
      velocity += (travelled / elapsed - velocity) * 0.2;
      render();

      if (Math.abs(velocity) > STILL) frame = requestAnimationFrame(tick);
      else velocity = 0;
    };

    const onScroll = () => {
      railEl.dataset.moving = "true";
      clearTimeout(idle);
      idle = setTimeout(() => {
        railEl.dataset.moving = "false";
      }, 900);

      if (reduced) {
        render();
        return;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    let dragging = false;
    let originY = 0;
    let originScroll = 0;

    const onThumbDown = (event: PointerEvent) => {
      dragging = true;
      originY = event.clientY;
      originScroll = window.scrollY;
      thumbEl.setPointerCapture(event.pointerId);
      railEl.dataset.dragging = "true";
      event.preventDefault();
      event.stopPropagation();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const travel = railHeight - thumbHeight;
      if (travel <= 0) return;
      // A pixel of thumb travel is worth `reach / travel` pixels of document.
      const moved = ((event.clientY - originY) / travel) * reach;
      scrollToPosition(originScroll + moved, true);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      thumbEl.releasePointerCapture(event.pointerId);
      railEl.dataset.dragging = "false";
    };

    // Clicking the rail centres the thumb on the click.
    const onRailDown = (event: PointerEvent) => {
      if (event.target === thumbEl) return;
      const travel = railHeight - thumbHeight;
      if (travel <= 0) return;
      const box = railEl.getBoundingClientRect();
      const target = (event.clientY - box.top - thumbHeight / 2) / travel;
      scrollToPosition(Math.min(Math.max(target, 0), 1) * reach);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    thumbEl.addEventListener("pointerdown", onThumbDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    railEl.addEventListener("pointerdown", onRailDown);

    // The page keeps growing after first paint — fonts settle, images decode,
    // reveals run — and a thumb sized before that is the wrong size.
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(idle);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      thumbEl.removeEventListener("pointerdown", onThumbDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      railEl.removeEventListener("pointerdown", onRailDown);
    };
  }, []);

  return (
    // Hidden from assistive tech: keyboard and screen-reader scrolling never
    // needed the bar, and announcing a second one would only be noise.
    <div ref={rail} className="rail" data-enabled="false" aria-hidden>
      <div ref={thumb} className="rail-thumb" />
    </div>
  );
}
