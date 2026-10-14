import { defineProject } from "../project-schema";

export default defineProject({
  agency: "SSVL Technologies",
  slug: "surgent-studio",
  name: "Surgent Studio",
  kicker: "STUDIO SITE — CREATIVE AGENCY",
  category: "Studio Website",
  year: "2025",
  accent: "#BE123C",
  client: "SSVL Technologies",
  role: "Solo · Design and frontend",
  status: "Source · on GitHub",
  domain: "github.com/Harshil0207/Surgent-Studio",
  url: "https://github.com/Harshil0207/Surgent-Studio",
  summary: "A website for a creative studio — its story, values, projects, news, careers and contact.",
  about: "Built solo with React, Vite and Tailwind, with GSAP and AOS for animation, Lenis for smooth scrolling and slick carousels. The about section is split into story, values and photos, and separate pages cover projects, news, careers and contact.",
  stack: ["React", "Vite", "React Router", "Tailwind", "GSAP", "AOS", "Lenis", "slick-carousel"],
  features: [
    { title: "About the studio", note: "Story, values and photo pages" },
    { title: "Projects and news", note: "Project and news pages" },
    { title: "Careers", note: "A careers page for open roles" },
    { title: "Motion", note: "GSAP, AOS and Lenis smooth scrolling" },
  ],
  outcomes: [
    { label: "Built", value: "Solo" },
    { label: "Type", value: "Studio site" },
  ],
});
