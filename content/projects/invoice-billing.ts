import { defineProject } from "../project-schema";

export default defineProject({
  agency: "Independent",
  slug: "invoice-billing",
  name: "Invoice Billing",
  kicker: "TOOL — INVOICES AND PDFS",
  category: "Billing Tool",
  year: "2026",
  accent: "#475569",
  client: "Personal project",
  role: "Solo · Design and build",
  status: "Source · on GitHub",
  domain: "github.com/Harshil0207/InvoiceBilling",
  url: "https://github.com/Harshil0207/InvoiceBilling",
  summary: "An invoice maker that totals line items with tax and discounts, adds a barcode, and downloads the finished invoice as a PDF.",
  about: "A Next.js app styled with styled-components. The invoice form is built with React Hook Form and validated with Zod, totals tax and discounts as you type, and gives each invoice a number. JsBarcode draws the barcode, and html2canvas with jsPDF turn the rendered invoice into a downloadable PDF. It also has a light and dark theme.",
  stack: ["Next.js", "React", "styled-components", "React Hook Form", "Zod", "JsBarcode", "jsPDF", "html2canvas"],
  features: [
    { title: "Live totals", note: "Tax and discount totals update as you type" },
    { title: "Validated form", note: "React Hook Form with a Zod schema" },
    { title: "Barcodes", note: "Generated with JsBarcode" },
    { title: "PDF download", note: "The rendered invoice exported with jsPDF" },
  ],
  outcomes: [
    { label: "Output", value: "PDF" },
    { label: "Validation", value: "Zod" },
  ],
});
