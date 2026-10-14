#!/usr/bin/env node
/**
 * Scaffolds a project file and registers it.
 *
 *   npm run new:project -- <slug> "Client Name"
 *
 * Writes content/projects/<slug>.ts with every required field present and
 * marked TODO, adds the import and the registry entry in the right places, and
 * prints what a breakdown document cannot supply — the ink, the screenshot and
 * the public URL. The checker refuses to build while a TODO remains, so a
 * half-filled project cannot ship by accident.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const [slug, clientArg] = process.argv.slice(2);

if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run new:project -- <slug> "Client Name"');
  console.error("The slug is lowercase words joined by dashes, e.g. acme-portal");
  process.exit(1);
}

const DIR = "content/projects";
const file = join(DIR, `${slug}.ts`);
const REGISTRY = join(DIR, "index.ts");

if (existsSync(file)) {
  console.error(`${file} already exists — edit it instead.`);
  process.exit(1);
}

const client = clientArg ?? "TODO client name";
const identifier = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

writeFileSync(
  file,
  `import { defineProject } from "../project-schema";

export default defineProject({
  slug: "${slug}",
  name: "TODO name",
  kicker: "TODO CATEGORY — TODO SUBTITLE",
  category: "TODO category",
  year: "TODO year",
  // Unique across the registry; the build fails on a duplicate.
  accent: "#000000",
  client: ${JSON.stringify(client)},
  role: "TODO role, e.g. Full-stack build · Web + API",
  // Only what is true: "Live · in production", "Deployed · in active development".
  status: "TODO status",
  // domain and url together, once the system has a public address of its own.
  summary:
    "TODO one sentence a non-technical reader understands.",
  about:
    "TODO how it was built — the paragraph under the title.",
  stack: ["TODO"],
  features: [
    { title: "TODO", note: "TODO" },
    { title: "TODO", note: "TODO" },
    { title: "TODO", note: "TODO" },
    { title: "TODO", note: "TODO" },
    { title: "TODO", note: "TODO" },
    { title: "TODO", note: "TODO" },
  ],
  architecture: [
    {
      title: "TODO decision worth defending",
      body: "TODO what it bought and what it cost.",
    },
    {
      title: "TODO second decision",
      body: "TODO what it bought and what it cost.",
    },
  ],
  engineeringNote:
    "TODO the thing an engineer would nod at.",
  // Two to four. A figure needs outcomesFootnote saying who published it.
  outcomes: [
    { label: "TODO", value: "TODO" },
    { label: "TODO", value: "TODO" },
    { label: "TODO", value: "TODO" },
    { label: "TODO", value: "TODO" },
  ],
  // image and imageAlt once a 1112x709 screenshot lands in public/work/.
});
`,
);

let registry = readFileSync(REGISTRY, "utf8");
const importLine = `import ${identifier} from "./${slug}";`;
const imports = registry.match(/^import .+ from "\.\/.+";$/gm) ?? [];
const anchor = imports[imports.length - 1];

if (anchor && !registry.includes(importLine)) {
  registry = registry.replace(anchor, `${anchor}\n${importLine}`);
}
registry = registry.replace(/(\n)(\];\n)/, `$1  ${identifier},\n$2`);
writeFileSync(REGISTRY, registry);

console.log(`
✓ ${file}
✓ registered in ${REGISTRY}

Fill in every TODO, then supply the three things a breakdown document never has:

  1. accent  — the client's ink, unlike the seven already taken
  2. image   — a 1112x709 screenshot at public/work/${slug}.jpg, plus imageAlt
               (leave both out and a typographic panel carries the slot)
  3. url     — the public address, with domain; omit both if there isn't one

Then: npm run check:projects
`);
