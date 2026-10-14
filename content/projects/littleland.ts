import { defineProject } from "../project-schema";

export default defineProject({
  agency: "SSVL Technologies",
  slug: "littleland",
  name: "Littleland",
  kicker: "E-COMMERCE — TOYS AND BOOKS",
  category: "E-commerce",
  year: "2025",
  accent: "#F59E0B",
  client: "SSVL Technologies",
  role: "Solo · Full-stack build",
  status: "Source · on GitHub",
  domain: "github.com/Harshil0207/LittleLand-Toys-and-Books",
  url: "https://github.com/Harshil0207/LittleLand-Toys-and-Books",
  summary: "A toys and books shop with a full MERN backend and a separate admin panel for adding and managing the catalogue.",
  about: "Built solo across three parts: a storefront, an admin panel and an Express API on MongoDB. The admin, built with React, Tailwind and Framer Motion, has a login, a dashboard, a paginated product table, add and edit forms and toast feedback. The API manages categories, subcategories and products with image uploads through Multer, JWT authentication and bcrypt-hashed passwords, and the catalogue was seeded from CSV files grouped by age.",
  stack: ["React", "Vite", "Tailwind", "Framer Motion", "Axios", "Node.js", "Express", "MongoDB", "Mongoose", "JWT", "Multer"],
  features: [
    { title: "Admin panel", note: "Dashboard, product table, add and edit products" },
    { title: "Catalogue structure", note: "Categories and subcategories, sorted by age group" },
    { title: "Image uploads", note: "Product images uploaded with Multer" },
    { title: "Secure login", note: "JWT auth with bcrypt-hashed passwords" },
  ],
  outcomes: [
    { label: "Stack", value: "MERN" },
    { label: "Surfaces", value: "Store · Admin · API" },
  ],
});
