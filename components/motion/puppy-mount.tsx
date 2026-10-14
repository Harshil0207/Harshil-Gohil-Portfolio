"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";

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
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!enabled || armed) return;
    const arm = () => setArmed(true);
    window.addEventListener("pointermove", arm, { once: true, passive: true });
    return () => window.removeEventListener("pointermove", arm);
  }, [enabled, armed]);

  return enabled && armed ? <DogCursor /> : null;
}
