"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const DogCursor = dynamic(() => import("./dog-cursor"), { ssr: false });

const QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (min-width: 768px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function PuppyMount() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  return enabled ? <DogCursor /> : null;
}
