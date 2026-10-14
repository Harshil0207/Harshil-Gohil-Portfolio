"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { finishIntro } from "@/lib/intro";
import { setSmoothScrollLocked } from "@/lib/smooth-scroll";

const STAGES = ["Schema", "API", "Interface", "3D", "AI", "Harshil"];
const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const CLIMB = 1.6;

function pageReady() {
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
  const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
  const cap = new Promise<void>((resolve) => setTimeout(resolve, 6000));
  return Promise.race([Promise.all([loaded, fonts]).then(() => undefined), cap]);
}

function columnPosition(value: number, place: number) {
  const base = Math.floor(value / place) % 10;
  const rest = value % place;
  const carry = rest > place - 1 ? rest - (place - 1) : 0;
  return base + carry;
}

export function IntroLoader() {
  const [done, setDone] = useState(false);
  const scope = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const odometer = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = scope.current;
    const back = curtain.current;
    const meter = odometer.current;
    const line = bar.current;
    const stack = words.current;
    if (!root || !back || !meter || !line || !stack) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem("hg-intro") === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishIntro();
      return;
    }

    const html = document.documentElement;
    html.classList.add("intro-lock");
    setSmoothScrollLocked(true);

    const columns = Array.from(meter.querySelectorAll<HTMLElement>("[data-strip]"));
    const items = Array.from(stack.children) as HTMLElement[];
    const metas = Array.from(root.querySelectorAll<HTMLElement>("[data-intro-meta]"));
    const progress = { value: 0 };
    let alive = true;

    const render = () => {
      const value = progress.value;
      const places = [100, 10, 1];
      columns.forEach((column, index) => {
        const place = places[index];
        const position = place === 1 ? value % 10 : columnPosition(value, place);
        column.style.transform = `translate3d(0, ${-position}em, 0)`;
      });
      line.style.transform = `scaleX(${value / 100})`;
    };

    const ctx = gsap.context(() => {}, root);
    let climbed: Promise<void> = Promise.resolve();

    ctx.add(() => {
      gsap.set(items, { y: 0, yPercent: 105 });
      gsap.set(stack, { opacity: 1 });
      render();

      const intro = gsap.timeline();
      intro
        .fromTo(
          metas,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.06 },
        )
        .fromTo(meter, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: "expo.out" }, 0.05)
        .to(items[0], { yPercent: 0, duration: 0.8, ease: "expo.out" }, 0.1);

      const steps = STAGES.length - 2;
      for (let index = 1; index <= steps; index += 1) {
        const at = 0.1 + (CLIMB * index) / (steps + 1);
        intro
          .to(items[index - 1], { yPercent: -105, duration: 0.55, ease: "power3.inOut" }, at)
          .fromTo(
            items[index],
            { yPercent: 105 },
            { yPercent: 0, duration: 0.55, ease: "power3.inOut" },
            at,
          );
      }

      const climb = gsap.to(progress, {
        value: 86,
        duration: CLIMB,
        ease: "power1.inOut",
        onUpdate: render,
      });
      climbed = new Promise<void>((resolve) => {
        climb.eventCallback("onComplete", () => resolve());
      });
    });

    const leave = () => {
      if (!alive) return;
      const last = items.length - 1;
      ctx.add(() => {
        gsap
          .timeline({
            onComplete: () => {
              try {
                sessionStorage.setItem("hg-intro", "1");
              } catch {}
              html.classList.remove("intro-lock");
              setSmoothScrollLocked(false);
              setDone(true);
            },
          })
          .to(progress, { value: 100, duration: 0.55, ease: "power2.out", onUpdate: render })
          .to(items[last - 1], { yPercent: -105, duration: 0.55, ease: "power3.inOut" }, 0)
          .fromTo(items[last], { yPercent: 105 }, { yPercent: 0, duration: 0.55, ease: "power3.inOut" }, 0)
          .to(
            [meter, items[last]],
            { yPercent: -105, duration: 0.6, ease: "power3.in", stagger: 0.05 },
            "+=0.55",
          )
          .to(metas, { opacity: 0, y: -10, duration: 0.4, ease: "power2.in", stagger: 0.03 }, "<")
          .to(line, { scaleY: 0, transformOrigin: "50% 0%", duration: 0.3, ease: "power2.in" }, "<")
          .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.85, ease: "expo.inOut" }, "-=0.15")
          .to(back, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.85, ease: "expo.inOut" }, "-=0.72")
          .add(finishIntro, "-=0.5");
      });
    };

    Promise.all([pageReady(), climbed]).then(leave);

    return () => {
      alive = false;
      ctx.revert();
      columns.forEach((column) => {
        column.style.transform = "";
      });
      line.style.transform = "";
      html.classList.remove("intro-lock");
      setSmoothScrollLocked(false);
    };
  }, []);

  if (done) return null;

  return (
    <>
      <div
        ref={curtain}
        aria-hidden
        className="intro-loader fixed inset-0 z-[199] bg-acid"
        style={{ clipPath: "inset(0% 0% 0% 0%)", viewTransitionName: "intro-curtain" }}
      />
      <div
        ref={scope}
        role="status"
        aria-live="polite"
        aria-label="Loading Harshil Gohil's portfolio"
        className="intro-loader fixed inset-0 z-[200] flex flex-col bg-field text-on-field"
        style={{ clipPath: "inset(0% 0% 0% 0%)", viewTransitionName: "intro-loader" }}
      >
        <div className="shell flex items-center justify-between pt-6 md:pt-8">
          <span data-intro-meta className="meta text-on-field/70">
            Harshil Gohil
          </span>
          <span data-intro-meta className="meta text-on-field/70">
            Surat, India
          </span>
        </div>

        <div className="shell flex flex-1 flex-col justify-center">
          <span data-intro-meta className="meta text-on-field/55">
            Now building
          </span>
          <span
            ref={words}
            aria-hidden
            className="mt-4 grid h-[1.1em] overflow-hidden opacity-0 font-display text-[clamp(3rem,9vw,8.5rem)] uppercase leading-[1.1]"
          >
            {STAGES.map((stage) => (
              <span
                key={stage}
                className="col-start-1 row-start-1 block will-change-transform"
              >
                {stage}
              </span>
            ))}
          </span>
        </div>

        <div className="shell pb-6 md:pb-8">
          <div className="h-px w-full bg-on-field/15">
            <div ref={bar} className="h-px origin-left scale-x-0 bg-acid" />
          </div>
          <div className="mt-4 flex items-end justify-between gap-6">
            <span data-intro-meta className="meta max-w-[22ch] leading-relaxed text-on-field/55">
              Full-stack, 3D and AI work, 2024—2026
            </span>
            <span className="block overflow-hidden">
              <span
                ref={odometer}
                aria-hidden
                className="flex font-display text-[clamp(5rem,18vw,15rem)] leading-none"
              >
                {[0, 1, 2].map((column) => (
                  <span key={column} className="relative block h-[1em] w-[0.5em] overflow-hidden">
                    <span
                      data-strip
                      className="absolute inset-x-0 top-0 flex flex-col items-center will-change-transform"
                    >
                      {STRIP.map((digit, index) => (
                        <span key={index} className="block h-[1em] leading-none">
                          {digit}
                        </span>
                      ))}
                    </span>
                  </span>
                ))}
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
