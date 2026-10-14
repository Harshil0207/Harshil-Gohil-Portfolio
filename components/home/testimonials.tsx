import { SplitHeadline } from "@/components/motion/split-headline";
import { copy } from "@/content/company";
import { experience } from "@/content/experience";

// Uneven widths keep the rail from reading as six matching tiles.
const widths = [
  "w-[min(32rem,86vw)]",
  "w-[min(25rem,78vw)]",
  "w-[min(29rem,82vw)]",
  "w-[min(23rem,74vw)]",
  "w-[min(33rem,88vw)]",
  "w-[min(26rem,80vw)]",
];

export function Testimonials() {
  return (
    <section className="block-field py-16 md:py-24">
      <div className="shell">
        <SplitHeadline className="big max-w-[22ch]">
          {copy.testimonialsTitle}
        </SplitHeadline>
      </div>

      {/* A real scroller: every quote is reachable by wheel, drag and keyboard,
          with or without motion. */}
      <ul
        tabIndex={0}
        aria-label="Experience"
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:gap-6 md:px-8"
      >
        {experience.map((entry, index) => (
          <li
            key={entry.place}
            className={`${widths[index % widths.length]} flex shrink-0 snap-start flex-col justify-between rounded-card border border-line-on-field p-7 md:p-9`}
          >
            <p className="text-lg leading-relaxed tracking-[-0.01em] md:text-xl">
              {entry.body}
            </p>
            <p className="meta mt-8 text-on-field-3">
              {entry.place} · {entry.role}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
