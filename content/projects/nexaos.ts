import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "Independent",
  slug: "nexaos",
  name: "NexaOS",
  kicker: "AI PLATFORM — WORKFORCE OS",
  category: "AI Agent Platform",
  year: "2026",
  accent: "#4F46E5",
  client: "Personal project",
  role: "Solo · Architecture, API and web",
  status: "In development · phase one",
  domain: "github.com/Harshil0207/NexaOS",
  url: "https://github.com/Harshil0207/NexaOS",
  summary:
    "A multi-tenant platform where organisations build, run and govern AI agents that do real work — and leave a complete, auditable history of every step they took.",
  about:
    "A Next.js web app talks to a NestJS API through a same-origin streaming proxy. The API owns auth, organisations, role-based access, versioned agents, the tool registry, audit and usage; PostgreSQL with pgvector stores it through Drizzle. Running an agent never happens inside a request: the API freezes the agent's configuration, enqueues the run on BullMQ over Redis, and a separate worker process executes it — calling the model, validating and running permitted tools, and streaming every event back to the browser over server-sent events.",
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind",
    "TanStack Query",
    "NestJS",
    "Drizzle ORM",
    "PostgreSQL",
    "pgvector",
    "Redis",
    "BullMQ",
    "Claude API",
    "Zod",
    "OpenTelemetry",
    "pino",
    "Vitest",
    "Playwright",
  ],
  features: [
    { title: "Organisations and RBAC", note: "Multi-tenant workspaces with role-based permissions" },
    { title: "Versioned agents", note: "Drafts and published versions, with config frozen per run" },
    { title: "Tool registry", note: "Allowlisted tools checked against org, caller and schema" },
    { title: "Queued runtime", note: "Runs on a BullMQ worker, with a sweeper that recovers stuck ones" },
    { title: "Live execution timeline", note: "Every model call and tool step streamed over SSE" },
    { title: "Audit, usage and cost", note: "Who ran what, with which version, and what it cost" },
  ],
  architecture: [
    {
      title: "Agents never run inside a request",
      body: "Starting a run returns immediately with a queued execution; the work happens on a worker that can retry, time out and recover without holding a browser connection open. The browser follows along over a resumable event stream, so a dropped connection picks up where it left off instead of losing the run.",
    },
    {
      title: "Every tool call is checked four times",
      body: "Before a tool runs, the worker confirms it is allowlisted, enabled for the organisation, permitted for the person who started the run, and called with arguments that match its schema. A model can ask for anything; only what passes all four is executed.",
    },
  ],
  engineeringNote:
    "Phase one is a vertical slice on purpose: auth to audit, end to end and tested, before knowledge, workflows and approvals. Navigation for the later phases stays hidden until they exist, so nothing on screen promises what the platform cannot do yet.",
  outcomes: [
    { label: "Tenancy", value: "Multi-org" },
    { label: "Runtime", value: "Queued workers" },
    { label: "Streaming", value: "Server-sent events" },
    { label: "Stage", value: "Vertical slice" },
  ],
});
