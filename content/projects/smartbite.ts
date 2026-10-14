import { defineProject } from "../project-schema";

export default defineProject({
  agency: "SSVL Technologies",
  slug: "smartbite",
  name: "SmartBite",
  kicker: "FOOD APP — ADMIN AND BACKEND",
  category: "Diet & Food App",
  year: "2025",
  accent: "#84CC16",
  client: "SSVL Technologies",
  role: "Solo · Admin and backend",
  status: "Source · on GitHub",
  domain: "github.com/Harshil0207/SmartBite-DietFood-App-",
  url: "https://github.com/Harshil0207/SmartBite-DietFood-App-",
  summary: "The admin panel and backend for a diet-food app — recipes, customers, inventory and a calendar for the team, and OTP login and food preferences for users.",
  about: "Built solo. The admin panel, in React with Tailwind, Framer Motion and Lottie, covers a dashboard, recipe creation with image inputs, customers, inventory and a calendar. The Express API on MongoDB handles admin auth, food and recipe records, OTP-based login and per-user food preferences, with separate development, staging and production environments and written API documentation.",
  stack: ["React", "Vite", "Tailwind", "Framer Motion", "Lottie", "Node.js", "Express", "MongoDB", "Mongoose", "JWT", "Multer"],
  features: [
    { title: "Recipe management", note: "Create recipes with images and manage the list" },
    { title: "Customers and inventory", note: "Customer list and inventory pages" },
    { title: "OTP login", note: "One-time-password login for app users" },
    { title: "User preferences", note: "Food preferences stored per user" },
    { title: "Three environments", note: "Development, staging and production configs" },
  ],
  outcomes: [
    { label: "Scope", value: "Admin · API" },
    { label: "Database", value: "MongoDB" },
  ],
});
