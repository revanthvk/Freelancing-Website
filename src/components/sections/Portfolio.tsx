"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { projects } from "@/data/content";
import type { ProjectService } from "@/data/content";
import { CircularCarousel } from "@/components/ui/circular-carousel";

// ─── constants ────────────────────────────────────────────────────────────────

const SVC: Record<ProjectService, { color: string; label: string }> = {
  ai:         { color: "#a855f7", label: "AI"          },
  fullstack:  { color: "#06b6d4", label: "Full-Stack"  },
  saas:       { color: "#818cf8", label: "SaaS"        },
  web:        { color: "#10b981", label: "Web"         },
  cloud:      { color: "#3b82f6", label: "Cloud"       },
  data:       { color: "#f59e0b", label: "Data"        },
  automation: { color: "#f97316", label: "Automation"  },
  design:     { color: "#ec4899", label: "Design"      },
};

const activeServices = Array.from(new Set(projects.map((p) => p.service)));

const carouselItems = projects.map((p) => ({
  id: p.title,
  title: p.title,
  description: p.description,
  tag: SVC[p.service].label,
}));

// ─── section header ────────────────────────────────────────────────────────────

function Header() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref}>
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className="eyebrow">
          <span className="h-px w-6 bg-white/20" aria-hidden />
          Selected Work
        </span>
      </motion.div>

      {/* Huge title — two-line masked reveal */}
      <div className="mt-7 overflow-hidden">
        <motion.h2
          initial={{ y: "102%" }}
          animate={isInView ? { y: 0 } : {}}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
          className="font-display text-xl font-bold leading-none tracking-tighter text-white/70 sm:text-2xl"
        >
          PROJECTS
        </motion.h2>
      </div>

      {/* Sub-line */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.28 }}
        className="mt-5 flex flex-wrap items-center gap-6"
      >
        <p className="text-sm text-neutral-500">
          {projects.length} projects across {activeServices.length} disciplines.
        </p>
        <div className="flex items-center gap-2">
          <motion.span
            className="h-2 w-2 rounded-full bg-emerald-400"
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(52,211,153,0.4)",
                "0 0 0 5px rgba(52,211,153,0)",
              ],
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span className="text-xs text-neutral-600">Available for work</span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── main export ───────────────────────────────────────────────────────────────

export function Portfolio() {
  return (
    <section
      id="portfolio"
      className="relative overflow-hidden bg-black py-24 md:py-36"
    >
      {/* Ambient noise grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-8">

        {/* ── Header ── */}
        <Header />

        {/* ── Circular carousel ── */}
        <div className="mt-16">
          <CircularCarousel items={carouselItems} />
        </div>
      </div>
    </section>
  );
}
