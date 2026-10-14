import { defineProject } from "../project-schema";

export default defineProject({
  featured: true,
  agency: "Independent",
  slug: "llm-from-scratch",
  name: "LLM from Scratch",
  kicker: "AI — A TRANSFORMER, LINE BY LINE",
  category: "Machine Learning",
  year: "2026",
  accent: "#9333EA",
  client: "Personal project",
  role: "Solo · Model, training and UI",
  status: "Source · runs locally",
  domain: "github.com/Harshil0207/LLM",
  url: "https://github.com/Harshil0207/LLM",
  summary: "A small language model trained from first principles — from a one-character lookup table to a working GPT-style transformer, with a local web UI, a chat tab and retrieval over your own documents.",
  about: "Written in Python with PyTorch as a path from knowing Python to understanding every line of a transformer. A setup check proves the machine can train at all, a bigram model builds the scaffolding — tokenizer, batching, loss and sampling — and then the same pipeline swaps the lookup table for a decoder-only transformer: token and position embeddings, blocks of causal self-attention with an MLP, residual connections, layer norm and a linear head. The trained model streams text in a browser UI served by Python's standard library alone, a chat tab talks to an instruction-tuned model through Ollama, and an indexing step adds retrieval-augmented answers from local files.",
  stack: ["Python", "PyTorch", "NumPy", "Ollama", "HTML", "JavaScript"],
  features: [
    { title: "Bigram baseline", note: "The simplest model first, to build the tokenizer, batching and loss" },
    { title: "Tiny GPT", note: "A decoder-only transformer with causal self-attention" },
    { title: "Adapts to hardware", note: "Shrinks the model automatically when there is no GPU" },
    { title: "Local web UI", note: "Streams generated text, with the architecture and loss curves explained" },
    { title: "Chat tab", note: "Talks to an instruction-tuned model through Ollama" },
    { title: "RAG over your files", note: "Indexes local documents and answers from them" },
  ],
  architecture: [
    {
      title: "Same pipeline, one swapped part",
      body: "The bigram model and the transformer share the data, tokenizer and training loop; only the model changes. That makes the jump to attention the one new idea on the page instead of one of many, and it shows exactly what the architecture adds.",
    },
    {
      title: "Nothing leaves the machine",
      body: "The web UI runs on Python's standard library with no framework or CDN, and the chat tab proxies to Ollama on localhost. Everything — training, generation, retrieval — works offline.",
    },
  ],
  engineeringNote: "A tiny model learns the shape of language, not its meaning. Showing that honestly — and then showing that retrieval, not more training, is what makes a local model useful — is the real lesson of the project.",
  outcomes: [
    { label: "Model", value: "Tiny GPT" },
    { label: "Framework", value: "PyTorch" },
    { label: "Runs", value: "Fully offline" },
  ],
});
