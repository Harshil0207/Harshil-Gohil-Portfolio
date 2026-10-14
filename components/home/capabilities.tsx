import { CapabilityCanvas } from "./capability-canvas";
import { TechStack } from "./tech-stack";

export function Capabilities() {
  return (
    <>
      <CapabilityCanvas />
      <section aria-label="Technology" className="block-field">
        <TechStack />
      </section>
    </>
  );
}
