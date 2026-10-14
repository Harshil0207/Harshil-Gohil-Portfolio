import { defineProject } from "../project-schema";

export default defineProject({
  agency: "SSVL Technologies",
  slug: "softys",
  name: "Softys",
  kicker: "ADMIN — USERS AND TICKETS",
  category: "Admin Dashboard",
  year: "2025",
  accent: "#7C3AED",
  client: "SSVL Technologies",
  role: "Solo · Full-stack build",
  status: "Source · on GitHub",
  domain: "github.com/Harshil0207/Softys-Admin-Page",
  url: "https://github.com/Harshil0207/Softys-Admin-Page",
  summary: "A full MERN admin panel for managing users and support tickets, with a secure admin login.",
  about: "Built solo. The frontend, in React with Material UI and Tailwind, has an admin login, a dashboard, a user list with detail pages, link editing and settings, with public and protected routes. The Express API on MongoDB is layered into routes, controllers and services for admin login, users and tickets, with JWT auth, bcrypt, file uploads, central error handling and a small cache.",
  stack: ["React", "Vite", "Material UI", "Tailwind", "Framer Motion", "Node.js", "Express", "MongoDB", "Mongoose", "JWT", "Multer"],
  features: [
    { title: "User management", note: "User list and detail pages" },
    { title: "Tickets", note: "Support tickets stored and served by the API" },
    { title: "Guarded routes", note: "Public and protected routes for the admin" },
    { title: "Layered API", note: "Routes, controllers and services kept separate" },
  ],
  outcomes: [
    { label: "Stack", value: "MERN" },
    { label: "Type", value: "Admin panel" },
  ],
});
