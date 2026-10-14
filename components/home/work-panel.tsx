"use client";

import Link from "next/link";
import { useEffect, useRef, ViewTransition } from "react";
import { ArrowUpRight } from "@/components/icons";
import type { Project } from "@/content/projects";
import { EASE, gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-media";
import { WorkPlate } from "./work-plate";

const MANIFEST_LENGTH = 5;


export function WorkPanel({
  project,
  position,
}: {
  project: Project;
  position: number;
}) {
  const scope = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const flipped = position % 2 === 1;
  const manifest = project.stack.slice(0, MANIFEST_LENGTH);
  const remainder = project.stack.length - manifest.length;

  useEffect(() => {
    const root = scope.current;
    if (!root || reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      root.style.setProperty("--mx", `${event.clientX - box.left}px`);
      root.style.setProperty("--my", `${event.clientY - box.top}px`);
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    return () => root.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const frame = root.querySelector<HTMLElement>("[data-frame]");
        const numeral = root.querySelector<HTMLElement>("[data-numeral]");
        const rule = root.querySelector<HTMLElement>("[data-rule]");
        const scan = root.querySelector<HTMLElement>("[data-scan]");
        const lines = root.querySelectorAll<HTMLElement>('[data-void="line"]');

        const enter = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 76%", once: true },
        });

        if (frame) {
          enter.fromTo(
            frame,
            {
              opacity: 0,
              clipPath: flipped
                ? "inset(0% 0% 0% 100%)"
                : "inset(0% 100% 0% 0%)",
            },
            {
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.15,
              ease: EASE.out,
            },
            0,
          );
        }

        if (numeral) {
          enter.fromTo(
            numeral,
            { opacity: 0, xPercent: flipped ? 26 : -26 },
            { opacity: 1, xPercent: 0, duration: 1.1, ease: EASE.out },
            0.12,
          );
        }

        enter.fromTo(
          lines,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: EASE.out },
          0.2,
        );

        if (rule) {
          enter.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: EASE.out },
            0.34,
          );
        }

        // The screen drifts against the scroll. Depth without pinning anything,
        // so the section never takes the scroll away from the reader.
        const drift = frame
          ? gsap.fromTo(
              frame,
              { yPercent: 4 },
              {
                yPercent: -4,
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                },
              },
            )
          : null;

        // One pass of the read head per approach — a sweep that repeated would
        // stop reading as an instrument and start reading as a loading state.
        let sweep: gsap.core.Tween | null = null;
        const onEnter = () => {
          if (!scan) return;
          sweep?.kill();
          sweep = gsap.fromTo(
            scan,
            { yPercent: -60, opacity: 0.95 },
            { yPercent: 330, opacity: 0, duration: 1.15, ease: "power2.inOut" },
          );
        };

        root.addEventListener("pointerenter", onEnter);

        return () => {
          root.removeEventListener("pointerenter", onEnter);
          sweep?.kill();
          drift?.kill();
          enter.kill();
        };
      });

      return () => media.revert();
    },
    { scope, dependencies: [flipped] },
  );

  return (
    <article
      ref={scope}
      className="work-panel group relative"
      style={{ ["--accent" as string]: project.accent }}
    >
      {/* The seam between panels, ticked in the incoming client's ink. */}
      {position > 0 ? (
        <div className="shell" aria-hidden>
          <div className="relative h-px bg-line-on-field">
            <span className="absolute left-0 top-0 h-px w-20 bg-lit/70" />
          </div>
        </div>
      ) : null}

      <span
        aria-hidden
        className="work-bloom"
        style={{
          top: "2%",
          [flipped ? "right" : "left"]: "-10%",
          width: "54%",
          height: "78%",
        }}
      />

      <Link
        href={`/work/${project.slug}`}
        data-cursor="open"
        className="shell block py-16 md:py-24 lg:py-28"
      >
        <div
          className={`grid items-center gap-x-12 gap-y-10 lg:gap-x-16 ${
            flipped
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]"
              : "lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
          }`}
        >
          {/* ── The screen, running off the page ──────────────────────── */}
          {/* Bleeds off one edge only — the side it sits on — so the other
              edge stays flush with the readout instead of relying on a
              same-property override to win the cascade. */}
          <div
            className={`relative ${
              flipped
                ? "lg:order-2 -mr-5 md:-mr-8 xl:-mr-10"
                : "lg:order-1 -ml-5 md:-ml-8 xl:-ml-10"
            }`}
          >
            {/* Drawn where the asset's own catalogue label used to sit, at a
                scale that label could never have. */}
            <span
              aria-hidden
              data-void
              data-numeral
              className={`work-numeral pointer-events-none absolute -top-10 z-10 select-none md:-top-16 xl:-top-20 ${
                flipped
                  ? "right-5 md:right-8 xl:right-10"
                  : "left-5 md:left-8 xl:left-10"
              }`}
            >
              {project.index}
            </span>

            <div data-frame className="relative">
              <WorkPlate
                project={project}
                priority={position === 0}
                flipped={flipped}
              />
            </div>
          </div>

          {/* ── The readout ───────────────────────────────────────────── */}
          <div className={flipped ? "lg:order-1" : "lg:order-2"}>
            <p data-void="line" className="meta text-lit">
              {project.kicker}
            </p>

            <ViewTransition
              name={`title-${project.slug}`}
              share="morph"
              default="none"
            >
              <h3
                data-void="line"
                className="big mt-5 transition-colors duration-500 group-hover:text-lit"
              >
                {project.name}
              </h3>
            </ViewTransition>

            <span
              aria-hidden
              data-rule
              className="mt-7 block h-px w-full origin-left bg-lit/60"
            />

            <p
              data-void="line"
              className="lede mt-7 max-w-[44ch] text-on-field-2"
            >
              {project.summary}
            </p>

            <dl data-void="line" className="mt-10">
              {/* The window chrome used to state the address. It no longer
                  exists, so the readout picks the fact up. */}
              {project.domain ? (
                <div className="work-row">
                  <dt className="meta text-on-field-3">Address</dt>
                  <dd className="data text-right text-lit">{project.domain}</dd>
                </div>
              ) : null}
              <div className="work-row">
                <dt className="meta text-on-field-3">Category</dt>
                <dd className="data text-right text-on-field">
                  {project.category}
                </dd>
              </div>
              <div className="work-row">
                <dt className="meta text-on-field-3">Year</dt>
                <dd className="data text-on-field" data-figures>
                  {project.year}
                </dd>
              </div>
              <div className="work-row">
                <dt className="meta text-on-field-3">Status</dt>
                <dd className="data flex items-center gap-2.5 text-on-field">
                  <span className="work-led" aria-hidden />
                  {project.statusShort}
                </dd>
              </div>
            </dl>

            <ul data-void="line" className="mt-7 flex flex-wrap gap-1.5">
              {manifest.map((item) => (
                <li key={item} className="work-chip">
                  {item}
                </li>
              ))}
              {remainder > 0 ? (
                <li className="work-chip" data-figures>
                  +{remainder}
                </li>
              ) : null}
            </ul>

            <div data-void="line" className="mt-10">
              <span className="work-cta w-full sm:w-auto sm:min-w-[18rem]">
                Open the case study
                <ArrowUpRight className="size-4 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
