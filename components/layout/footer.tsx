import Link from "next/link";
import { ScrollTop } from "@/components/motion/scroll-top";
import { company } from "@/content/company";

export function Footer() {
  return (
    <footer className="block-ink">
      {/* Three groups on one rule: who, back to the top, and how to reach us.
          Centred rather than baseline-aligned, because the middle item is now a
          control with a box rather than a line of type. */}
      <div className="shell flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between md:gap-10">
        <p className="meta text-white/55">
          {company.name} — {company.tagline.toLowerCase()}, {company.address.city}, India
        </p>

        <ScrollTop />

        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 text-sm">
          {company.email ? (
            <a
              href={`mailto:${company.email}`}
              className="text-white/80 hover:text-acid-lift"
            >
              {company.email}
            </a>
          ) : null}
          <Link
            href={company.github}
            className="text-white/80 hover:text-acid-lift"
          >
            {company.githubLabel}
          </Link>
          <Link
            href={company.x}
            className="text-white/80 hover:text-acid-lift"
          >
            {company.xLabel}
          </Link>
        </div>
      </div>
    </footer>
  );
}
