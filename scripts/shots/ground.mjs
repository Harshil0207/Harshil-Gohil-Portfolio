#!/usr/bin/env node
/**
 * Step 2 of 3 — generates the ground behind the capture. Optional.
 *
 * The model is only ever asked for an abstract backdrop: no interface, no
 * screen, no device, no text. That restriction is the whole point. A portfolio
 * of named client systems cannot show invented software, so the generated pixels
 * are confined to the surface the product sits on, and the plate composites the
 * real capture over them untouched.
 *
 * Writes `public/work/ground/<slug>.jpg`. If a ground is missing, the plate
 * falls back to a gradient built from the client's ink, so this step can be
 * skipped, re-run per project, or dropped entirely without breaking the site.
 *
 * Usage: node scripts/shots/ground.mjs [slug ...] [--force] [--model=<slug>]
 */
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { gateway, generateImage } from "ai";
import { readProjects, selected } from "./registry.mjs";

const OUT = "public/work/ground";
const PLATE = { width: 1112, height: 709 };

const argv = process.argv.slice(2);
const force = argv.includes("--force");
const requested = argv.find((arg) => arg.startsWith("--model="))?.slice("--model=".length);

if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
  console.error(
    [
      "No AI Gateway credentials. This step needs one of:",
      "",
      "  AI_GATEWAY_API_KEY   a static key — vercel.com/dashboard → AI Gateway → API keys",
      "  VERCEL_OIDC_TOKEN    written by `vercel link && vercel env pull .env.local`",
      "",
      "Skipping it is safe: the plate falls back to a gradient ground built from",
      "the client's ink, so `npm run shots` still produces a finished asset.",
    ].join("\n"),
  );
  process.exit(1);
}

/**
 * The gateway's image catalogue moves, so the slug is resolved at run time
 * against what the account can actually reach rather than hard-coded and left to
 * rot. The preference list is an ordering, not a requirement.
 */
const PREFERRED = [
  /^google\/gemini-.*-image/,
  /^google\/imagen-/,
  /^openai\/gpt-image-/,
  /image/,
];

async function resolveModel() {
  if (requested) return requested;

  const catalogue = await gateway.getAvailableModels();
  const entries = catalogue.models ?? catalogue ?? [];
  const ids = entries
    .filter((entry) => {
      const kind = `${entry.modelType ?? entry.type ?? ""}`.toLowerCase();
      return kind ? kind.includes("image") : /image|imagen/.test(entry.id ?? "");
    })
    .map((entry) => entry.id)
    .filter(Boolean);

  if (ids.length === 0) {
    throw new Error("the gateway lists no image models for this account");
  }

  for (const pattern of PREFERRED) {
    const match = ids.find((id) => pattern.test(id));
    if (match) return match;
  }
  return ids[0];
}

/**
 * A motif per kind of system, so eleven grounds don't come back as eleven
 * variations of the same haze. Keyed off the kicker, which already names the
 * domain in words the client agreed to.
 */
const MOTIFS = [
  [/\bai\b|resume/i, "slow refraction through a thick prism edge, light splitting into narrow bands"],
  [/iot|device|security/i, "a taut wire lattice receding into darkness, nodes catching the light"],
  [/marketplace|bidding/i, "large flat planes overlapping at shallow angles, like sheet metal stacked off-square"],
  [/commerce|d2c/i, "heavy matte fabric falling in two long folds, lit across the grain"],
  [/lms|exam|quiz|engagement/i, "dense strata of cut paper seen edge-on, each layer offset a few millimetres"],
  [/ott|series|music|topline/i, "volumetric haze cut by one hard shaft of light, dust suspended in it"],
  [/inventory|saas|billing/i, "translucent glass panels layered front to back, edges glowing where they meet"],
  [/childcare|mobile/i, "soft rounded volumes in shallow relief, a low sun raking across them"],
];

function motifFor(project) {
  const subject = `${project.kicker} ${project.category}`;
  return (
    MOTIFS.find(([pattern]) => pattern.test(subject))?.[1] ??
    "broad soft-edged planes drifting past one another in deep space"
  );
}

function promptFor(project) {
  return [
    "Abstract photographic backdrop for a design studio's case-study plate.",
    `Dominant colour ${project.accent} rendered against near-black #08080a; no other hue competes with it.`,
    `Subject: ${motifFor(project)}.`,
    "Soft directional light from the upper left. Shallow depth of field, fine film grain, matte surface, no gloss.",
    "Composition: all visual interest in the upper-left third; the lower-right two thirds fall away into calm, even darkness.",
    "Restrained, editorial, expensive. Landscape orientation.",
    "Strictly excluded: text, letters, numerals, logos, watermarks, user interfaces, screens, monitors, phones, laptops, devices, keyboards, hands, people, faces, charts, icons, mockups, collage, borders, frames.",
  ].join(" ");
}

const projects = selected(readProjects(), argv);
mkdirSync(OUT, { recursive: true });

const model = await resolveModel();
console.log(`ground model: ${model}\n`);

const failures = [];

for (const project of projects) {
  const target = `${OUT}/${project.slug}.jpg`;
  if (!force && existsSync(target)) {
    console.log(`  ·  ${project.slug} — ground exists (--force to regenerate)`);
    continue;
  }

  try {
    const { image } = await generateImage({
      model: gateway.imageModel(model),
      prompt: promptFor(project),
      aspectRatio: "16:9",
      providerOptions: { gateway: { tags: ["feature:shot-ground", "env:local"] } },
    });

    // Cover-crop to the plate: the ground is never seen at its own ratio, and
    // letting the browser scale a 4K generation is wasted bytes in the repo.
    const jpeg = await sharp(Buffer.from(image.uint8Array ?? image.uint8ArrayData))
      .resize(PLATE.width, PLATE.height, { fit: "cover", position: "left top" })
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();

    writeFileSync(target, jpeg);
    console.log(`  ✓  ${project.slug} — ${(jpeg.length / 1024).toFixed(0)} KB`);
  } catch (error) {
    const detail = error.statusCode ? `${error.statusCode} ${error.message}` : error.message;
    failures.push([project.slug, detail]);
    console.log(`  ✗  ${project.slug} — ${detail.split("\n")[0]}`);
  }
}

if (failures.length) {
  console.log(
    `\n${failures.length} ground(s) failed — those plates will use the gradient ground.`,
  );
  process.exit(1);
}
