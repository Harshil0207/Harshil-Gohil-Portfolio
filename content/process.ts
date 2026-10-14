export type ProcessStep = {
  index: string;
  title: string;
  body: string;
};

export const process: ProcessStep[] = [
  {
    index: "01",
    title: "Scope",
    body: "I pin down the data model and the critical path before any UI, because those two decide everything after.",
  },
  {
    index: "02",
    title: "Architect",
    body: "One written decision per hard choice — database, queue, provider — so the reasoning outlives the commit.",
  },
  {
    index: "03",
    title: "Build",
    body: "Vertical slices, deployed early. Auth and the money path land first, not last.",
  },
  {
    index: "04",
    title: "Ship & iterate",
    body: "Launch is the midpoint. Real use shows what to fix next, and I stay on it.",
  },
];
