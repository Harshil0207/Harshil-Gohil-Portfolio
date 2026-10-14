import { readFile } from "node:fs/promises";
import path from "node:path";
import { projectsByYear } from "@/content/projects";

export const dynamic = "force-static";

export async function GET() {
  const template = await readFile(
    path.join(process.cwd(), "app", "v1", "index.html"),
    "utf8",
  );
  const data = projectsByYear.map((project) => ({
    slug: project.slug,
    name: project.name,
    kicker: project.kicker,
    category: project.category,
    year: project.year,
    agency: project.agency,
    accent: project.accent,
    summary: project.summary,
    place: `${project.category} · ${project.agency} · ${project.year}`,
    image: project.image ?? "",
    url: project.url ?? "",
    domain: project.domain ?? "",
  }));
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  const html = template.replace("/*__PROJECTS__*/[]", json);
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
