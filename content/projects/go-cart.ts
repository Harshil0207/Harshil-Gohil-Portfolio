import { defineProject } from "../project-schema";

export default defineProject({
  agency: "Independent",
  slug: "go-cart",
  name: "Go-Cart",
  kicker: "E-COMMERCE — MULTI-VENDOR STORE",
  category: "E-commerce",
  year: "2025",
  accent: "#EA580C",
  client: "Personal project",
  role: "Solo · Built on an open-source starter",
  status: "Source · on GitHub",
  domain: "github.com/Harshil0207/Go-Cart-Shopping-Website",
  url: "https://github.com/Harshil0207/Go-Cart-Shopping-Website",
  summary: "A multi-vendor electronics store with a customer storefront, a seller dashboard with sales analytics, and an admin panel — built on the open-source GoCart starter.",
  about: "A Next.js app built on GreatStack's open-source GoCart project, with Tailwind for styling and Redux Toolkit for cart, product, address and rating state. Customers browse, open product pages, rate, manage a cart and place orders; sellers create a store and add, manage and fulfil products with an orders chart from Recharts; admins approve stores, review them and manage coupons. A Prisma schema describes users, stores, products, orders, ratings, addresses and coupons.",
  stack: ["Next.js", "React", "Tailwind", "Redux Toolkit", "Recharts", "Prisma schema", "Lucide"],
  features: [
    { title: "Storefront", note: "Shop, product pages, ratings, cart and orders" },
    { title: "Seller dashboard", note: "Add and manage products, track orders and sales" },
    { title: "Admin panel", note: "Approve stores, oversee sellers and manage coupons" },
    { title: "Analytics", note: "Order charts built with Recharts" },
  ],
  outcomes: [
    { label: "Model", value: "Multi-vendor" },
    { label: "State", value: "Redux Toolkit" },
    { label: "Base", value: "Open-source GoCart" },
  ],
});
