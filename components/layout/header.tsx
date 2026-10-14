"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Close, Menu } from "@/components/icons";
import { company } from "@/content/company";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { id: "work", href: "/#work", label: "Work" },
  { id: "capabilities", href: "/#capabilities", label: "Capabilities" },
  { id: "process", href: "/#process", label: "Process" },
  { id: "contact", href: "/#contact", label: "Contact" },
];

const COORDS = "21.17° N, 72.83° E";
const SUNRISE = 6.5;
const SUNSET = 18.5;

const partsFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

type Clock = { h: string; m: string; s: string; hours: number };

function readClock(): Clock {
  const parts = partsFormat.formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const h = get("hour");
  const m = get("minute");
  const s = get("second");
  return { h, m, s, hours: Number(h) + Number(m) / 60 + Number(s) / 3600 };
}

function useClock() {
  const [clock, setClock] = useState<Clock | null>(null);
  useEffect(() => {
    const update = () => setClock(readClock());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return clock;
}

function Sundial({
  hours,
  size = "md",
  cut = "var(--field)",
}: {
  hours: number | null;
  size?: "md" | "lg";
  cut?: string;
}) {
  const day = hours !== null && hours >= SUNRISE && hours <= SUNSET;
  const progress =
    hours === null
      ? 0.5
      : day
        ? (hours - SUNRISE) / (SUNSET - SUNRISE)
        : (((hours < SUNRISE ? hours + 24 : hours) - SUNSET) / (24 - (SUNSET - SUNRISE)));
  const angle = Math.PI * (1 - progress);
  const cx = 24 + Math.cos(angle) * 18;
  const cy = 24 - Math.sin(angle) * 18;
  const dimension = size === "lg" ? "h-9 w-[4.5rem]" : "h-7 w-14";

  return (
    <svg viewBox="0 0 48 28" aria-hidden className={`${dimension} shrink-0 overflow-visible`}>
      <path
        d="M6 24 A18 18 0 0 1 42 24"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1"
        strokeDasharray="1.5 2.5"
      />
      <path
        d={`M6 24 A18 18 0 0 1 ${cx.toFixed(2)} ${cy.toFixed(2)}`}
        fill="none"
        stroke={day ? "var(--acid)" : "currentColor"}
        strokeOpacity={day ? 0.9 : 0.35}
        strokeWidth="1.25"
      />
      <line x1="2" y1="24" x2="46" y2="24" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
      {day ? (
        <>
          <circle cx={cx} cy={cy} r="5.5" fill="var(--acid)" opacity="0.18" />
          <circle cx={cx} cy={cy} r="3" fill="var(--acid)" />
        </>
      ) : (
        <g transform={`translate(${cx} ${cy})`}>
          <circle r="3.4" fill="currentColor" />
          <circle cx="1.6" cy="-1.1" r="3" fill={cut} />
        </g>
      )}
    </svg>
  );
}

function phaseOf(hours: number) {
  if (hours < 5) return "Night";
  if (hours < 12) return "Morning";
  if (hours < 17) return "Afternoon";
  if (hours < 20) return "Evening";
  return "Night";
}

const SKY: [number, string, string][] = [
  [0, "#060a1c", "#151a3d"],
  [4.5, "#0d1230", "#2a2552"],
  [6, "#2e3a78", "#f2956a"],
  [7.5, "#4f88d4", "#f7c896"],
  [10, "#2f84e2", "#9dd1ff"],
  [15, "#3383dc", "#a7d6ff"],
  [17.4, "#4a68b4", "#f6ae78"],
  [18.6, "#352f6e", "#ec6f63"],
  [19.8, "#141a46", "#4b3466"],
  [21.5, "#070b20", "#171c40"],
  [24, "#060a1c", "#151a3d"],
];

function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const channel = (shift: number) =>
    Math.round(((pa >> shift) & 255) + (((pb >> shift) & 255) - ((pa >> shift) & 255)) * t);
  return `rgb(${channel(16)} ${channel(8)} ${channel(0)})`;
}

function skyAt(hours: number) {
  for (let index = 0; index < SKY.length - 1; index += 1) {
    const [h0, top0, low0] = SKY[index];
    const [h1, top1, low1] = SKY[index + 1];
    if (hours >= h0 && hours <= h1) {
      const t = (hours - h0) / (h1 - h0);
      return { top: mix(top0, top1, t), low: mix(low0, low1, t) };
    }
  }
  return { top: SKY[0][1], low: SKY[0][2] };
}

const STARS: [number, number, number][] = [
  [22, 24, 0],
  [64, 18, 0.6],
  [78, 38, 1.2],
  [40, 12, 1.8],
  [30, 44, 0.9],
  [55, 34, 2.1],
];

function RollDigit({ value }: { value: string }) {
  const n = Number(value);
  return (
    <span className="lc-digit" aria-hidden>
      <span className="lc-strip" style={{ transform: `translateY(${Number.isNaN(n) ? 0 : -n}em)` }}>
        {"0123456789".split("").map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
}

function Porthole({ clock }: { clock: Clock | null }) {
  const hours = clock?.hours ?? 12;
  const day = hours >= SUNRISE && hours <= SUNSET;
  const progress = day
    ? (hours - SUNRISE) / (SUNSET - SUNRISE)
    : ((hours < SUNRISE ? hours + 24 : hours) - SUNSET) / (24 - (SUNSET - SUNRISE));
  const angle = Math.PI * (1 - progress);
  const x = 50 + Math.cos(angle) * 36;
  const y = 70 - Math.sin(angle) * 46;
  const sky = skyAt(hours);
  const glow = day ? Math.sin(Math.PI * progress) : 0;
  const ring = (hours / 24) * 100;

  return (
    <span
      className={`lc-port ${clock ? "" : "is-idle"} ${day ? "is-day" : "is-night"}`}
      style={{
        ["--sky-top" as string]: sky.top,
        ["--sky-low" as string]: sky.low,
        ["--glow" as string]: glow.toFixed(2),
      }}
    >
      <svg viewBox="0 0 44 44" className="lc-ring" aria-hidden>
        <circle cx="22" cy="22" r="20.5" pathLength={100} className="lc-ring-track" />
        <circle
          cx="22"
          cy="22"
          r="20.5"
          pathLength={100}
          className="lc-ring-fill"
          style={{ strokeDasharray: `${ring.toFixed(2)} 100` }}
        />
      </svg>
      <span className="lc-sky">
        {STARS.map(([sx, sy, delay], index) => (
          <i key={index} className="lc-star" style={{ left: `${sx}%`, top: `${sy}%`, animationDelay: `${delay}s` }} />
        ))}
        <span
          className={day ? "lc-sun" : "lc-moon"}
          style={{ left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%` }}
        />
        <svg viewBox="0 0 40 12" preserveAspectRatio="none" className="lc-city" aria-hidden>
          <path d="M0 12V8h3V5h3v3h2V3h4v5h2V6h3V2l2-1 2 1v6h3V5h4v3h2V4h3v4h3v4z" />
        </svg>
        <span className="lc-gloss" />
      </span>
    </span>
  );
}

function LocalPlace({ clock }: { clock: Clock | null }) {
  const label = clock
    ? `${clock.h}:${clock.m} in ${company.address.city}, India`
    : `Local time in ${company.address.city}`;
  return (
    <div className="lc" aria-label={label} role="img">
      <Porthole clock={clock} />
      <div className="lc-text">
        <p className="lc-time">
          {clock ? (
            <>
              <RollDigit value={clock.h[0]} />
              <RollDigit value={clock.h[1]} />
              <span className="lc-colon">:</span>
              <RollDigit value={clock.m[0]} />
              <RollDigit value={clock.m[1]} />
              <span className="lc-sec">
                <RollDigit value={clock.s[0]} />
                <RollDigit value={clock.s[1]} />
              </span>
            </>
          ) : (
            <span className="lc-placeholder">--:--</span>
          )}
        </p>
        <p className="lc-meta">
          <span>{company.address.city}</span>
          <span className="lc-sep" />
          <span className="lc-phase">{clock ? phaseOf(clock.hours) : "IST"}</span>
        </p>
      </div>
      <div className="lc-more" aria-hidden>
        <span>GMT+5:30</span>
        <span>{COORDS}</span>
      </div>
    </div>
  );
}

function RollLabel({ children }: { children: string }) {
  return (
    <span className="relative block h-[1.15em] overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full"
      >
        {children}
      </span>
    </span>
  );
}

export function Header() {
  const scope = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const clock = useClock();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [activeSection, setActive] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  const active = pathname === "/" ? activeSection : null;

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    const onTop = () => {
      if (window.scrollY < window.innerHeight * 0.4) setActive(null);
    };
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          start: 160,
          end: "max",
          onUpdate: ({ direction, progress }) => {
            if (element.dataset.open === "true") return;
            gsap.to(element, {
              yPercent: direction === 1 && progress > 0.02 ? -110 : 0,
              duration: 0.5,
              ease: "power2.out",
            });
          },
        });
      });
      return () => media.revert();
    },
    { scope },
  );

  return (
    <header
      ref={scope}
      data-open={open}
      style={{ viewTransitionName: "site-header" }}
      className={`fixed inset-x-0 top-0 z-50 text-on-field transition-[background-color,border-color] duration-500 ${
        solid || open
          ? "border-b border-line-on-field bg-field/95"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell grid h-[4.5rem] grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          data-cursor="home"
          className="group flex w-max items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid"
        >
          <span className="relative block size-10 overflow-hidden rounded-[0.7rem] bg-on-field transition-[border-radius,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-[-6deg] group-hover:rounded-full">
            <Image
              src="/avatar.webp"
              alt=""
              fill
              sizes="40px"
              loading="eager"
              className="object-cover"
            />
          </span>
          <span className="leading-none">
            <span className="block text-[0.9375rem] font-medium tracking-[-0.01em]">
              {company.name}
            </span>
            <span className="mt-1.5 block text-[0.75rem] text-on-field-3">
              {company.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => {
              const current = active === link.id;
              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    aria-current={current ? "true" : undefined}
                    className={`group flex items-center gap-2 rounded-md px-3.5 py-2 text-[0.9375rem] tracking-[-0.01em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-acid ${
                      current ? "text-on-field" : "text-on-field-2 hover:text-on-field"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-[1px] bg-acid transition-[opacity,transform] duration-300 ${
                        current ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      }`}
                    />
                    <RollLabel>{link.label}</RollLabel>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-2 md:gap-3">
          <div className="hidden items-center md:flex">
            <LocalPlace clock={clock} />
          </div>
          <ThemeToggle />
          <Link
            href="/#contact"
            data-cursor="write"
            className="group hidden h-10 items-center gap-3 rounded-[0.7rem] bg-acid pl-4 pr-1.5 text-sm font-medium text-on-acid transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid md:inline-flex"
          >
            <RollLabel>Get in touch</RollLabel>
            <span className="grid size-7 place-items-center rounded-[0.5rem] bg-on-acid text-acid transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-45">
              <ArrowUpRight className="size-3.5" />
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-[0.7rem] border border-line-on-field lg:hidden"
          >
            {open ? <Close className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        inert={!open}
        className={`absolute inset-x-0 top-full h-[calc(100dvh-4.5rem)] bg-ink text-paper transition-[opacity,clip-path] duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden ${
          open
            ? "opacity-100 [clip-path:inset(0_0_0_0)]"
            : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div className="shell flex h-full flex-col justify-between overflow-y-auto pb-8 pt-6">
          <nav aria-label="Sections">
            <ul>
              {links.map((link) => (
                <li key={link.id} className="border-b border-white/10">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-5 font-display text-[2.6rem] uppercase leading-none tracking-[0.01em]"
                  >
                    {link.label}
                    <ArrowUpRight className="size-5 opacity-40" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 grid gap-6">
            <div className="flex items-center gap-4 text-paper">
              <Sundial hours={clock?.hours ?? null} size="lg" cut="var(--ink)" />
              <div className="leading-tight">
                <p className="text-2xl font-medium tabular-nums">
                  {clock ? `${clock.h}:${clock.m}` : "--:--"}
                  <span className="ml-2 text-sm text-white/50">IST</span>
                </p>
                <p className="mt-1 text-sm text-white/55">
                  {company.address.city}, India · {COORDS}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm">
              <div className="flex items-center gap-5 text-white/72">
                <a href={company.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  GitHub
                </a>
                <a href={company.x} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  X
                </a>
              </div>
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-[0.7rem] bg-acid px-5 py-3 font-medium text-on-acid"
              >
                Get in touch
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
