import { BadgeArrow } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { WorkHeadline } from "./work-headline";
import { WorkTimeline } from "./work-timeline";

/**
 * The claim runs the full measure and the note sits under it, tucked to the
 * right — so the masthead reads top to bottom as statement, then annotation,
 * then the roster itself. The paragraph no longer competes with the headline
 * for the same horizontal band.
 */
export function WorkMasthead() {
  return (
    <header className="shell relative pb-14 pt-24 md:pb-20 md:pt-32">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-b border-line-on-field pb-4">
        <p className="meta text-on-field-3">Selected work</p>
        <p className="meta flex items-center gap-2.5 text-on-field-3">
          <span className="work-led" aria-hidden />
          Built end to end
        </p>
      </div>

      <WorkHeadline className="mt-12 md:mt-16" />

      <div className="mt-10 grid md:mt-14 lg:grid-cols-12">
        <Reveal delay={0.2} className="lg:col-span-5 lg:col-start-8">
          <p className="lede text-on-field-2">
            Each one is a real build, and each row says where it stands — live,
            in development, or code you can read. The categories differ; the way
            they are built does not.
          </p>

          <div className="mt-8 flex items-center gap-5">
            <span aria-hidden className="h-px flex-1 bg-lit/50" />
            <BadgeArrow
              className="size-10 shrink-0 text-lit"
              cut="var(--field)"
            />
          </div>
        </Reveal>
      </div>

      <WorkTimeline />
    </header>
  );
}
