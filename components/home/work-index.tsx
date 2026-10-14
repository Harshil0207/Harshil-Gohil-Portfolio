import { workByAgency } from "@/content/projects";
import { WorkMasthead } from "./work-masthead";
import { WorkTabs } from "./work-tabs";

export function WorkIndex() {
  return (
    <section id="work" className="work-void">
      <span aria-hidden className="work-edge top-0" />
      <span aria-hidden className="work-mesh" />
      <span
        aria-hidden
        className="work-bloom"
        style={{
          top: "-14%",
          left: "-6%",
          width: "62%",
          height: "46%",
          opacity: 0.16,
        }}
      />
      <span aria-hidden className="work-grain" />

      <div className="relative z-[1]">
        <WorkMasthead />

        <WorkTabs groups={workByAgency} />
      </div>

      <span aria-hidden className="work-edge bottom-0" />
    </section>
  );
}
