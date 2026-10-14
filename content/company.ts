export const company = {
  name: "Harshil Gohil",
  shortName: "HG",
  tagline: "Full-stack developer",
  role: "Portfolio · 2024—2026",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "",
  github: "https://github.com/Harshil0207",
  githubLabel: "github.com/Harshil0207",
  x: "https://x.com/Harshil_2703_",
  xLabel: "@Harshil_2703_",
  showcase: "https://harshil-haunted-portfolio.vercel.app",
  showcaseLabel: "Hollow Manor — 3D portfolio",
  address: {
    city: "Surat",
    region: "Gujarat",
    country: "IN",
  },
} as const;

export const contactHref = company.email ? `mailto:${company.email}` : company.x;

export const copy = {
  heroBody:
    "Full-stack developer in Surat. I build complete products — data model and API through to the interface people actually use — and bring some of them to life with 3D and AI.",
  capabilitiesTitle: "What I build with.",
  capabilitiesBody:
    "The stack is chosen per problem, not per habit — but this is the ground I cover again and again, and where the depth is.",
  processTitle: "How I work.",
  processBody:
    "Four stages, in this order, on every build. The order is the opinion.",
  testimonialsTitle: "Where I've worked.",
  contactTitle: "Have something to build",
  contactBody:
    "Send the problem, the deadline and the constraint you can't move. You will get a developer's answer, not a brochure.",
} as const;
