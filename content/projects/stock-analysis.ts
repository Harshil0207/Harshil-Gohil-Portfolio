import { defineProject } from "../project-schema";

export default defineProject({
  agency: "Independent",
  slug: "stock-analysis",
  name: "Stock Analysis",
  kicker: "FINTECH — MARKET DASHBOARD",
  category: "Market Dashboard",
  year: "2026",
  accent: "#16A34A",
  client: "Personal project",
  role: "Solo · Frontend and API",
  status: "Source · on GitHub",
  domain: "github.com/Harshil0207/Stock-Analysis-fe",
  url: "https://github.com/Harshil0207/Stock-Analysis-fe",
  summary: "A stock market dashboard with market data, charts, news, a watchlist, a portfolio and an order form, backed by its own secure API.",
  about: "The frontend is a Next.js app styled with styled-components, organised into feature modules — dashboard, explore, per-symbol pages, analysis, news, portfolio, transactions, account and settings — with TradingView widgets for the ticker tape, screener and watchlist. The backend is an Express API on PostgreSQL with dual access and refresh tokens, email OTP for registration, login and password resets, Finnhub market data, and routes for stocks, charts, indicators, news, orders, wallet, watchlist and analytics, behind Helmet, rate limiting, validation and Winston logging.",
  stack: ["Next.js", "React", "styled-components", "TradingView widgets", "Node.js", "Express", "PostgreSQL", "Finnhub", "JWT", "Nodemailer", "express-validator", "Helmet", "Winston"],
  features: [
    { title: "Market dashboard", note: "Metrics, market chart, ticker tape and screener" },
    { title: "Symbol pages", note: "A page per stock with its chart and details" },
    { title: "Portfolio and orders", note: "Order form, transactions, wallet and holdings" },
    { title: "News and analysis", note: "Market news and analytics pages" },
    { title: "OTP authentication", note: "Email OTP for sign-up, login and password reset" },
    { title: "Hardened API", note: "Rate limits, validation, security headers and logging" },
  ],
  outcomes: [
    { label: "Surfaces", value: "Dashboard · API" },
    { label: "Database", value: "PostgreSQL" },
    { label: "Data", value: "Finnhub" },
  ],
});
