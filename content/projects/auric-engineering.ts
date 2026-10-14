import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "SSVL Technologies",
  slug: "auric-engineering",
  name: "Auric Engineering",
  kicker: "CORPORATE SITE — FORGING MANUFACTURER",
  category: "Corporate Website",
  year: "2025",
  accent: "#B8860B",
  client: "SSVL Technologies",
  role: "Solo · Design and frontend",
  status: "Live · on Vercel",
  domain: "auric-engineering.vercel.app",
  url: "https://auric-engineering.vercel.app",
  summary:
    "A corporate website for a forged-fittings manufacturer — the full product range, manufacturing capacity, quality control and an investor section, presented with an industrial, premium feel.",
  about:
    "Built with React and Vite, routed with React Router and styled in Tailwind. Every product line — weld neck, slip-on, socket weld, threaded, lap joint, blind, reducing and plate flanges, forged fittings and more — has its own page. Around the catalogue sit pages for manufacturing, capacity, quality control, about, contact with an embedded map, and an investor section with financials and shareholding. Motion comes from GSAP and Framer Motion, scrolling from Lenis, the particle background from OGL, and micro-animations from Lottie.",
  stack: [
    "React",
    "Vite",
    "React Router",
    "Tailwind",
    "GSAP",
    "Framer Motion",
    "Lenis",
    "OGL",
    "Lottie",
    "Vercel",
  ],
  features: [
    { title: "Product catalogue", note: "A dedicated page for each flange and fitting line" },
    { title: "Manufacturing story", note: "Process, capacity and quality-control pages" },
    { title: "Investor section", note: "Financials and shareholding pages" },
    { title: "Particle hero", note: "A WebGL particle field rendered with OGL" },
    { title: "Smooth motion", note: "GSAP reveals and Lenis scrolling throughout" },
    { title: "Contact and map", note: "Contact details with an embedded location map" },
  ],
  architecture: [
    {
      title: "One page per product line",
      body: "Industrial buyers search for a specific fitting, not a brand story. Giving each product line its own route makes every one of them directly linkable and searchable, instead of burying the range in one long catalogue page.",
    },
    {
      title: "A small kit of shared parts",
      body: "Headings, cards, sections and containers are shared components, so a large number of product pages stay visually consistent and a design change lands everywhere at once.",
    },
  ],
  engineeringNote:
    "Heavy motion on a corporate site is a risk, so the WebGL is limited to one particle field and everything else is transform-based animation that stays smooth on office hardware.",
  outcomes: [
    { label: "Type", value: "Corporate site" },
    { label: "Sections", value: "Products · Quality · Investors" },
    { label: "Motion", value: "GSAP · Lenis · OGL" },
  ],
});
