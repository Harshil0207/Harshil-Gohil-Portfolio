#!/usr/bin/env node
/**
 * Checks the project registry from outside the bundle.
 *
 * The registry itself asserts what it can see (duplicate inks, outcome counts,
 * unfootnoted figures). This covers what a module can't: a file nobody
 * registered, a screenshot that was declared but never added, a scaffolded stub
 * that still has its TODO markers in it. Runs on `npm run build` via prebuild.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/projects";
const REGISTRY = join(DIR, "index.ts");

const problems = [];
const notes = [];

const registry = readFileSync(REGISTRY, "utf8");
const files = readdirSync(DIR)
  .filter((name) => name.endsWith(".ts") && name !== "index.ts")
  .sort();

if (files.length === 0) problems.push(`${DIR}: no project files found`);

for (const file of files) {
  const slug = file.replace(/\.ts$/, "");
  const where = join(DIR, file);
  const source = readFileSync(where, "utf8");

  // A file the registry never imports is invisible to the site, which is a
  // silent failure — the project simply never appears.
  if (!registry.includes(`from "./${slug}"`)) {
    problems.push(`${where}: not imported by ${REGISTRY} — the project will not appear`);
  }

  const declaredSlug = source.match(/slug:\s*"([^"]+)"/)?.[1];
  if (declaredSlug !== slug) {
    problems.push(`${where}: declares slug "${declaredSlug}" but the filename says "${slug}"`);
  }

  if (/TODO/.test(source)) {
    problems.push(`${where}: still contains TODO markers from the scaffold`);
  }

  const image = source.match(/image:\s*"([^"]+)"/)?.[1];
  if (image) {
    const onDisk = join("public", image);
    if (!existsSync(onDisk)) {
      problems.push(`${where}: declares image ${image} but ${onDisk} does not exist`);
    }
  } else {
    notes.push(`${slug}: no screenshot yet — the stand-in panel is carrying its slot`);
  }

  if (!/url:\s*"/.test(source)) {
    notes.push(`${slug}: no public URL yet — the case study shows no live-site link`);
  }
}

for (const note of notes) console.log(`  note  ${note}`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s) in the project registry:\n`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  console.error("");
  process.exit(1);
}

console.log(`\n✓ ${files.length} projects registered and consistent\n`);
