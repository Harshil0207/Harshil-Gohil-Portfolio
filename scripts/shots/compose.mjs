#!/usr/bin/env node
/**
 * Step 3 of 3 — renders the finished asset.
 *
 * Starts the app on a scratch port, points a browser at `/shot/<slug>`, and
 * clips the screenshot to `#plate`. The composite therefore lives in CSS next to
 * the design tokens instead of in an image library, which is what makes it
 * tunable by eye: open the same route in a browser and what you see is the file.
 *
 * Usage: node scripts/shots/compose.mjs [slug ...]
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { chromium } from "playwright";
import { readProjects, selected } from "./registry.mjs";
import { DEFAULTS } from "./config.mjs";

const PORT = Number(process.env.SHOT_PORT ?? 4321);
const OUT = "public/work";
const PLATE = { width: 1112, height: 709 };

/** Owned by config.mjs, so the window is always cut to what capture produced. */
const CAPTURE_RATIO = DEFAULTS.viewport.width / DEFAULTS.viewport.height;

/**
 * A capture taken before the viewport changed is the one failure that survives a
 * clean run: it composites without error and quietly letterboxes or side-crops
 * the product. Cheaper to refuse it than to notice it on the live index.
 */
async function ratioMismatch(file) {
  const { width, height } = await sharp(file).metadata();
  if (!width || !height) return "unreadable capture";

  const ratio = width / height;
  const drift = Math.abs(ratio - CAPTURE_RATIO) / CAPTURE_RATIO;
  if (drift <= 0.02) return null;

  return (
    `stale capture at ${width}\u00d7${height} (${ratio.toFixed(3)}); ` +
    `the plate expects ${CAPTURE_RATIO.toFixed(3)} — re-run shots:capture --force`
  );
}

/** A server is the right one only if it actually serves a plate. */
async function servesPlate(origin, slug) {
  try {
    const response = await fetch(`${origin}/shot/${slug}`, {
      signal: AbortSignal.timeout(90_000),
    });
    if (!response.ok) return false;
    return (await response.text()).includes('id="plate"');
  } catch {
    return false;
  }
}

/**
 * Next refuses a second dev server in the same directory, and the one already
 * running is usually the author's. So an existing server is adopted rather than
 * fought, and a fresh one is only started when nothing answers.
 */
async function resolveServer(slug) {
  const candidates = process.env.SHOT_ORIGIN
    ? [process.env.SHOT_ORIGIN]
    : [3000, 3001, 3002, PORT].map((port) => `http://127.0.0.1:${port}`);

  for (const origin of candidates) {
    if (await servesPlate(origin, slug)) {
      console.log(`using the dev server already running on ${origin}`);
      return { origin, stop: () => {} };
    }
  }

  const origin = `http://127.0.0.1:${PORT}`;
  console.log(`starting the app on ${origin} \u2026`);

  const server = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    stdio: ["ignore", "ignore", "inherit"],
    env: { ...process.env, NODE_ENV: "development" },
  });

  const stop = () => {
    if (!server.killed) server.kill("SIGTERM");
  };
  process.on("exit", stop);
  process.on("SIGINT", () => {
    stop();
    process.exit(130);
  });

  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      stop();
      throw new Error(`the dev server exited with code ${server.exitCode}`);
    }
    if (await servesPlate(origin, slug)) return { origin, stop };
    await new Promise((resolve) => setTimeout(resolve, 700));
  }

  stop();
  throw new Error(`the dev server did not serve a plate on ${origin} within 180s`);
}

const projects = selected(readProjects(), process.argv.slice(2));

// A plate with no capture behind it would ship a placeholder as if it were the
// product, so it is refused here rather than drawn.
const ready = projects.filter((project) => existsSync(`${OUT}/raw/${project.slug}.jpg`));
const waiting = projects.filter((project) => !existsSync(`${OUT}/raw/${project.slug}.jpg`));

if (ready.length === 0) {
  console.log("nothing to compose — no captures in public/work/raw");
  for (const project of waiting) console.log(`  ·  ${project.slug} — no capture`);
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });

const failures = [];
const { origin, stop } = await resolveServer(ready[0].slug);

try {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: PLATE,
    // Retina output: the index card renders the image at about half the page
    // width, so a 1× plate would be soft on any modern display.
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });

  for (const project of ready) {
    const page = await context.newPage();
    try {
      const stale = await ratioMismatch(`${OUT}/raw/${project.slug}.jpg`);
      if (stale) throw new Error(stale);

      await page.goto(`${origin}/shot/${project.slug}?ratio=${CAPTURE_RATIO}`, {
        waitUntil: "networkidle",
        timeout: 90_000,
      });

      const plate = page.locator("#plate");
      await plate.waitFor({ state: "visible", timeout: 30_000 });
      // The capture and the ground are <img>: shooting before they decode would
      // clip a plate with holes in it.
      await page.evaluate(() =>
        Promise.all(
          Array.from(document.images)
            .filter((image) => !image.complete)
            .map(
              (image) =>
                new Promise((resolve) => {
                  image.addEventListener("load", resolve, { once: true });
                  image.addEventListener("error", resolve, { once: true });
                }),
            ),
        ),
      );
      await page.waitForTimeout(320);

      await plate.screenshot({
        path: `${OUT}/${project.slug}.jpg`,
        type: "jpeg",
        quality: 92,
      });

      const ground = existsSync(`${OUT}/ground/${project.slug}.jpg`);
      console.log(`  ✓  ${project.slug} — ${ground ? "generated ground" : "gradient ground"}`);
    } catch (error) {
      failures.push([project.slug, error.message.split("\n")[0]]);
      console.log(`  ✗  ${project.slug} — ${error.message.split("\n")[0]}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
} finally {
  stop();
}

for (const project of waiting) {
  const kept = project.image ? `kept its existing ${project.image}` : "on the stand-in panel";
  console.log(`  ·  ${project.slug} — no capture, ${kept}`);
}

if (failures.length) process.exit(1);
