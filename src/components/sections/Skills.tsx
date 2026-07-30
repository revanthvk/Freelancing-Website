"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/motion";
import OrbitingCirclesGlobe from "@/components/ui/orbiting-circles-02";

export function Skills() {
  return (
    <section id="skills" className="dark-island section bg-black">
      <div className="container-x">
        <SectionHeading
          eyebrow="Skills"
          title="A toolkit chosen for results, not hype"
        />

        <Reveal delay={0.05}>
          <div className="mt-10">
            <OrbitingCirclesGlobe />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
