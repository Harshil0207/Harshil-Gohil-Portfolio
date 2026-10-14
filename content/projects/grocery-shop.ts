import { defineProject } from "../project-schema";

export default defineProject({
  agency: "SSVL Technologies",
  slug: "grocery-shop",
  name: "Grocery Shop",
  kicker: "E-COMMERCE — GROCERY STORE",
  category: "E-commerce",
  year: "2026",
  accent: "#65A30D",
  client: "SSVL Technologies",
  role: "Solo · Frontend",
  status: "Source · on GitHub",
  domain: "github.com/Harshil0207/Grocery-Shop",
  url: "https://github.com/Harshil0207/Grocery-Shop",
  summary: "A grocery storefront with categories, products, a cart with delivery details and an order summary, and login-protected checkout.",
  about: "Built solo with React and Vite, using Material UI and Tailwind for the interface. The home page brings together a hero, popular categories in a Swiper carousel, services, qualities, customer reviews and an app download section, with Lottie animations. The cart lists items, collects delivery details with React Hook Form and shows an order summary, and protected routes keep checkout behind a login.",
  stack: ["React", "Vite", "Material UI", "Tailwind", "React Router", "React Hook Form", "Swiper", "Lottie"],
  features: [
    { title: "Categories and products", note: "Browse by category with product cards" },
    { title: "Cart and delivery", note: "Cart items, delivery form and order summary" },
    { title: "Protected checkout", note: "Routes guarded behind a login" },
    { title: "Rich home page", note: "Carousels, reviews and Lottie animations" },
  ],
  outcomes: [
    { label: "Built", value: "Solo" },
    { label: "UI", value: "Material UI · Tailwind" },
  ],
});
