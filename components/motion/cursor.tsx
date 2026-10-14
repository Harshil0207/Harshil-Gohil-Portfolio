"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * A ring that trails the pointer and swells over anything marked
 * `data-cursor`. The native cursor stays visible — this reads as craft without
 * taking away the affordance people rely on — and it never mounts on touch or
 * under reduced motion.
 */
export function Cursor() {
  const scope = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<SVGSVGElement>(null);
  const [label, setLabel] = useState("");

  useGSAP(
    () => {
      const ring = scope.current;
      const ball = ballRef.current;
      const spin = spinRef.current;
      if (!ring || !ball || !spin) return;

      const media = gsap.matchMedia();
      media.add(
        "(pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(ring, { opacity: 0, xPercent: -50, yPercent: -50, scale: 0 });
          gsap.set(ball, { opacity: 0, xPercent: -50, yPercent: -100 });
          const moveX = gsap.quickTo(ring, "x", { duration: 0.32, ease: "power3.out" });
          const moveY = gsap.quickTo(ring, "y", { duration: 0.32, ease: "power3.out" });
          const ballX = gsap.quickTo(ball, "x", { duration: 0.28, ease: "power3.out" });
          const ballY = gsap.quickTo(ball, "y", { duration: 0.28, ease: "power3.out" });
          let lastX = -1;
          let turn = 0;
          let ballOn = false;

          const onMove = (event: PointerEvent) => {
            moveX(event.clientX);
            moveY(event.clientY);
            ballX(event.clientX);
            ballY(event.clientY);
            if (lastX >= 0) {
              turn += (event.clientX - lastX) * 2.6;
              gsap.to(spin, { rotate: turn, duration: 0.5, ease: "power2.out", overwrite: "auto" });
            }
            lastX = event.clientX;

            const element = event.target as HTMLElement | null;
            const target = element?.closest<HTMLElement>("[data-cursor]");
            const grow = element?.closest("[data-cursor-grow]");
            const next = target?.dataset.cursor ?? "";
            setLabel(next);
            const active = Boolean(next || grow);
            gsap.to(ring, {
              opacity: active ? 1 : 0,
              scale: next ? 2.6 : grow ? 3.6 : 0,
              duration: 0.4,
              ease: "power3.out",
              overwrite: "auto",
            });
            if (ballOn === active) {
              ballOn = !active;
              gsap.to(ball, {
                opacity: active ? 0 : 1,
                scale: active ? 0.4 : 1,
                duration: active ? 0.2 : 0.35,
                ease: active ? "power2.in" : "back.out(2.4)",
                overwrite: "auto",
              });
            }
          };

          const onLeave = () => {
            gsap.to([ring, ball], { opacity: 0, duration: 0.25, overwrite: "auto" });
            ballOn = false;
          };

          window.addEventListener("pointermove", onMove, { passive: true });
          document.addEventListener("pointerleave", onLeave);
          return () => {
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerleave", onLeave);
          };
        },
      );

      return () => media.revert();
    },
    { scope },
  );

  return (
    <>
      <div
        ref={scope}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden size-10 place-items-center rounded-full bg-white text-[0.4rem] font-medium uppercase tracking-[0.14em] text-black opacity-0 mix-blend-difference lg:grid"
      >
        {label}
      </div>
      <div
        ref={ballRef}
        aria-hidden
        className="tennis-cursor pointer-events-none fixed left-0 top-0 z-[71] hidden opacity-0 lg:block"
      >
        <div className="tennis-cursor-hop">
          <svg ref={spinRef} viewBox="0 0 40 40" className="tennis-cursor-ball">
            <defs>
              <radialGradient id="tennis-felt" cx="34%" cy="30%" r="78%">
                <stop offset="0" stopColor="#f4ff8a" />
                <stop offset="0.38" stopColor="#d4ec2c" />
                <stop offset="0.8" stopColor="#a8c41a" />
                <stop offset="1" stopColor="#7d9512" />
              </radialGradient>
              <clipPath id="tennis-clip">
                <circle cx="20" cy="20" r="19" />
              </clipPath>
            </defs>
            <circle cx="20" cy="20" r="19" fill="url(#tennis-felt)" />
            <g clipPath="url(#tennis-clip)" fill="none" stroke="#fbfde9" strokeWidth="2.4" strokeLinecap="round">
              <path d="M7 1.5C15.5 9.5 15.5 30.5 7 38.5" />
              <path d="M33 1.5C24.5 9.5 24.5 30.5 33 38.5" />
            </g>
            <circle cx="20" cy="20" r="18.4" fill="none" stroke="#5f720c" strokeOpacity="0.35" strokeWidth="1.2" />
          </svg>
        </div>
        <div className="tennis-cursor-shadow" />
      </div>
    </>
  );
}
