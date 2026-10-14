"use client";

import Link from "next/link";
import { type CSSProperties, type PointerEvent as ReactPointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { capabilities } from "@/content/capabilities";
import { projects } from "@/content/projects";
import { techIcons } from "@/content/tech-icons";

type Tool = {
  name: string;
  group: string;
  builds: { slug: string; name: string }[];
};

type KeyDef = {
  code: string;
  legend: string;
  row: number;
  start: number;
  width: number;
  tool: Tool | null;
};

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const TOOLS: Tool[] = capabilities.flatMap((group) =>
  group.items.map((name) => ({
    name,
    group: group.title,
    builds: projects
      .filter((project) => project.stack.some((item) => normalise(item) === normalise(name)))
      .map((project) => ({ slug: project.slug, name: project.name })),
  })),
);

type Row = [string, string, number][];

const ROWS: Row[] = [
  [
    ["Backquote", "`", 1], ["Digit1", "1", 1], ["Digit2", "2", 1], ["Digit3", "3", 1], ["Digit4", "4", 1],
    ["Digit5", "5", 1], ["Digit6", "6", 1], ["Digit7", "7", 1], ["Digit8", "8", 1], ["Digit9", "9", 1],
    ["Digit0", "0", 1], ["Minus", "-", 1], ["Equal", "=", 1], ["Backspace", "delete", 2],
  ],
  [
    ["Tab", "tab", 1.5], ["KeyQ", "Q", 1], ["KeyW", "W", 1], ["KeyE", "E", 1], ["KeyR", "R", 1],
    ["KeyT", "T", 1], ["KeyY", "Y", 1], ["KeyU", "U", 1], ["KeyI", "I", 1], ["KeyO", "O", 1],
    ["KeyP", "P", 1], ["BracketLeft", "[", 1], ["BracketRight", "]", 1], ["Backslash", "\\", 1.5],
  ],
  [
    ["CapsLock", "caps", 1.75], ["KeyA", "A", 1], ["KeyS", "S", 1], ["KeyD", "D", 1], ["KeyF", "F", 1],
    ["KeyG", "G", 1], ["KeyH", "H", 1], ["KeyJ", "J", 1], ["KeyK", "K", 1], ["KeyL", "L", 1],
    ["Semicolon", ";", 1], ["Quote", "'", 1], ["Enter", "return", 2.25],
  ],
  [
    ["ShiftLeft", "shift", 2.25], ["KeyZ", "Z", 1], ["KeyX", "X", 1], ["KeyC", "C", 1], ["KeyV", "V", 1],
    ["KeyB", "B", 1], ["KeyN", "N", 1], ["KeyM", "M", 1], ["Comma", ",", 1], ["Period", ".", 1],
    ["Slash", "/", 1], ["ShiftRight", "shift", 2.75],
  ],
  [
    ["ControlLeft", "ctrl", 1.25], ["MetaLeft", "cmd", 1.25], ["AltLeft", "alt", 1.25], ["Space", "space", 6.25],
    ["AltRight", "alt", 1.25], ["MetaRight", "cmd", 1.25], ["ContextMenu", "menu", 1.25], ["ControlRight", "ctrl", 1.25],
  ],
];

function buildKeys(): KeyDef[] {
  const keys: KeyDef[] = [];
  let toolIndex = 0;
  ROWS.forEach((row, rowIndex) => {
    let cursor = 0;
    row.forEach(([code, legend, width]) => {
      const single = width === 1 && rowIndex < 4;
      const tool = single && toolIndex < TOOLS.length ? TOOLS[toolIndex++] : null;
      keys.push({ code, legend, row: rowIndex, start: cursor, width, tool });
      cursor += width;
    });
  });
  return keys;
}

function mixWhite(hex: string, amount: number) {
  const value = parseInt(hex.replace("#", ""), 16);
  const channel = (shift: number) => {
    const c = (value >> shift) & 255;
    return Math.round(c + (255 - c) * amount);
  };
  return `#${[16, 8, 0].map((shift) => channel(shift).toString(16).padStart(2, "0")).join("")}`;
}

function brandInk(name: string) {
  const icon = techIcons[name];
  if (!icon) return "#f4f2ef";
  const value = parseInt(icon.hex.replace("#", ""), 16);
  const lum = (0.2126 * ((value >> 16) & 255) + 0.7152 * ((value >> 8) & 255) + 0.0722 * (value & 255)) / 255;
  return lum < 0.3 ? "#f4f2ef" : mixWhite(icon.hex, 0.2);
}

const KEYS = buildKeys();
const SPACE = KEYS.find((key) => key.code === "Space");

function Keycap({
  def,
  selected,
  wave,
  onPress,
  onHover,
}: {
  def: KeyDef;
  selected: boolean;
  wave: number;
  onPress: (def: KeyDef) => void;
  onHover: (def: KeyDef | null) => void;
}) {
  const icon = def.tool ? techIcons[def.tool.name] : undefined;
  const distance = SPACE
    ? Math.hypot(def.start + def.width / 2 - (SPACE.start + SPACE.width / 2), (def.row - SPACE.row) * 1.2)
    : 0;
  const style = {
    gridColumn: `${Math.round(def.start * 4) + 1} / span ${Math.round(def.width * 4)}`,
    gridRow: def.row + 1,
    ["--brand" as string]: def.tool ? brandInk(def.tool.name) : "var(--acid)",
    ["--wave-delay" as string]: `${Math.round(distance * 45)}ms`,
  } as CSSProperties;

  return (
    <button
      type="button"
      data-code={def.code}
      aria-label={def.tool ? `${def.tool.name}, ${def.tool.group}` : def.code === "Space" ? "Space: send a ripple" : def.legend}
      aria-pressed={def.tool ? selected : undefined}
      className={`kb2-key ${def.tool ? "has-tool" : "is-mod"} ${selected ? "is-on" : ""}`}
      style={style}
      onClick={() => onPress(def)}
      onPointerEnter={() => onHover(def)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(def)}
      onBlur={() => onHover(null)}
    >
      <span className="kb2-cap">
        {wave ? <span key={wave} aria-hidden className="kb2-wave" /> : null}
        <span aria-hidden className="kb2-legend">
          {def.legend}
        </span>
        {def.tool ? (
          icon ? (
            <svg aria-hidden viewBox="0 0 24 24" className="kb2-logo">
              <path d={icon.path} fill="currentColor" />
            </svg>
          ) : (
            <span aria-hidden className="kb2-mono">
              {def.tool.name.slice(0, 2)}
            </span>
          )
        ) : null}
      </span>
    </button>
  );
}

export function StackKeyboard() {
  const byCode = useMemo(() => new Map(KEYS.map((key) => [key.code, key])), []);
  const section = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const [selected, setSelected] = useState<KeyDef | null>(null);
  const [preview, setPreview] = useState<KeyDef | null>(null);
  const [pulse, setPulse] = useState(0);
  const [wave, setWave] = useState(0);

  const flash = useCallback((code: string) => {
    const node = board.current?.querySelector<HTMLElement>(`[data-code="${code}"]`);
    if (!node) return;
    node.classList.add("is-down");
    window.setTimeout(() => node.classList.remove("is-down"), 150);
  }, []);

  const press = useCallback((def: KeyDef) => {
    setPulse((value) => value + 1);
    if (def.code === "Space") {
      setWave((value) => value + 1);
      setSelected(null);
      return;
    }
    if (def.tool) setSelected(def);
  }, []);

  const hover = useCallback((def: KeyDef | null) => {
    setPreview(def?.tool ? def : null);
  }, []);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting && entry.intersectionRatio > 0.35;
      },
      { threshold: [0, 0.35, 0.6] },
    );
    observer.observe(root);
    const onKey = (event: KeyboardEvent) => {
      if (!visible.current || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(target.tagName))) return;
      const def = byCode.get(event.code);
      if (!def || event.code === "Space") return;
      flash(def.code);
      press(def);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [byCode, flash, press]);

  const track = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const root = section.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    root.style.setProperty("--mx", `${((event.clientX - box.left) / box.width) * 100}%`);
    root.style.setProperty("--my", `${((event.clientY - box.top) / box.height) * 100}%`);
  }, []);

  const shown = preview ?? selected;
  const tool = shown?.tool ?? null;
  const builds = tool?.builds ?? [];
  const mapped = KEYS.filter((key) => key.tool).length;

  return (
    <section
      ref={section}
      aria-label="Tools I build with"
      onPointerMove={track}
      data-active={tool ? "" : undefined}
      className="block-ink kb-stage relative isolate overflow-hidden"
      style={tool ? { ["--kb-tint" as string]: brandInk(tool.name) } : undefined}
    >
      <KbBackdrop word={tool?.name ?? "Qwerty"} pulse={pulse} mapped={mapped} total={KEYS.length} />
      <div className="shell relative grid items-center gap-10 pb-28 pt-16 md:pb-40 md:pt-24 xl:grid-cols-[minmax(0,0.6fr)_minmax(0,2fr)] xl:gap-14">
        <div className="relative z-[1] min-h-[15rem]" aria-live="polite">
          <p className="meta text-white/45">The stack, as a keyboard</p>
          {tool ? (
            <div key={tool.name} className="kb-readout">
              <p className="meta mt-6 flex items-center gap-2 text-acid">
                <span className="kb-keychip">{shown?.legend}</span>
                {tool.group}
              </p>
              <h3 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,4.25rem)] uppercase leading-[0.9]">{tool.name}</h3>
              <p className="data mt-4 text-white/60">
                {builds.length ? `In ${builds.length} of ${projects.length} builds` : "Not listed in a build here yet"}
              </p>
              {builds.length ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {builds.slice(0, 5).map((build) => (
                    <li key={build.slug}>
                      <Link href={`/work/${build.slug}`} className="kb-build" data-cursor="open">
                        {build.name}
                      </Link>
                    </li>
                  ))}
                  {builds.length > 5 ? <li className="kb-build kb-build-more">+{builds.length - 5}</li> : null}
                </ul>
              ) : null}
            </div>
          ) : (
            <div className="kb-readout">
              <h3 className="mt-6 font-display text-[clamp(2.4rem,4.4vw,4.25rem)] uppercase leading-[0.9]">
                Press a key
              </h3>
              <p className="mt-4 max-w-[34ch] text-white/60">
                Every keycap is a tool from the stack. Click one, or type on your own keyboard, to see where it was used.
                Space sends a ripple across the board.
              </p>
            </div>
          )}
        </div>

        <div className="kb2-wrap relative z-[1]">
          <span aria-hidden className="kb2-backlight" />
          <span aria-hidden className="kb2-pool" />
          <span aria-hidden className="kb2-horizon" />
          <div aria-hidden className="kb-dim">
            <span className="kb-dim-line" />
            <span className="kb-dim-label">285.75 mm</span>
          </div>
          <div ref={board} className="kb2-case">
            <div className="kb2-plate">
              <div className="kb2-grid">
                {KEYS.map((def) => (
                  <Keycap
                    key={def.code}
                    def={def}
                    selected={selected?.code === def.code}
                    wave={wave}
                    onPress={press}
                    onHover={hover}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const MOTES: [number, number, number, number][] = [
  [42, 18, 0, 11],
  [48, 34, 2.4, 14],
  [55, 12, 5.1, 12],
  [61, 40, 1.2, 16],
  [66, 22, 7.3, 13],
  [70, 46, 3.8, 15],
  [74, 16, 6.2, 12],
  [79, 32, 0.8, 17],
  [84, 20, 4.4, 14],
  [58, 52, 8.1, 18],
  [51, 26, 9.5, 13],
  [88, 42, 2.9, 16],
];

function KbBackdrop({ word, pulse, mapped, total }: { word: string; pulse: number; mapped: number; total: number }) {
  const letters = word.toUpperCase().split("");
  return (
    <div aria-hidden className="kb-bg">
      <span className="kb-bg-bloom" />
      <span className="kb-bg-beam" />
      <span className="kb-bg-motes">
        {MOTES.map((mote, index) => (
          <i
            key={index}
            style={{
              left: `${mote[0]}%`,
              top: `${mote[1]}%`,
              animationDelay: `${mote[2]}s`,
              animationDuration: `${mote[3]}s`,
            }}
          />
        ))}
      </span>
      <span key={pulse} className="kb-bg-pulse" />
      <span className="kb-bg-grid" />
      <span className="kb-bg-grid kb-bg-grid-lit" />
      <span className="kb-bg-rows" />
      <p key={word} className="kb-bg-word" style={{ fontSize: `min(11rem, ${Math.max(5, 92 / letters.length)}vw)` }}>
        {letters.map((letter, index) => (
          <span key={index} style={{ animationDelay: `${index * 55}ms` }}>
            {letter === " " ? " " : letter}
          </span>
        ))}
        <i className="kb-bg-caret" style={{ animationDelay: `${letters.length * 55}ms` }} />
      </p>
      <span className="kb-bg-mark kb-bg-mark-tl" />
      <span className="kb-bg-mark kb-bg-mark-tr" />
      <span className="kb-bg-mark kb-bg-mark-bl" />
      <span className="kb-bg-mark kb-bg-mark-br" />
      <p className="kb-bg-spec kb-bg-spec-tr">
        <span>ANSI 60%</span>
        <span>{total} keys</span>
        <span>1u = 19.05 mm</span>
      </p>
      <p className="kb-bg-spec kb-bg-spec-bl">
        <span>{mapped} tools mapped</span>
        <span>Click or type</span>
      </p>
      <span className="kb-bg-grain" />
    </div>
  );
}
