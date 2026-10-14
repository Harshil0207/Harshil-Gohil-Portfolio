/* eslint-disable @next/next/no-img-element --
   next/image resizes and re-encodes what it serves, and this route is a
   screenshot target: the capture has to reach the shutter at exactly the pixels
   capture wrote. Nothing here is ever served to a visitor. */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";

/**
 * The shot plate — an internal render target, not a page.
 *
 * `scripts/shots/compose.mjs` points a browser at this route and clips its
 * screenshot to `#plate`, so what it draws at 1112×709 is exactly what lands in
 * `public/work/`. Keeping the composite in CSS rather than in an image library
 * means the plate can be opened in a browser and tuned by eye, against the same
 * tokens the rest of the site uses.
 *
 * Two rules hold the asset honest. The capture is never repainted — the ground
 * and the frame decorate it, they don't touch its pixels. And the plate carries
 * no name, kicker or category: the index row already prints all of those beside
 * the image, so putting them here would only set the same words twice.
 */

const CANVAS = { width: 1112, height: 709 };

/**
 * Geometry. The window is placed off-centre on purpose: a frame sitting in an
 * even margin is the house style of every stock mockup, whereas weighting the
 * ground into one corner reads as a composition. That corner is also where the
 * generated ground is asked to put its light, and where the catalogue marks sit.
 *
 * The window is cut to the capture's own ratio rather than a chosen one, so the
 * screenshot is never cropped to fit — object-fit has nothing left to trim. That
 * ratio is owned by `scripts/shots/config.mjs` and arrives as `?ratio=`; the
 * fallback only matters when the route is opened by hand in a browser.
 */
const FALLBACK_RATIO = 1440 / 780;
const CHROME_HEIGHT = 34;
const WINDOW = { left: 132, right: 40, top: 118 };
const WINDOW_WIDTH = CANVAS.width - WINDOW.left - WINDOW.right;

export function generateStaticParams() {
  // Nothing to prerender in a real build: the route refuses to render there, so
  // generating the params would only ship a set of 404s.
  if (process.env.NODE_ENV === "production") return [];
  return projects.map((project) => ({ slug: project.slug }));
}

