export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "hg-theme";
export const DEFAULT_THEME: Theme = "light";

/** The palette swaps which four values fill the four grounds. */
export type PaletteId =
  | "brand"
  | "electric"
  | "ultramarine"
  | "signal"
  | "concrete"
  | "slate"
  | "oxblood"
  | "forest"
  | "sand"
  | "violet"
  | "petrol"
  | "chalk"
  | "magenta"
  | "wispr"
  | "flow"
  | "grove";

/**
 * The palette ships fixed. It is applied from DEFAULT_PALETTE on every load and
 * is deliberately not read from storage: the preview switcher that once wrote
 * that key is gone, and a stale value would quietly serve a retired palette.
 */
export const DEFAULT_PALETTE: PaletteId = "brand";

export const palettes: {
  id: PaletteId;
  name: string;
  note: string;
  swatch: [string, string, string];
}[] = [
  {
    id: "brand",
    name: "Brand",
    note: "The shipped palette: butter ground, blue as the action.",
    swatch: ["#ffffeb", "#3cb7ea", "#1a1a1a"],
  },
  {
    id: "electric",
    name: "Electric",
    note: "Electric blue field, acid action. The loudest of the set.",
    swatch: ["#1f44ff", "#e4fb63", "#08080a"],
  },
  {
    id: "ultramarine",
    name: "Ultramarine",
    note: "Deep ultramarine with bone. Same architecture, half the vibration.",
    swatch: ["#16269e", "#f0e6d2", "#08080a"],
  },
  {
    id: "signal",
    name: "Signal",
    note: "Near-black field, signal orange action. The most sober.",
    swatch: ["#0d0d10", "#ff5a1f", "#ffffff"],
  },
  {
    id: "concrete",
    name: "Concrete",
    note: "Concrete field with cobalt as the action — blue becomes an event again.",
    swatch: ["#d7d7d3", "#1f44ff", "#08080a"],
  },
  {
    id: "slate",
    name: "Slate",
    note: "Slate and chartreuse. Cooler and quieter, still energetic.",
    swatch: ["#1d2a33", "#c7f464", "#ffffff"],
  },
  {
    id: "oxblood",
    name: "Oxblood",
    note: "Oxblood and amber. Heavier and older money than the blues.",
    swatch: ["#6b1220", "#f2c14e", "#ffffff"],
  },
  {
    id: "forest",
    name: "Forest",
    note: "Deep forest with bone. The quietest dark field in the set.",
    swatch: ["#0f3323", "#e8dcc0", "#ffffff"],
  },
  {
    id: "sand",
    name: "Sand",
    note: "Warm sand with burnt orange — a light field that is not white.",
    swatch: ["#e8dfce", "#c2410c", "#08080a"],
  },
  {
    id: "violet",
    name: "Violet",
    note: "Violet and citrus. The most editorial of the saturated fields.",
    swatch: ["#3b1e8f", "#fde047", "#ffffff"],
  },
  {
    id: "petrol",
    name: "Petrol",
    note: "Petrol and coral. Industrial, marine, with a warm action.",
    swatch: ["#0b3b45", "#ff8a3d", "#ffffff"],
  },
  {
    id: "chalk",
    name: "Chalk",
    note: "No colour at all: ink field, white as the action.",
    swatch: ["#111214", "#ffffff", "#8a8a92"],
  },
  {
    id: "wispr",
    name: "Wispr",
    note: "Butter field, ink type, deep green action — wisprflow grounds, Grove's green.",
    swatch: ["#ffffeb", "#3d5a2f", "#1a1a1a"],
  },
  {
    id: "flow",
    name: "Flow",
    note: "The wisprflow set wholesale: sky ground, butter paper, amber action, rust hover.",
    swatch: ["#86afe6", "#ef973e", "#801b0c"],
  },
  {
    id: "grove",
    name: "Grove",
    note: "The same set read dark: deep green field, amber action, butter type.",
    swatch: ["#3d5a2f", "#ef973e", "#ffffeb"],
  },
  {
    id: "magenta",
    name: "Magenta",
    note: "Cobalt and magenta. Louder than electric — use with nerve.",
    swatch: ["#1b2cc1", "#ff3d8b", "#08080a"],
  },
];

/**
 * Runs before first paint so a stored theme or palette never flashes. Kept as a
 * string because it is injected with dangerouslySetInnerHTML in the root layout.
 */
export const themeScript = `(function(){try{var r=document.documentElement;var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t="${DEFAULT_THEME}"}r.dataset.theme=t;r.style.colorScheme=t;r.dataset.palette="${DEFAULT_PALETTE}"}catch(e){document.documentElement.dataset.theme="${DEFAULT_THEME}";document.documentElement.dataset.palette="${DEFAULT_PALETTE}"}})()`;
