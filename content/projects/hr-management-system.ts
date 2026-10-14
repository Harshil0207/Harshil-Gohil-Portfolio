import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "SSVL Technologies",
  slug: "hr-management-system",
  name: "HR Management System",
  kicker: "INTERNAL TOOL — PEOPLE, TIME AND WORK",
  category: "HR & Operations",
  year: "2025—2026",
  accent: "#0E7490",
  client: "SSVL Technologies",
  role: "Solo · Full-stack build",
  status: "Live · demo",
  domain: "human-resource-management-stsyem.vercel.app",
  url: "https://human-resource-management-stsyem.vercel.app",
  summary:
    "One system for running a software team day to day — attendance, leave, salary, projects, tasks and QA, with approvals and live notifications tying them together.",
  about:
    "A MERN build with a React and Vite frontend on Tailwind and Radix components, and an Express API on MongoDB. Attendance comes with policies, correction requests, late-entry penalties, carry-forward hours and a monthly hour buffer that feeds salary. Leave covers yearly allowances, monthly balances and carry-forward. Work is tracked as projects, stories and tasks with timers, comments, reopen history, blockers and a QA workflow. Approvals flow through one queue, notifications arrive over Socket.IO and email, scheduled jobs run on cron, and the API is documented with Swagger.",
  stack: [
    "React",
    "Vite",
    "Tailwind",
    "Radix UI",
    "React Hook Form",
    "Zod",
    "Recharts",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "Socket.IO",
    "JWT",
    "node-cron",
    "Nodemailer",
    "Swagger",
  ],
  features: [
    { title: "Attendance and hours", note: "Policies, correction requests, late penalties and hour buffers" },
    { title: "Leave management", note: "Yearly allowances, monthly balances and carry-forward" },
    { title: "Salary", note: "Salary setup tied to the hours actually recorded" },
    { title: "Projects to tasks", note: "Projects, stories and tasks with timers and comments" },
    { title: "QA and blockers", note: "A QA workflow, reopen history and tracked blockers" },
    { title: "Approvals and alerts", note: "One approval queue, live notifications and email" },
  ],
  architecture: [
    {
      title: "Time is the spine of the system",
      body: "Attendance, leave, task timers and salary all read from the same record of hours, so a late entry, an approved correction or a carried-forward balance changes what a person is paid without anyone re-keying it. Building the time model first is what let the other modules stay small.",
    },
    {
      title: "Scheduled work runs on the server",
      body: "Month-end rollovers, carry-forwards and reminders run as cron jobs on the API rather than waiting for someone to open a page. The system stays correct on the days nobody logs in.",
    },
  ],
  engineeringNote:
    "Built solo, which meant every module had to be understandable by one person at once. One route, one controller and one model per concept kept a large surface navigable.",
  outcomes: [
    { label: "Stack", value: "MERN" },
    { label: "Modules", value: "Time · Leave · Salary · Work" },
    { label: "Live updates", value: "Socket.IO" },
    { label: "API docs", value: "Swagger" },
  ],
});
