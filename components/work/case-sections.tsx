import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/content/projects";

export function StackChips({ stack }: { stack: string[] }) {
  return (
    <section className="mt-16">
      <h2 className="mid">The stack it runs on</h2>
      <Reveal as="ul" stagger={0.03} className="mt-6 flex flex-wrap gap-2">
        {stack.map((item) => (
          <li
            key={item}
            className="chip-line text-on-field-2 transition-colors hover:text-acid-lift"
          >
            {item}
          </li>
        ))}
      </Reveal>
    </section>
  );
}

export function FeatureList({
  features,
}: {
  features: NonNullable<Project["features"]>;
}) {
  return (
    <section className="mt-16">
      <h2 className="mid">What it does</h2>
      <Reveal as="dl" stagger={0.06} className="mt-6 border-t border-line-on-field">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="grid gap-1 border-b border-line-on-field py-4 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-8"
          >
            <dt className="font-medium tracking-[-0.01em]">{feature.title}</dt>
            <dd className="text-on-field-2">{feature.note}</dd>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

export function ArchitectureList({
  architecture,
}: {
  architecture: NonNullable<Project["architecture"]>;
}) {
  return (
    <section className="mt-16">
      <h2 className="mid">Decisions worth defending</h2>
      <Reveal as="dl" stagger={0.1} className="mt-8 grid gap-10">
        {architecture.map((decision) => (
          <div key={decision.title}>
            <dt className="mid">
              {decision.title}
            </dt>
            <dd className="lede mt-3 text-on-field-2">{decision.body}</dd>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

export function EngineeringNote({ note }: { note: string }) {
  return (
    <Reveal className="mt-16">
      <figure className="block-acid rounded-card px-7 py-10 md:px-10 md:py-12">
        <blockquote className="text-xl leading-relaxed tracking-[-0.015em] md:text-2xl">
          {note}
        </blockquote>
        <figcaption className="meta mt-6 text-on-acid/60">
          Engineering note
        </figcaption>
      </figure>
    </Reveal>
  );
}
