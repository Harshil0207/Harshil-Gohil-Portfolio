import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import {
  ArchitectureList,
  EngineeringNote,
  FeatureList,
  StackChips,
} from "@/components/work/case-sections";
import { CaseStage } from "@/components/work/case-stage";
import { NextProject } from "@/components/work/next-project";
import { SpecRail } from "@/components/work/spec-rail";
import { company } from "@/content/company";
import { getNextProject, getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.name} — ${project.category}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.name} — ${project.category}`,
      description: project.summary,
      url: `/work/${project.slug}`,
      // No screenshot yet means the route's own generated card carries it.
      ...(project.image
        ? { images: [{ url: project.image, width: 2224, height: 1418 }] }
        : {}),
    },
  };
}

export default async function CaseStudy(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.summary,
    ...(project.url ? { url: project.url } : {}),
    dateCreated: project.year,
    creator: { "@type": "Person", name: company.name },
    about: project.category,
    keywords: project.stack.join(", "),
  };

  return (
    // The client's own ink is the accent for the length of its case study.
    <article style={{ ["--accent" as string]: project.accent }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* One full screen, the client's software at the centre of it. */}
      <CaseStage project={project} />

      <header className="shell pt-16 md:pt-24">
        <Reveal>
          <p className="lede text-xl text-on-field-2 md:text-2xl">
            {project.summary}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-2">
          <span className="chip-line">{project.category}</span>
          <span className="chip-line" data-figures>
            {project.year}
          </span>
          <span className="chip-line">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {project.spec.status}
          </span>
        </Reveal>
      </header>

      <div className="shell mt-16 grid gap-x-16 gap-y-16 pb-20 lg:mt-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <section>
            <h2 className="mid">How it was built</h2>
            <Reveal>
              <p className="lede mt-6 text-on-field-2">{project.about}</p>
            </Reveal>
          </section>

          {project.stack.length ? <StackChips stack={project.stack} /> : null}
          {project.features?.length ? (
            <FeatureList features={project.features} />
          ) : null}
          {project.architecture?.length ? (
            <ArchitectureList architecture={project.architecture} />
          ) : null}
          {project.engineeringNote ? (
            <EngineeringNote note={project.engineeringNote} />
          ) : null}
        </div>

        <aside className="lg:col-span-5">
          <SpecRail project={project} />
        </aside>
      </div>

      <NextProject project={next} />
    </article>
  );
}
