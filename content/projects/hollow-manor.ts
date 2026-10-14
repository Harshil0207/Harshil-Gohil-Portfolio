import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "Independent",
  slug: "hollow-manor",
  name: "Hollow Manor",
  kicker: "3D WEB — WALK-THROUGH PORTFOLIO",
  category: "3D Web Experience",
  year: "2026",
  accent: "#5B3E8C",
  client: "Personal project",
  role: "Solo · Blender pipeline and web",
  status: "Live · on Vercel",
  domain: "harshil-haunted-portfolio.vercel.app",
  url: "https://harshil-haunted-portfolio.vercel.app",
  summary:
    "A haunted house you can walk through in the browser — a full Blender scene rebuilt as a React Three Fiber site, with the portfolio told stop by stop through the rooms.",
  about:
    "The scene is authored in Blender and never edited for the web by hand. A scripted pipeline drops hidden helpers, records cobwebs, fog and particles to a data file, decimates heavy meshes, packs each chunk of the house into one shared lightmap atlas, and bakes every light and its bounce with Cycles. The bakes are denoised, each chunk is joined into a single mesh and exported as glTF, then compressed with meshopt and WebP through glTF Transform. The site loads those chunks into React Three Fiber, moves the camera between named viewpoints, and replays the recorded effects on top.",
  stack: [
    "React",
    "TypeScript",
    "Vite",
    "Three.js",
    "React Three Fiber",
    "drei",
    "three-mesh-bvh",
    "Blender",
    "Cycles",
    "Python",
    "glTF Transform",
    "meshopt",
    "Vercel",
  ],
  features: [
    { title: "Walk-through story", note: "The portfolio told room by room through named camera stops" },
    { title: "Baked lighting", note: "Every light and bounce baked into one lightmap atlas per chunk" },
    { title: "Chunked scene", note: "The house split into chunks so each one loads and bakes alone" },
    { title: "Recorded effects", note: "Cobwebs, fog and particles exported as data, replayed live" },
    { title: "Compressed assets", note: "meshopt geometry and WebP textures via glTF Transform" },
    { title: "One-command rebuild", note: "Re-bake the whole house or a single chunk from the source file" },
  ],
  architecture: [
    {
      title: "Bake once, render cheap",
      body: "Real-time lighting for a scene with this many lights would bring an ordinary laptop to its knees. So the light is computed offline in Cycles and painted into lightmaps, and the browser only draws textured meshes. The cost is that the lighting is fixed; the payoff is a scene that holds its frame rate on integrated graphics.",
    },
    {
      title: "The .blend file is the source of truth",
      body: "Nothing in the web build is hand-tuned. Every asset is regenerated from the Blender file by scripts, so changing a room means editing the scene and rerunning the pipeline — not patching exported files that drift from the original.",
    },
  ],
  engineeringNote:
    "A 3D portfolio is only impressive if it actually runs. Most of the work here is not in the scene but in the pipeline that makes it light enough to open on the machine a recruiter happens to be using.",
  outcomes: [
    { label: "Lighting", value: "Baked" },
    { label: "Assets", value: "meshopt · WebP" },
    { label: "Runs on", value: "Any modern browser" },
  ],
});
