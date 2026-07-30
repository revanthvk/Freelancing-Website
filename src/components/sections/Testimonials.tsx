"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import TestimonialsEditorial from "@/components/ui/editorial-testimonial";

export function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Testimonials"
          title="What clients say after launch"
          description="The work speaks, but they say it better. Here's what it's like to partner on a project."
        />

        <div className="mt-14">
          <TestimonialsEditorial />
        </div>
      </div>
    </section>
  );
}
