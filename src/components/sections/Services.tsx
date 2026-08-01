"use client";

import { motion } from "framer-motion";
import { DynamicFrameLayout } from "@/components/ui/dynamic-frame-layout";

/* ── Geometric icons ────────────────────────────────────────────────────── */
const icons = {
  circles: () => (
    <svg viewBox="0 0 56 56" className="size-12 md:size-14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
      <circle cx="28" cy="28" r="26" /><circle cx="28" cy="28" r="18" /><circle cx="28" cy="28" r="10" /><circle cx="28" cy="28" r="3" fill="currentColor" />
    </svg>
  ),
  squares: () => (
    <svg viewBox="0 0 56 56" className="size-12 md:size-14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
      <rect x="2" y="2" width="52" height="52" /><rect x="10" y="10" width="36" height="36" /><rect x="18" y="18" width="20" height="20" /><rect x="24" y="24" width="8" height="8" fill="currentColor" />
    </svg>
  ),
  diamond: () => (
    <svg viewBox="0 0 56 56" className="size-12 md:size-14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
      <path d="M28 2 L54 28 L28 54 L2 28Z" /><path d="M28 12 L44 28 L28 44 L12 28Z" /><circle cx="28" cy="28" r="4" fill="currentColor" />
    </svg>
  ),
  ring: () => (
    <svg viewBox="0 0 56 56" className="size-12 md:size-14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
      <circle cx="28" cy="28" r="26" /><path d="M28 2 A26 26 0 0 1 54 28" strokeWidth="3" /><circle cx="28" cy="28" r="6" fill="currentColor" />
    </svg>
  ),
  hex: () => (
    <svg viewBox="0 0 56 56" className="size-12 md:size-14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
      <path d="M28 2 L50 15 L50 41 L28 54 L6 41 L6 15Z" /><path d="M28 14 L40 21 L40 35 L28 42 L16 35 L16 21Z" /><circle cx="28" cy="28" r="3" fill="currentColor" />
    </svg>
  ),
  lines: () => (
    <svg viewBox="0 0 56 56" className="size-12 md:size-14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
      <line x1="0" y1="8" x2="56" y2="8" /><line x1="0" y1="20" x2="56" y2="20" /><line x1="0" y1="32" x2="56" y2="32" /><line x1="0" y1="44" x2="56" y2="44" />
    </svg>
  ),
  grid: () => (
    <svg viewBox="0 0 56 56" className="size-12 md:size-14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
      <rect x="4" y="4" width="20" height="20" /><rect x="32" y="4" width="20" height="20" /><rect x="4" y="32" width="20" height="20" /><rect x="32" y="32" width="20" height="20" fill="currentColor" fillOpacity="0.15" />
    </svg>
  ),
  star: () => (
    <svg viewBox="0 0 56 56" className="size-12 md:size-14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
      <path d="M28 2 L33 22 L54 22 L37 34 L42 54 L28 42 L14 54 L19 34 L2 22 L23 22Z" /><circle cx="28" cy="28" r="4" fill="currentColor" />
    </svg>
  ),
};

const SERVICES = [
  { title: "Full-Stack\nDevelopment", desc: "End-to-end web apps with Next.js, TypeScript, and clean APIs — built to ship fast and scale.", icon: icons.circles, side: "left" as const },
  { title: "AI\nDevelopment", desc: "LLM features, RAG pipelines, and AI agents wired into real products with measurable value.", icon: icons.diamond, side: "right" as const },
  { title: "SaaS\nProducts", desc: "Multi-tenant platforms with auth, billing, and dashboards — from MVP to production.", icon: icons.squares, side: "left" as const },
  { title: "Web\nApplications", desc: "Fast, accessible interfaces with thoughtful UX and motion that feels effortless.", icon: icons.ring, side: "right" as const },
  { title: "Cloud\nSolutions", desc: "Deploy, observe, and scale on AWS and Vercel with CI/CD and infrastructure as code.", icon: icons.hex, side: "left" as const },
  { title: "Data\nAnalytics", desc: "Pipelines, dashboards, and reporting that turn raw events into decisions.", icon: icons.lines, side: "right" as const },
  { title: "Automation\nSystems", desc: "Connect tools and remove busywork with reliable, observable workflows.", icon: icons.grid, side: "left" as const },
  { title: "UI/UX\nDesign", desc: "Design systems and interfaces that look premium and convert visitors into clients.", icon: icons.star, side: "right" as const },
];

