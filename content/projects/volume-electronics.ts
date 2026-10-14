import { defineProject } from "../project-schema";

export default defineProject({
  agency: "SSVL Technologies",
  slug: "volume-electronics",
  name: "Volume Electronics",
  kicker: "E-COMMERCE — ELECTRONICS SHOP",
  category: "E-commerce",
  year: "2025",
  accent: "#2563EB",
  client: "SSVL Technologies",
  role: "Solo · Frontend",
  status: "Source · on GitHub",
  domain: "github.com/Harshil0207/Volume-Electronic-Shop-",
  url: "https://github.com/Harshil0207/Volume-Electronic-Shop-",
  summary: "A storefront for an electronics shop — categories, products, shop and cart pages, a blog, registration and an admin panel.",
  about: "Built solo with React and Vite, routed with React Router and styled in Tailwind. The home page combines a hero, categories, a product grid, services, partner logos, banners and a blog section, with AOS scroll animations and react-slick carousels. Separate pages cover the shop, cart, blog, contact, registration and an admin panel.",
  stack: ["React", "Vite", "React Router", "Tailwind", "AOS", "react-slick"],
  features: [
    { title: "Shop and cart", note: "Product listing, product cards and a cart page" },
    { title: "Admin panel", note: "A page for managing the shop" },
    { title: "Blog", note: "Blog section and page" },
    { title: "Carousels and motion", note: "react-slick sliders and AOS reveals" },
  ],
  outcomes: [
    { label: "Built", value: "Solo" },
    { label: "Type", value: "Storefront" },
  ],
});
