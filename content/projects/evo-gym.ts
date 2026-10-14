import { defineProject } from "../project-schema";

export default defineProject({
  agency: "Independent",
  slug: "evo-gym",
  name: "Evo Gym",
  kicker: "LANDING PAGE — FITNESS CLUB",
  category: "Marketing Site",
  year: "2025",
  accent: "#E11D48",
  client: "Personal project",
  role: "Solo · Design and frontend",
  status: "Live · on Vercel",
  domain: "evo-gym-six.vercel.app",
  url: "https://evo-gym-six.vercel.app",
  summary: "An animated single-page site for a gym — hero, benefits, classes and a contact form, with every section sliding in as you scroll.",
  about: "Written in TypeScript with React and Vite and styled with Tailwind. The page is split into scenes — navbar, home, benefits, classes, contact and footer — each its own component, with the navbar tracking which section is in view and anchor links scrolling smoothly to it. Framer Motion handles the entrance animations, React Hook Form validates the contact form, and a media-query hook switches the navigation to a mobile menu on small screens.",
  stack: ["React", "TypeScript", "Vite", "Tailwind", "Framer Motion", "React Hook Form", "Heroicons", "Vercel"],
  features: [
    { title: "Scene-based layout", note: "Each section is its own component and scroll target" },
    { title: "Active navigation", note: "The navbar follows the section currently in view" },
    { title: "Entrance motion", note: "Framer Motion reveals as each section arrives" },
    { title: "Classes rail", note: "A horizontal scroller of classes with hover details" },
    { title: "Validated contact form", note: "React Hook Form with inline errors" },
    { title: "Responsive menu", note: "A mobile menu switched by a media-query hook" },
  ],
  outcomes: [
    { label: "Type", value: "Single page" },
    { label: "Language", value: "TypeScript" },
    { label: "Motion", value: "Framer Motion" },
  ],
});
