"use client";

import { useSyncExternalStore } from "react";

export type ThemeColors = {
  canvas: string;
  ink: string;
  accent: string;
};

const FALLBACK: ThemeColors = {
  canvas: "#0a0a0a",
  ink: "#fafaf9",
  accent: "#2f5bea",
};

// Cached per theme so getSnapshot returns a stable object between renders.
let cache: { theme: string; colors: ThemeColors } | null = null;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): ThemeColors {
  const root = document.documentElement;
  const theme = root.dataset.theme ?? "dark";
  if (cache?.theme === theme) return cache.colors;

  const styles = getComputedStyle(root);
  const colors: ThemeColors = {
    canvas: styles.getPropertyValue("--canvas").trim() || FALLBACK.canvas,
    ink: styles.getPropertyValue("--ink").trim() || FALLBACK.ink,
    accent: styles.getPropertyValue("--accent").trim() || FALLBACK.accent,
  };
  cache = { theme, colors };
  return colors;
}

/**
 * Resolves the active theme tokens so shaders can be tinted with the same
 * values the DOM uses, and re-resolves them when the theme is toggled.
 */
export function useThemeColors(): ThemeColors {
  return useSyncExternalStore(subscribe, getSnapshot, () => FALLBACK);
}
