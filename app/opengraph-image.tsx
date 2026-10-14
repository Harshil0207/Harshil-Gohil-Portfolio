import { ImageResponse } from "next/og";
import { company } from "@/content/company";

export const alt = "Harshil Gohil — Full-stack developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
          <span>Full-stack developer · Surat, India</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            Full-stack,
          </div>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            3D and AI.
          </div>
          <div
            style={{
              width: 220,
              height: 8,
              marginTop: 28,
              background: "#2f5bea",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(250,250,249,0.55)",
          }}
        >
          Data model to interface · real-time · 3D web · AI
        </div>
      </div>
    ),
    size,
  );
}
