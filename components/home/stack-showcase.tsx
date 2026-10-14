"use client";

import { useIsTabletUp } from "@/lib/use-media";
import { StackBand } from "./stack-band";
import { StackKeyboard } from "./stack-keyboard";

export function StackShowcase() {
  const wide = useIsTabletUp();
  return wide ? <StackKeyboard /> : <StackBand />;
}
