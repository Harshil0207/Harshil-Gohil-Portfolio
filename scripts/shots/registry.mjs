/**
 * Reads the project registry from outside the bundle.
 *
 * The shot pipeline runs as plain Node, so it can't import the TypeScript
 * registry. It parses the same two sources of truth `check-projects.mjs` does —
 * the order array in `index.ts` and the fields in each project file — so a
 * project never has to be listed a third time just to get a screenshot.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/projects";

function field(source, name) {
  const match = source.match(new RegExp(`^\\s+${name}:\\s*"([^"]*)"`, "m"));
  return match?.[1];
}

/** Registry order, resolved through the import identifiers to slugs. */
function order() {
  const source = readFileSync(join(DIR, "index.ts"), "utf8");

  const identifiers = new Map();
  for (const match of source.matchAll(/^import\s+(\w+)\s+from\s+"\.\/([\w-]+)";/gm)) {
    identifiers.set(match[1], match[2]);
  }

  const block = source.match(/const registered:[^=]*=\s*\[([\s\S]*?)\];/);
  if (!block) throw new Error(`${DIR}/index.ts: could not find the registered array`);

  return block[1]
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((identifier) => {
      const slug = identifiers.get(identifier);
      if (!slug) throw new Error(`${DIR}/index.ts: ${identifier} is registered but not imported`);
      return slug;
    });
}

export function readProjects() {
  return order().map((slug, position) => {
    const source = readFileSync(join(DIR, `${slug}.ts`), "utf8");
    return {
      slug,
      index: String(position + 1).padStart(2, "0"),
      name: field(source, "name"),
      kicker: field(source, "kicker"),
      category: field(source, "category"),
      year: field(source, "year"),
      accent: field(source, "accent"),
      status: field(source, "status"),
      domain: field(source, "domain"),
      url: field(source, "url"),
      image: field(source, "image"),
    };
  });
}

/** Narrows to the slugs named on the command line, or returns everything. */
export function selected(projects, argv) {
  const named = argv.filter((arg) => !arg.startsWith("-"));
  if (named.length === 0) return projects;

  return named.map((slug) => {
    const project = projects.find((candidate) => candidate.slug === slug);
    if (!project) throw new Error(`no project named "${slug}" in the registry`);
    return project;
  });
}