/** feTurbulence rather than a bitmap: it costs nothing to ship and never tiles. */
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
       <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/></filter>
       <rect width="240" height="240" filter="url(#g)"/>
     </svg>`,
  );

/** `toplinebase.com/browse`, or the bare host when the shot is of the root. */
function readAddress(slug: string): string | null {
  const sidecar = join(process.cwd(), "public/work/raw", `${slug}.json`);
  if (!existsSync(sidecar)) return null;

  try {
    const { url } = JSON.parse(readFileSync(sidecar, "utf8")) as { url?: string };
    if (!url) return null;

    const { host, pathname } = new URL(url);
    return pathname === "/" ? host : `${host}${pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

export default async function ShotPlate({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ratio?: string }>;
}) {
  // The route exists to produce build inputs; it is not part of the site.
  if (process.env.NODE_ENV === "production") notFound();

  const { slug } = await params;
  const { ratio } = await searchParams;

  const captureRatio = Number(ratio) > 0 ? Number(ratio) : FALLBACK_RATIO;
  const windowHeight = Math.round(WINDOW_WIDTH / captureRatio) + CHROME_HEIGHT;
  const project = getProject(slug);
  if (!project) notFound();

  const capture = existsSync(join(process.cwd(), "public/work/raw", `${slug}.jpg`))
    ? `/work/raw/${slug}.jpg`
    : null;
  const ground = existsSync(join(process.cwd(), "public/work/ground", `${slug}.jpg`))
    ? `/work/ground/${slug}.jpg`
    : null;

  // Capture writes a sidecar naming the address it actually shot, which is not
  // always the project's root — a homepage that errors or hides the product
  // behind a hero gets pointed at a real page instead. The chrome states that
  // address rather than the one the reader might assume.
  const address = readAddress(slug) ?? project.domain ?? project.slug;

  const ink = "#08080a";
  const accent = project.accent;

  return (
    <div
      id="plate"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: CANVAS.width,
        height: CANVAS.height,
        overflow: "hidden",
        background: ink,
        // The plate is a still: nothing in it should be mid-transition when the
        // shutter fires.
        isolation: "isolate",
      }}
    >
      {/* Ground. A generated backdrop when one has been rendered, otherwise the
          client's ink resolved against ink through the same gradient stack —
          which is why an absent ground degrades to a duller plate, not a hole. */}
      {ground ? (
        <img
          src={ground}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: [
              `radial-gradient(120% 96% at 14% 4%, color-mix(in oklab, ${accent} 62%, ${ink}) 0%, transparent 58%)`,
              `radial-gradient(96% 84% at 94% 104%, color-mix(in oklab, ${accent} 34%, #1f44ff) 0%, transparent 56%)`,
              `linear-gradient(158deg, ${ink} 0%, color-mix(in oklab, ${accent} 20%, ${ink}) 100%)`,
            ].join(","),
          }}
        />
      )}

      {/* A generated ground drifts off-brand on hue; this pins it back to the
          client's ink without flattening its structure. */}
      {ground && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(158deg, color-mix(in oklab, ${accent} 46%, ${ink}) 0%, color-mix(in oklab, ${accent} 16%, ${ink}) 100%)`,
            mixBlendMode: "color",
            opacity: 0.82,
          }}
        />
      )}

      {/* Depth toward the edges, so the window reads as lit rather than pasted. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(112% 88% at 50% 22%, transparent 40%, ${ink} 100%)`,
          opacity: 0.62,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: "240px 240px",
          mixBlendMode: "overlay",
          opacity: 0.14,
        }}
      />

      {/* Catalogue marks. Small, inset well clear of the edge: the index card
          scales the finished image on hover, which crops whatever sits at the
          bleed. */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: WINDOW.left,
          right: WINDOW.right,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono-face), ui-monospace, monospace",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        <span>{`No. ${project.index}`}</span>
        <span>{project.year}</span>
      </div>

      {/* The window. */}
      <div
        style={{
          position: "absolute",
          left: WINDOW.left,
          top: WINDOW.top,
          width: WINDOW_WIDTH,
          height: windowHeight,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow: [
            `0 44px 96px -22px rgba(8,8,10,0.72)`,
            `0 10px 28px rgba(8,8,10,0.42)`,
            `inset 0 1px 0 rgba(255,255,255,0.14)`,
          ].join(","),
          background: "#ffffff",
        }}
      >
        {/* Chrome. The domain is set here rather than as a caption because it is
            a fact about the capture — this is that site, at that address. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            height: CHROME_HEIGHT,
            paddingLeft: 16,
            paddingRight: 16,
            background: "rgba(8,8,10,0.92)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", gap: 7 }}>
            {["rgba(255,255,255,0.28)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.14)"].map(
              (dot) => (
                <span
                  key={dot}
                  style={{ width: 8, height: 8, borderRadius: 999, background: dot }}
                />
              ),
            )}
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono-face), ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.62)",
            }}
          >
            {address}
          </span>
          <span
            aria-hidden
            style={{
              marginLeft: "auto",
              width: 26,
              height: 3,
              borderRadius: 999,
              background: accent,
              opacity: 0.9,
            }}
          />
        </div>

        {capture ? (
          <img
            src={capture}
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: windowHeight - CHROME_HEIGHT,
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
        ) : (
          // Compose refuses to write a plate in this state; drawn only so the
          // route is legible in a browser before a capture exists.
          <div
            style={{
              height: windowHeight - CHROME_HEIGHT,
              display: "grid",
                placeItems: "center",
              background: "#f4f4f2",
              fontFamily: "var(--font-mono-face), ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(8,8,10,0.45)",
            }}
          >
            no capture — run npm run shots:capture
          </div>
        )}
      </div>
    </div>
  );
}
