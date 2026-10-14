"use client";

export const INTRO_EVENT = "portfolio:intro-done";

export function isIntroDone() {
  return typeof document !== "undefined" && document.documentElement.dataset.intro === "done";
}

export function finishIntro() {
  if (isIntroDone()) return;
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event(INTRO_EVENT));
}

export function onIntroDone(callback: () => void) {
  if (isIntroDone()) {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(INTRO_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, handler);
}
