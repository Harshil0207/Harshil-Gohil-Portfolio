import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "Independent",
  slug: "draftboard",
  name: "Draftboard",
  kicker: "DESKTOP APP — DESIGN TOOL",
  category: "Desktop Design Tool",
  year: "2026",
  accent: "#DB2777",
  client: "Personal project",
  role: "Solo · Desktop app",
  status: "Source · Windows build",
  domain: "github.com/Harshil0207/Figma-clone",
  url: "https://github.com/Harshil0207/Figma-clone",
  summary:
    "A Figma-style design tool that runs as a desktop app — sign in, manage files on a dashboard, and design on an infinite canvas with layers, frames and smart guides.",
  about:
    "Built with Electron, React, TypeScript, Konva and Zustand. The whole design is data: a document holds pages and a flat map of nodes, each with its parent, position, size, rotation, fills, strokes and effects. Konva only draws that data, and each layer subscribes to its own entry so only what changed re-renders. Every edit produces a new immutable document, which makes undo and redo a stack of documents. Files autosave shortly after each change and write a thumbnail for the dashboard, and accounts are stored locally with hashed passwords.",
  stack: [
    "Electron",
    "React",
    "TypeScript",
    "Konva",
    "React Konva",
    "Zustand",
    "Vite",
    "Electron Forge",
  ],
  features: [
    { title: "Infinite canvas", note: "Frames, shapes, images and groups with nesting and reordering" },
    { title: "Smart guides", note: "Snapping, selection handles and hover outlines in screen space" },
    { title: "Undo and redo", note: "One step per gesture, from a stack of immutable documents" },
    { title: "File dashboard", note: "Create, rename, duplicate, favourite, trash, import and export" },
    { title: "Autosave", note: "Saved after every change, with a thumbnail for the dashboard" },
    { title: "Local accounts", note: "Hashed passwords and an optional thirty-day session" },
  ],
  architecture: [
    {
      title: "The design is data, the canvas just draws it",
      body: "Nothing lives inside the canvas library. The document is plain data with a flat map of nodes, so grouping, reparenting and reordering are pure functions that are easy to test, and the renderer can be swapped without touching the model.",
    },
    {
      title: "One narrow bridge to the file system",
      body: "The interface never touches disk. A single preload script exposes a typed API, and every channel the UI can call is registered in one place in the main process — so the renderer stays a sandboxed web page and the surface that can write files is small enough to read.",
    },
  ],
  engineeringNote:
    "Gestures rebuild the document from its state when the drag started, then record one undo step at the end. It avoids a hundred undo entries per drag and the drift you get from applying deltas on top of deltas.",
  outcomes: [
    { label: "Platform", value: "Windows desktop" },
    { label: "Renderer", value: "Konva" },
    { label: "History", value: "Immutable undo" },
  ],
});
