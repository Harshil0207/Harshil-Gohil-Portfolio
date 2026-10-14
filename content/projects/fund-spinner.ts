import { defineProject } from "../project-schema";

export default defineProject({
  agency: "SSVL Technologies",
  slug: "fund-spinner",
  name: "Fund Spinner",
  kicker: "FINANCE — LOANS AND ADVISORY SITE",
  category: "Financial Services",
  year: "2025",
  accent: "#0891B2",
  client: "SSVL Technologies",
  role: "Solo · Frontend",
  status: "Source · on GitHub",
  domain: "github.com/Harshil0207/Fund-Spinner",
  url: "https://github.com/Harshil0207/Fund-Spinner",
  summary: "A website for a financial services firm — a page for every loan type, mutual funds, life insurance, and income-tax and GST advisory, with lead and contact forms.",
  about: "Built solo with React, Vite and Tailwind. Each service has its own route: home, business, car, machinery, mortgage, personal, shop and project-finance loans, overdraft and cash credit, balance transfer, mutual funds, life insurance and tax advisory. Charts from Chart.js and Recharts explain the numbers, lazy-loaded sections and images keep pages light, and the site has a theme toggle, SEO tags per page and lead and contact forms backed by a shared form context.",
  stack: ["React", "Vite", "React Router", "Tailwind", "Framer Motion", "Chart.js", "Recharts"],
  features: [
    { title: "Service pages", note: "A dedicated page for each loan and advisory service" },
    { title: "Lead capture", note: "Lead and contact forms with shared form handling" },
    { title: "Charts", note: "Financial charts with Chart.js and Recharts" },
    { title: "Performance", note: "Lazy-loaded sections, images and forms" },
    { title: "SEO and themes", note: "Per-page SEO tags and a light and dark theme" },
  ],
  outcomes: [
    { label: "Built", value: "Solo" },
    { label: "Type", value: "Services site" },
  ],
});