const WORDS = ["A.I.", "DESIGN", "DEVELOPMENT", "ENGINEERING"];

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Component ───────────────────────────────────────────────────────────── */
export function Services() {
  return (
    <section id="services">

      {/* ── Part 1: Giant stacked typography ─────────────────────────── */}
      <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-background px-6 py-20 md:py-28">

        {/* Label */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}
          className="text-center"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Our Services
          </span>
        </motion.div>

        {/* Massive stacked words */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 items-center justify-center"
        >
          <div className="text-center">
            {WORDS.map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className="block select-none uppercase text-foreground/70"
                  style={{
                    fontSize: "clamp(3rem, 11vw, 12rem)",
                    lineHeight: 0.88,
                    letterSpacing: "-0.04em",
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontWeight: 300,
                    fontStretch: "condensed",
                  }}
                >
                  {word}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            <span className="text-muted-foreground/60">✦</span>{" "}
            Design with intent. Built to work.
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            View Services
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            <span className="h-px w-12 bg-border transition-all duration-300 group-hover:w-16 group-hover:bg-foreground" />
          </a>
        </motion.div>
      </div>

      {/* ── Part 2: Interactive video grid ──────────────────────────────── */}
      <ServiceGrid />
    </section>
  );
}

/* ── Luma CDN videos for DynamicFrameLayout — each is 5-31MB, so mobile shows
   the lightweight poster stills instead of downloading video at all ────── */
const DEMO_FRAMES = [
  { id: 1, video: "https://videos.pexels.com/video-files/6804117/6804117-uhd_2732_1440_25fps.mp4", poster: "/service-posters/service-1.jpg" },
  { id: 2, video: "https://static.cdn-luma.com/files/58ab7363888153e3/WebGL%20Exported%20(1).mp4", poster: "/service-posters/service-2.jpg" },
  { id: 3, video: "https://videos.pexels.com/video-files/34129037/14471988_2560_1440_30fps.mp4", poster: "/service-posters/service-3.jpg" },
  { id: 4, video: "https://static.cdn-luma.com/files/58ab7363888153e3/Exported%20Web%20Video.mp4", poster: "/service-posters/service-4.jpg" },
  { id: 5, video: "https://videos.pexels.com/video-files/5028622/5028622-uhd_2560_1440_25fps.mp4", poster: "/service-posters/service-5.jpg" },
  { id: 6, video: "https://videos.pexels.com/video-files/7947489/7947489-hd_1920_1080_30fps.mp4", poster: "/service-posters/service-6.jpg" },
  { id: 7, video: "https://static.cdn-luma.com/files/58ab7363888153e3/Illustration%20Exported%20(1).mp4", poster: "/service-posters/service-7.jpg" },
  { id: 8, video: "https://static.cdn-luma.com/files/58ab7363888153e3/Art%20Direction%20Exported.mp4", poster: "/service-posters/service-8.jpg" },
  { id: 9, video: "https://static.cdn-luma.com/files/58ab7363888153e3/Product%20Video.mp4", poster: "/service-posters/service-9.jpg" },
];

const SVC_LABELS = [
  "Full-Stack Development",
  "AI Development",
  "SaaS Products",
  "Web Applications",
  "Cloud Solutions",
  "Data Analytics",
  "Automation Systems",
  "UI/UX Design",
  "Start a Project →",
];

/* ── Interactive video grid ─────────────────────────────────────────────── */
function ServiceGrid() {
  return (
    <div className="bg-background py-32 md:py-44">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">All Services</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "80vh", minHeight: 550 }}
        >
          <DynamicFrameLayout
            frames={DEMO_FRAMES}
            className="h-full w-full"
            cols={3}
            hoverSize={6}
            gapSize={4}
            overlay={(_, i) => {
              const label = SVC_LABELS[i];
              if (!label) return null;
              return (
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-5">
                  <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-sm font-bold leading-tight text-white md:text-lg">
                    {label}
                  </h3>
                </div>
              );
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            <span className="text-muted-foreground/50">✦</span> Different disciplines. One standard of craft.
          </p>
          <a href="#contact" className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground">
            Start a Project
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            <span className="h-px w-12 bg-border transition-all duration-300 group-hover:w-16 group-hover:bg-foreground/30" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
