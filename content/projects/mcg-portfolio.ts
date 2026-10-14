import { defineProject } from "../project-schema";

export default defineProject({
  agency: "MulticodeGenius",
  slug: "mcg-portfolio",
  name: "MCG Portfolio",
  kicker: "PORTFOLIO — AGENCY CASE STUDIES",
  category: "Portfolio Website",
  year: "2026",
  accent: "#3CB7EA",
  client: "MulticodeGenius",
  role: "Full-stack developer · MulticodeGenius team",
  status: "Client work · private",
  summary: "MulticodeGenius's client portfolio — a cinematic single-page index of shipped systems with a deep case study for each, and the design this site is built on.",
  about: "A Next.js App Router site with Tailwind, GSAP and Lenis for motion, and three.js on the case-study hero. Every project is one typed file in a registry that checks itself at build time: duplicate accent colours, missing screenshots, leftover scaffold markers and unsourced figures all fail the build. Index screenshots come from a pipeline that captures the live site with Playwright and composites it onto a plate rendered from the project's own colour, refusing captures that turn out to be consent walls or error pages.",
  stack: ["Next.js", "React", "TypeScript", "Tailwind", "GSAP", "Lenis", "Three.js", "React Three Fiber", "Playwright", "sharp"],
  features: [
    { title: "Project registry", note: "One typed file per project, validated when the site builds" },
    { title: "Case-study pages", note: "A full page per project with stack, decisions and specs" },
    { title: "Shot pipeline", note: "Live-site captures composited onto generated plates" },
    { title: "Themes and palettes", note: "Light and dark themes with swappable colour palettes" },
    { title: "Smooth motion", note: "Lenis scrolling and GSAP scroll-linked reveals" },
    { title: "Scaffold command", note: "A new project is one command and one file" },
  ],
  architecture: [
    {
      title: "The build refuses bad content",
      body: "A number without a source, a duplicate colour or a missing screenshot is a build error, not a review comment. Moving those checks into code means the portfolio cannot quietly drift from the truth.",
    },
  ],
  outcomes: [
    { label: "Framework", value: "Next.js" },
    { label: "Motion", value: "GSAP · Lenis" },
    { label: "Content", value: "Typed registry" },
  ],
});
