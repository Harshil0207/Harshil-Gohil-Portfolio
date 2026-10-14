import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "Independent",
  slug: "marketbot",
  name: "MarketBot",
  kicker: "AI TOOL — INDIAN MARKET ANALYSIS",
  category: "AI Market Assistant",
  year: "2026",
  accent: "#15803D",
  client: "Personal project",
  role: "Solo · Design and build",
  status: "Source · personal tool",
  domain: "github.com/Harshil0207/Stock-Market-bot",
  url: "https://github.com/Harshil0207/Stock-Market-bot",
  summary:
    "A terminal AI assistant for the Indian market (NSE and BSE) — ask about a stock, an index, options or a SIP plan and get a sourced, timestamped report instead of a guess.",
  about:
    "MarketBot is a TypeScript command-line app with an interactive chat. Market data comes from Zerodha's Kite Connect, or a mock provider until keys are set, and every number in a report is computed from that data with its source and timestamp shown. Reports cover trend, indicators, fundamentals, valuation, risks, key levels and scenarios, with a confidence rating built from data completeness and signal agreement. An optional language model — Claude, OpenAI or a local Ollama model — adds a plain-English reading, and any figure in that text that is not in the verified data gets flagged.",
  stack: [
    "TypeScript",
    "Node.js",
    "node:sqlite",
    "Claude API",
    "OpenAI API",
    "Ollama",
    "Kite Connect",
    "Zod",
    "Vitest",
  ],
  features: [
    { title: "Security reports", note: "Trend, indicators, fundamentals, risks and key levels in one read" },
    { title: "Dashboard", note: "Indices, sectors, breadth, movers, futures, PCR and watchlist" },
    { title: "Terminal charts", note: "Candles with moving averages, Bollinger bands, RSI and MACD" },
    { title: "Alerts and watchlist", note: "Price, change, RSI and volume-spike alerts with cooldowns" },
    { title: "Backtests and SIP plans", note: "Strategy backtests and long-term SIP planning" },
    { title: "Checked AI commentary", note: "Model text is verified against the data it was given" },
  ],
  architecture: [
    {
      title: "The model explains, it never calculates",
      body: "Every figure is computed from licensed market data before a language model sees anything. The model only writes the interpretation, and its output is scanned afterwards: a number that is not in the verified data is flagged rather than trusted. When data is missing, the report says so instead of filling the gap.",
    },
    {
      title: "Decision support, by construction",
      body: "MarketBot never places orders, and confidence is a measure of data completeness and signal agreement — not a probability of profit. Keeping those lines in the design, not just the disclaimer, is what keeps a market tool honest.",
    },
  ],
  engineeringNote:
    "Built on Node's own SQLite, so there are no native builds to break on Windows. A personal tool earns its keep by starting every morning without a fight.",
  outcomes: [
    { label: "Markets", value: "NSE · BSE" },
    { label: "Interface", value: "Terminal" },
    { label: "Models", value: "Claude · OpenAI · Ollama" },
  ],
});
