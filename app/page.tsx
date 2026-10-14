import { Capabilities } from "@/components/home/capabilities";
import { Contact } from "@/components/home/contact";
import { HeroMerge } from "@/components/home/hero-merge";
import { Process } from "@/components/home/process";
import { Testimonials } from "@/components/home/testimonials";
import { WorkIndex } from "@/components/home/work-index";

export default function Home() {
  return (
    <>
      <HeroMerge />
      <WorkIndex />
      <Capabilities />
      <Process />
      <Testimonials />
      <Contact />
    </>
  );
}
