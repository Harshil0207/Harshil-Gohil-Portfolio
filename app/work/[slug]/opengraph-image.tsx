import { ImageResponse } from "next/og";
import { company } from "@/content/company";
import { getProject, projects } from "@/content/projects";

export const alt = "Harshil Gohil — case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return new ImageResponse(<div style={{ background: "#0a0a0a" }} />, size);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#fafaf9",
          padding: 72,
          fontFamily: "sans-serif",
          borderTop: `16px solid ${project.accent}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(250,250,249,0.55)",
          }}
        >
          <span>{company.name}</span>
          <span>{`No. ${project.index} · ${project.year}`}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: project.accent,
              marginBottom: 20,
            }}
          >
            {project.kicker}
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            {`${project.name}.`}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "rgba(250,250,249,0.62)",
              marginTop: 26,
              maxWidth: 900,
            }}
          >
            {project.summary}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "rgba(250,250,249,0.55)",
          }}
        >
          {project.stack.slice(0, 6).join("  ·  ")}
        </div>
      </div>
    ),
    size,
  );
}
