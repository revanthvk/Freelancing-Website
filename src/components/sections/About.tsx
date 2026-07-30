"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export function About() {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rX = useSpring(rotateX, { stiffness: 130, damping: 16, mass: 0.5 });
  const rY = useSpring(rotateY, { stiffness: 130, damping: 16, mass: 0.5 });
  const glowX = useTransform(rY, [-26, 26], [-40, 40]);
  const glowY = useTransform(rX, [-26, 26], [40, -40]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 26);
    rotateX.set(-py * 26);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto]">

          {/* Left — text */}
          <div>
            <motion.span
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fade}
              className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-500"
            >
              <span className="h-px w-8 bg-white/[0.12]" />
              About
            </motion.span>

            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fade}
              className="mt-6 max-w-3xl font-display text-[clamp(1.7rem,3.8vw,3.2rem)] font-bold leading-[1.2] tracking-tight text-white"
            >
              Software Engineer • UI/UX Designer
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ ...fade, show: { ...fade.show, transition: { ...fade.show.transition, delay: 0.12 } } }}
              className="mt-5 max-w-xl text-base leading-relaxed text-neutral-500"
            >
              Freelance Software Engineer & UI/UX Designer specializing in designing intuitive user experiences and engineering scalable digital products. I help startups, founders, and growing businesses transform ambitious ideas into elegant, high-performance web applications and AI-powered solutions that deliver real business impact.
            </motion.p>
          </div>

          {/* Right — profile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
            style={{ perspective: 1000 }}
          >
            {/* Ambient glow, drifts opposite the tilt for depth */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-10 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_70%)] blur-2xl"
              style={{ x: glowX, y: glowY }}
            />

            {/* Idle float — keeps the card visibly alive in 3D space even before interaction */}
            <motion.div
              animate={{ rotateZ: [0, 1.5, -1.5, 0], y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                ref={cardRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}
                className="relative"
              >
                {/* Backing plate — gives the card physical thickness as it rotates */}
                <div
                  style={{ transform: "translateZ(-24px) translate(10px, 14px)" }}
                  className="absolute inset-0 rounded-2xl bg-neutral-900"
                />
                <div
                  style={{ transform: "translateZ(0px) translate(5px, 7px)" }}
                  className="absolute inset-0 rounded-2xl bg-neutral-950 ring-1 ring-white/[0.06]"
                />

                <div
                  style={{ transform: "translateZ(50px)" }}
                  className="relative h-[360px] w-[280px] overflow-hidden rounded-2xl shadow-2xl shadow-black/60"
                >
                  <Image
                    src="/profile.png"
                    alt={siteConfig.name}
                    fill
                    className="object-cover object-top grayscale"
                    sizes="280px"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.1]" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/[0.06] to-transparent" />
                </div>

                <div
                  style={{ transform: "translateZ(110px)" }}
                  className="absolute -top-4 -right-16 rounded-xl border border-white/[0.1] bg-background/95 px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur"
                >
                  <p className="text-[11px] font-medium text-neutral-500">Founder</p>
                  <p className="font-display text-sm font-bold text-white">InternSpringBoard.AI</p>
                </div>

                <div
                  style={{ transform: "translateZ(110px)" }}
                  className="absolute -bottom-4 -left-16 rounded-xl border border-white/[0.1] bg-background/95 px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur"
                >
                  <p className="font-display text-lg font-bold text-white">2+ yrs</p>
                  <p className="text-[11px] text-neutral-500">Building products</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
