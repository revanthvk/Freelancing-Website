"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/* ── Hero ────────────────────────────────────────────────────────────────── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.14 } } };
const fade = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ background: "#000000", height: "100vh", minHeight: "100vh", maxHeight: "100vh" }}
    >
      {/* Background video */}
      <video
        src="/video/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />

      {/* Dark overlay — flat base darkening plus extra depth at the top (behind the
          navbar/logo) and bottom (behind the description text) so both stay legible
          regardless of what's playing in the video at that moment */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(5,5,5,0.78)", zIndex: 1 }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.55) 12%, transparent 30%, transparent 62%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0.75) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between px-6 pb-24 pt-28 lg:px-12 lg:pb-10 lg:pt-32" style={{ zIndex: 2 }}>
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Availability badge */}
          <motion.div variants={fade} className="mb-12">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-neutral-500">{siteConfig.availability}</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fade}
            className="font-display text-[clamp(2.2rem,6.5vw,6rem)] font-medium leading-[0.98] tracking-tighter"
          >
            <span className="block text-white/90">AI. Design. Development.</span>
            <span className="block text-white/40">Everything</span>
            <span className="block text-white/40">Starts Here.</span>
          </motion.h1>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          {/* Left — scroll cue */}
          <motion.div variants={fadeUp} className="hidden md:block">
            <a
              href="#about"
              aria-label="Scroll down"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.10] text-sm text-white/30 transition-colors hover:border-white/20 hover:text-white/60"
            >
              ↓
            </a>
          </motion.div>

          {/* Center — CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              Start a Project
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={siteConfig.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.10] px-8 py-4 text-sm font-medium text-neutral-500 transition-all duration-300 hover:border-white/20 hover:text-white"
            >
              <MessageCircle className="size-4" />
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Right — establishment info */}
          <motion.div variants={fadeUp} className="max-w-sm text-right">
            <div className="inline-flex items-center gap-0 overflow-hidden rounded-lg border border-white/[0.08]">
              <div className="flex flex-col items-center gap-1 border-r border-white/[0.08] px-5 py-3">
                <svg className="size-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                  Est. 2025
                </span>
              </div>
              <div className="px-5 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                  3+ years shaping
                  <br />
                  digital products.
                </span>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-neutral-600">
              {siteConfig.description}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
