import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "MulticodeGenius",
  slug: "marova-essence",
  name: "Marova Essence",
  kicker: "D2C COMMERCE — WEB, APP AND ADMIN",
  category: "D2C Commerce",
  year: "2025",
  accent: "#8A5A2B",
  client: "Marova",
  role: "Full-stack developer · MulticodeGenius team",
  status: "Live · in production",
  domain: "marovaessence.com",
  url: "https://marovaessence.com",
  summary:
    "A direct-to-consumer commerce platform across three surfaces — a Next.js storefront with its own admin console, a React Native app, and an API that turns a paid order into a booked courier, a PDF invoice and a lifecycle email programme.",
  about:
    "The product catalogue lives in Sanity and is read straight from it by the storefront, the mobile app and the API alike, so browsing never touches the transactional path and marketing publishes without a deploy. Everything that involves money or identity goes through an Express 5 API on Cloud Run over PostgreSQL: carts, coupons, GST and shipping, orders, reviews and three ways to sign in, including phone OTP with a cron job clearing expired codes. Access tokens are encrypted rather than merely signed, so the role inside them is opaque to whoever holds one. PhonePe takes payment on both web and mobile through one server-side integration, Shiprocket books the courier and reports tracking back, Puppeteer renders the invoice, and nine transactional emails carry the order from abandoned cart to review reminder.",
  stack: [
    "Next.js",
    "React",
    "React Native",
    "TypeScript",
    "styled-components",
    "Zustand",
    "TanStack Query",
    "Node.js",
    "Express",
    "Sequelize ORM",
    "PostgreSQL",
    "Sanity CMS",
    "GROQ",
    "PhonePe",
    "Shiprocket",
    "JWE (jose)",
    "Puppeteer",
    "Fuse.js",
    "Mixpanel",
    "Facebook CAPI",
    "Slack API",
    "Google Cloud Run",
    "Vercel",
  ],
  features: [
    {
      title: "Headless catalogue",
      note: "Sanity read directly by web, app and API — no deploy to edit",
    },
    {
      title: "One gateway, both surfaces",
      note: "PhonePe on web and in-app, with callbacks verified server-side",
    },
    {
      title: "Courier booked automatically",
      note: "Shiprocket with retry, AWB, live tracking and cancellation",
    },
    {
      title: "Invoices and order identity",
      note: "Puppeteer PDF on the confirmation mail, plus a readable order ID",
    },
    {
      title: "Revenue recovery",
      note: "Abandoned cart and checkout mails, review requests, reminders",
    },
    {
      title: "Admin inside the storefront",
      note: "Orders, per-customer history, reviews, coupons, statistics",
    },
  ],
  architecture: [
    {
      title: "Catalogue out of the database, snapshot onto the order",
      body: "Products live in the CMS and transactions live in Postgres, which lets marketing change the catalogue without a deploy and keeps browsing load off the API entirely — all three clients read the CMS directly. The cost is that a product can never be foreign-keyed to an order, so the order carries a JSONB snapshot of what was actually bought. That is what makes an invoice reproducible after a price or a description changes.",
    },
    {
      title: "One payment path for two clients",
      body: "Web and mobile call the same endpoints; only the client SDK differs — hosted checkout in the browser, the native SDK in the app. One set of transaction columns, one merchant account, one reconciliation. And the order is confirmed on PhonePe's signature-verified callback rather than on the client reporting success, so a closed tab or a forged response cannot advance an order.",
    },
  ],
  engineeringNote:
    "Splitting the catalogue away from the transactional database is the right call for a content-led brand, and it creates exactly one hard problem: nothing in the order can point at a product row. Paying for that with a snapshot on every order is cheaper than the alternative, which is a marketing team filing tickets to change a price.",
  outcomes: [
    { label: "Surfaces", value: "Web · App · Admin" },
    { label: "Catalogue", value: "Headless" },
    { label: "Payments", value: "PhonePe" },
    { label: "Fulfilment", value: "Shiprocket" },
  ],
  image: "/work/marova-essence.jpg",
  imageAlt:
    "Marova Essence storefront with a full-bleed campaign image",
});
