"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ShotFrame } from "@/components/work/shot-frame";
import type { Project } from "@/content/projects";
import { useSupportsWebglSurfaces } from "@/lib/use-media";
import { useInViewOnce } from "@/lib/use-in-view";

const CaseHero = dynamic(() => import("./case-hero"), { ssr: false });

/**
 * Ships the framed screenshot first; the shader plane layers into the frame's
 * capture slot only on a pointer-capable desktop that has not asked for reduced
 * motion. The frame itself is never the shader's to draw, so a device that
 * never reaches the canvas still gets the same rail, border and ratio.
 */
export function CaseHeroMount({ project }: { project: Project }) {
  const supported = useSupportsWebglSurfaces();
  const { ref, inView } = useInViewOnce<HTMLDivElement>("200px");
  // A lost context would leave a blank canvas over the screenshot, so the
  // shader layer retires and the image below carries the section.
  const [lost, setLost] = useState(false);

  const live = supported && inView && !lost && Boolean(project.image);

  return (
    <div ref={ref}>
      <ShotFrame
        project={project}
        priority
        /* The ground is full bleed now, so the capture is the window width less
           the frame's padding — always under 100vw, whatever the clamp lands
           on. Stating the bound rather than the exact box keeps this correct as
           the padding is tuned: understating would make the browser pick a
           candidate narrower than the box and paint the first frame upscaled,
           where overstating only costs a slightly larger file. */
        sizes="100vw"
        overlay={
          live && project.image ? (
            <CaseHero
              image={project.image}
              accent={project.accent}
              onContextLost={() => setLost(true)}
            />
          ) : null
        }
      />
    </div>
  );
}
