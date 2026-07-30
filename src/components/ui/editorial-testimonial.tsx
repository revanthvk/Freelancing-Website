"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/data/content";

function ClientAvatar({ photo, initials, name }: { photo?: string; initials: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (photo && !failed) {
    return (
      <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={name}
          className="block h-full w-full object-cover object-top"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-card/40 text-sm font-semibold text-foreground">
      {initials}
    </span>
  );
}

export default function TestimonialsEditorial() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const current = testimonials[index];

  const goTo = (i: number) => setIndex((i + total) % total);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="grid gap-10 lg:grid-cols-[140px_1fr]">
        {/* Left rail — index + nav */}
        <div className="flex flex-row items-center justify-between gap-6 lg:flex-col lg:items-start lg:justify-start">
          <div>
            <p className="font-display text-5xl font-bold tabular-nums text-foreground">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">/ {String(total).padStart(2, "0")}</p>
          </div>

          <div className="flex gap-2 lg:mt-10 lg:flex-col">
            <button
              onClick={() => goTo(index - 1)}
              aria-label="Previous testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              ↑
            </button>
            <button
              onClick={() => goTo(index + 1)}
              aria-label="Next testimonial"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              ↓
            </button>
          </div>
        </div>

        {/* Right — quote */}
        <div className="min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                <span className="h-px w-8 bg-foreground/10" />
                Client testimonial
              </span>

              <blockquote className="mt-6 font-display text-2xl font-medium leading-[1.35] tracking-tight text-foreground/90 md:text-3xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <ClientAvatar photo={current.photo} initials={current.initials} name={current.name} />
                <div>
                  <p className="font-semibold text-foreground">{current.name}</p>
                  <p className="text-sm text-muted-foreground">{current.title}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="mt-12 flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-border"
              >
                <motion.div
                  className="h-full bg-foreground"
                  initial={false}
                  animate={{ width: i === index ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
