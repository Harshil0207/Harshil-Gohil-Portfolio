import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "Independent",
  slug: "two-eight-store",
  name: "Two Eight Store",
  kicker: "E-COMMERCE — STOREFRONT AND ADMIN",
  category: "E-commerce",
  year: "2026",
  accent: "#C2410C",
  client: "Personal project",
  role: "Solo · Storefront, admin and API",
  status: "Live · demo",
  domain: "two-eight-fe.vercel.app",
  url: "https://two-eight-fe.vercel.app",
  summary:
    "A complete online fashion store — shop, cart, checkout, accounts and wallet on one side, and a full admin console for products, orders, offers and staff on the other.",
  about:
    "The storefront is a Next.js app styled with styled-components and animated with GSAP, covering everything a real store needs: collections, search, product pages, wishlist, cart, checkout, order results, account pages and the policy pages around them. The admin lives in the same app and manages categories, products, customers, orders, payments, reviews, offers and the team. Behind both is an Express API on PostgreSQL through Sequelize — local Postgres in development, Supabase in production — with product media uploaded to Cloudinary.",
  stack: [
    "Next.js",
    "React",
    "styled-components",
    "Zustand",
    "GSAP",
    "Node.js",
    "Express",
    "PostgreSQL",
    "Sequelize",
    "Supabase",
    "Cloudinary",
    "JWT",
    "Zod",
    "Nodemailer",
    "Vercel",
  ],
  features: [
    { title: "Full storefront", note: "Collections, search, product pages, wishlist, cart and checkout" },
    { title: "Customer accounts", note: "Orders, saved addresses, settings, wallet and OTP verification" },
    { title: "Admin console", note: "Products, categories, orders, payments, reviews and offers" },
    { title: "Staff roles", note: "Super admin, admin and staff — only a super admin manages the team" },
    { title: "Rotating sessions", note: "Short access tokens with revocable, rotating refresh tokens" },
    { title: "Media pipeline", note: "Product images uploaded and served through Cloudinary" },
  ],
  architecture: [
    {
      title: "Customers and admins are different people",
      body: "Users and admins live in separate tables with separate logins, and the access token carries both who you are and what kind of account you are. A customer token can never reach an admin route by accident, and admin roles stay a concern of the admin table alone.",
    },
    {
      title: "Same schema, two databases",
      body: "The Sequelize models are the single source of truth for the schema. Development runs against local Postgres and production against Supabase from the same models, so the database a feature was built on is the one it ships to.",
    },
  ],
  engineeringNote:
    "Refresh tokens are stored so they can be revoked, and each refresh replaces the last one. It is more work than a long-lived token, and it is the difference between logging someone out and hoping they log themselves out.",
  outcomes: [
    { label: "Surfaces", value: "Store · Admin · API" },
    { label: "Database", value: "PostgreSQL" },
    { label: "Admin roles", value: "Super admin · Admin · Staff" },
  ],
});
