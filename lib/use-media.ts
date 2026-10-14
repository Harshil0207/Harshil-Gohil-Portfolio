"use client";

import { useCallback, useSyncExternalStore } from "react";

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // The server has no viewport; every query resolves false until hydration.
    () => false,
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * WebGL is desktop-only: coarse pointers are phones and tablets, where the
 * shader cost buys nothing and the static image reads the same.
 */
export function useSupportsWebglSurfaces() {
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  return fine && !reduced;
}

export function useIsTabletUp() {
  return useMediaQuery("(min-width: 768px)");
}
