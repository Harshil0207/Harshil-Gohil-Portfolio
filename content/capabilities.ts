export type CapabilityGroup = {
  title: string;
  items: string[];
};

export const capabilities: CapabilityGroup[] = [
  {
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind",
      "styled-components",
      "Zustand",
      "Radix UI",
    ],
  },
  {
    title: "Backend & API",
    items: ["Node.js", "Express", "NestJS", "Socket.IO", "REST", "Zod", "JWT"],
  },
  {
    title: "Data",
    items: [
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Supabase",
      "Mongoose",
      "Sequelize",
      "Drizzle ORM",
      "Redis",
      "BullMQ",
    ],
  },
  {
    title: "3D & desktop",
    items: [
      "Three.js",
      "React Three Fiber",
      "Blender",
      "glTF Transform",
      "Electron",
      "Konva",
    ],
  },
  {
    title: "AI",
    items: [
      "Claude API",
      "OpenAI API",
      "AI agents",
      "Google GenAI",
      "Python",
      "PyTorch",
    ],
  },
  {
    title: "Motion & tooling",
    items: [
      "GSAP",
      "Framer Motion",
      "Lenis",
      "Vite",
      "Leaflet",
      "Cloudinary",
      "Vercel",
      "Git",
    ],
  },
];

export type Service = {
  title: string;
  body: string;
};

export const services: Service[] = [
  {
    title: "Full-stack web apps",
    body: "Products with a real data model behind them — dashboards, stores, booking systems and internal tools, database to interface.",
  },
  {
    title: "Real-time systems",
    body: "Socket.IO for live tracking, chat and status, with the server deciding what is true and the socket only deciding when to look.",
  },
  {
    title: "E-commerce",
    body: "Storefronts with their own admin console — catalogue, offers, orders, payments and staff roles wired end to end.",
  },
  {
    title: "3D for the web",
    body: "Blender scenes baked, compressed and rebuilt in React Three Fiber, so they still run smoothly on an ordinary laptop.",
  },
  {
    title: "AI integration",
    body: "Claude and OpenAI wired into products where they change the outcome — agents, assistants and analysis, not demos.",
  },
  {
    title: "Desktop apps",
    body: "Electron apps with a typed bridge between the interface and the file system, packaged as a real installer.",
  },
];
