"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { onIntroDone } from "@/lib/intro";
import { usePrefersReducedMotion } from "@/lib/use-media";

const VIDEO_ID = "3BEHQEiDgW0";

const EMBED = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${new URLSearchParams({
  autoplay: "1",
  mute: "1",
  loop: "1",
  playlist: VIDEO_ID,
  controls: "0",
  disablekb: "1",
  fs: "0",
  iv_load_policy: "3",
  modestbranding: "1",
  playsinline: "1",
  rel: "0",
}).toString()}`;

const POSTER = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export function HeroVideo({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const element = root.current;
    if (!element) return;
    let near = false;
    let introDone = false;
    const check = () => {
      if (near && introDone) setMount(true);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        check();
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    const stop = onIntroDone(() => {
      introDone = true;
      check();
    });
    return () => {
      observer.disconnect();
      stop();
    };
  }, [reduced]);

  return (
    <div ref={root} className="hv">
      <div aria-hidden className="hv-media" style={{ backgroundImage: `url(${POSTER})` }}>
        {mount ? (
          <iframe
            className={`hv-frame ${ready ? "is-ready" : ""}`}
            src={EMBED}
            title="Background video"
            tabIndex={-1}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => window.setTimeout(() => setReady(true), 1400)}
          />
        ) : null}
      </div>
      <div className="hv-content">{children}</div>
    </div>
  );
}
