import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "MulticodeGenius",
  slug: "resumedone",
  name: "ResumeDone",
  kicker: "AI SAAS — RESUME BUILDER",
  category: "Resume Builder",
  year: "2024",
  accent: "#2F5BEA",
  client: "ResumeDone",
  role: "Full-stack developer · MulticodeGenius team",
  status: "Live · in production",
  domain: "resumedone.co",
  url: "https://resumedone.co",
  summary:
    "A production-grade AI resume builder, built from scratch — OpenAI writes the content, and Cloud Vision OCR reads the resume the user already has.",
  about:
    "Node.js + Koa behind a GraphQL API, with DynamoDB for hot reads, MongoDB for documents and Elasticsearch for search. OpenAI GPT generates and rephrases bullet points; Cloud Vision OCR auto-fills the builder from an uploaded PDF. Exports render through Pdfcrowd and Puppeteer on GCP Cloud Tasks, and billing is a standalone three-gateway microservice.",
  stack: [
    "Node.js",
    "Koa.js",
    "GraphQL",
    "Next.js",
    "React",
    "OpenAI",
    "DynamoDB",
    "MongoDB",
    "Elasticsearch",
    "AWS S3",
    "GCP",
    "Stripe",
    "FastSpring",
    "Puppeteer",
    "Pdfcrowd",
  ],
  features: [
    { title: "AI content engine", note: "OpenAI GPT writes and enhances resume copy" },
    { title: "OCR resume parsing", note: "Cloud Vision extracts data from uploaded PDFs" },
    { title: "PDF generation", note: "Pdfcrowd and Puppeteer, pixel-perfect export" },
    { title: "Billing microservice", note: "Stripe, FastSpring and Solid gateways" },
    { title: "Elasticsearch", note: "Full-text search across resumes and templates" },
    { title: "Multi-cloud storage", note: "AWS S3 with GCP Cloud Storage and Tasks" },
  ],
  architecture: [
    {
      title: "Multi-DB by design",
      body: "DynamoDB for hot reads, MongoDB for the document store, Elasticsearch for search — the right tool per access pattern instead of one database doing all three.",
    },
    {
      title: "Billing as a microservice",
      body: "Three gateways behind one service with idempotent webhooks. Subscription state lives in one place; the application reads it and never writes it.",
    },
  ],
  engineeringNote:
    "Multi-database isn't a flex, it's a maintenance tax — each store needs its own write path, its own backup story, its own observability. Worth it for read patterns this divergent.",
  outcomes: [
    { label: "Active users", value: "10k+" },
    { label: "User rating", value: "4.8 / 5" },
    { label: "Week-1 retention", value: "65%" },
  ],
  outcomesFootnote: "Figures as published by the client.",
  image: "/work/resumedone.jpg",
  imageAlt:
    "ResumeDone landing page showing an AI resume builder with import and create options",
});
