import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "Independent",
  slug: "raahi",
  name: "Raahi",
  kicker: "RIDE BOOKING — RIDER, DRIVER AND ADMIN",
  category: "Ride Booking",
  year: "2026",
  accent: "#E8A317",
  client: "Personal project",
  role: "Solo · Backend, frontend and real-time",
  status: "Live · demo",
  domain: "raahi-fe-six.vercel.app",
  url: "https://raahi-fe-six.vercel.app",
  summary:
    "An Uber-style ride-booking platform: customers book and track rides, riders go online and drive them, and both watch the trip move on a live map.",
  about:
    "One React app serves both sides, and the role on the account — not the URL — decides which one you get. Behind it, an Express and MongoDB API owns everything that matters: fares, ride status, rider matching, OTP checks and request expiry. Socket.IO pushes every change of a ride to the people in it, riders stream their location while online, and the backend handles chat, complaints, wallets, recharges and an AI assistant built on Google GenAI. Maps sit behind a provider-agnostic seam, so Google and OpenStreetMap routing draw the same way.",
  stack: [
    "React",
    "Vite",
    "Tailwind",
    "Radix UI",
    "GSAP",
    "Leaflet",
    "Socket.IO",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "JWT",
    "Zod",
    "Google GenAI",
    "Helmet",
    "Vercel",
  ],
  features: [
    { title: "Two apps, one codebase", note: "Customer and rider experiences chosen by account role" },
    { title: "Live ride tracking", note: "Socket.IO events from request to drop-off, re-joined on reconnect" },
    { title: "Server-priced fares", note: "Route and price come from the API, never computed in the browser" },
    { title: "Request countdown", note: "Timed to the server's expiry, so a late accept is always refused" },
    { title: "Wallets and payments", note: "Rider wallet, ledger, recharges and a pluggable payment provider" },
    { title: "Chat, complaints, assistant", note: "In-ride chat, support tickets and an AI help assistant" },
  ],
  architecture: [
    {
      title: "The server is authoritative",
      body: "Fares, ride status, rider assignment, OTP validity and request expiry are all decided by the backend. Socket payloads only patch the screen for an instant response and then trigger a fresh read — the socket decides when to look, never what is true. That is what keeps two phones and a server from disagreeing about a ride.",
    },
    {
      title: "Maps behind one seam",
      body: "Only one component knows Leaflet exists and only one file names a tile source. Search, geocoding and routing go through the API, which owns the provider and its key, so swapping Google for OpenStreetMap is a backend change, not a rewrite.",
    },
  ],
  engineeringNote:
    "Losing a race is a normal outcome in ride booking: two riders tap accept and one of them has to lose. Designing for that case — a clear message, not an error — is most of what makes a real-time app feel trustworthy.",
  outcomes: [
    { label: "Apps", value: "Customer · Rider · Admin" },
    { label: "Real-time", value: "Socket.IO" },
    { label: "Maps", value: "Google · OSM" },
    { label: "Pricing", value: "Server-side" },
  ],
});
