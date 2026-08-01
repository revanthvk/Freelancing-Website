"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

/* ── Data ────────────────────────────────────────────────────────────────── */
const STEPS = [
  { num: "01", label: "Discovery",     desc: "Dig into your goals, users, and constraints to define what success actually looks like.", side: "left" as const },
  { num: "02", label: "Design",        desc: "Wireframes, design systems, and high-fidelity UI in Figma every screen prototyped before a line of code is written.", side: "right" as const },
  { num: "03", label: "Architecture",  desc: "Clear scope, tech stack, and timeline so the build phase has zero surprises.", side: "left" as const },
  { num: "04", label: "Development",   desc: "Turning the approved Figma designs into clean, typed, pixel-accurate code shipped in reviewable increments.", side: "right" as const },
  { num: "05", label: "Testing",       desc: "QA, accessibility, responsiveness, and performance passes so it's solid across every device.", side: "left" as const },
  { num: "06", label: "Launch",        desc: "Deploy, hand off design files and documentation, and support after go-live.", side: "right" as const },
];

const ANNOTATIONS = [
  { text: "back to you within a day x", afterIndex: 0 },
  { text: "design + dev, one person", afterIndex: 2 },
  { text: "tested on real devices", afterIndex: 4 },
];

/* ── Virtual canvas — single left rail for the line, text safely to the right ── */
const VW = 640;
const VH = 2300;
const RAIL_X = 70; // dots stay near here; loops bulge right but stay < 170
const DOTS = [
  { x: 70, y: 110 },
  { x: 88, y: 490 },
  { x: 62, y: 870 },
  { x: 92, y: 1250 },
  { x: 66, y: 1630 },
  { x: 84, y: 2010 },
];
const LOOP_AFTER = new Set([0, 2, 4]); // loop drawn after these dot indices

const pct = (n: number, total: number) => `${(n / total) * 100}%`;

function smooth(x1: number, y1: number, x2: number, y2: number) {
  const midY = (y1 + y2) / 2;
  return `C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}
function loop(x: number, y: number, r: number) {
  return `
    C ${x + r * 1.6} ${y - r * 0.5}, ${x + r * 1.6} ${y + r * 1.1}, ${x + r * 0.2} ${y + r * 1.15}
    C ${x - r * 0.9} ${y + r * 1.2}, ${x - r * 0.9} ${y + r * 0.2}, ${x} ${y + r * 0.25}
  `;
}

const LOOP_RADII = [46, 56, 42];
let loopI = 0;
const segments: string[] = [`M ${DOTS[0].x} ${DOTS[0].y}`];
for (let i = 0; i < DOTS.length; i++) {
  if (LOOP_AFTER.has(i)) {
    segments.push(loop(DOTS[i].x, DOTS[i].y, LOOP_RADII[loopI++]));
    if (i + 1 < DOTS.length) segments.push(smooth(DOTS[i].x, DOTS[i].y + 18, DOTS[i + 1].x, DOTS[i + 1].y));
  } else if (i + 1 < DOTS.length) {
    segments.push(smooth(DOTS[i].x, DOTS[i].y, DOTS[i + 1].x, DOTS[i + 1].y));
  }
}
const PATH_D = segments.join(" ");

/* ── Single dot — pulses + brightens once the comet passes it ──────────── */
function AnimatedDot({ x, y, progress, threshold }: { x: number; y: number; progress: MotionValue<number>; threshold: number }) {
  const scale = useTransform(progress, [Math.max(0, threshold - 0.05), threshold], [1, 1.6]);
  const opacity = useTransform(progress, [Math.max(0, threshold - 0.05), threshold], [0.35, 1]);
  return (
    <motion.circle
      cx={x}
      cy={y}
      r="6"
      fill="#ffffff"
      style={{ scale, opacity, transformOrigin: `${x}px ${y}px` }}
    />
  );
}

/* ── Comet that travels along the path, synced to scroll progress ──────── */
function Comet({ progress, pathRef }: { progress: MotionValue<number>; pathRef: React.RefObject<SVGPathElement | null> }) {
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      const path = pathRef.current;
      const g = gRef.current;
      if (!path || !g) return;
      const total = path.getTotalLength();
      const pt = path.getPointAtLength(Math.max(0, Math.min(1, v)) * total);
      g.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
    });
    return unsub;
  }, [progress, pathRef]);

  return (
    <g ref={gRef} transform={`translate(${DOTS[0].x}, ${DOTS[0].y})`}>
      <circle r="10" fill="#ffffff" opacity="0.15" />
      <circle r="4.5" fill="#ffffff" />
    </g>
  );
}

/* ── Mobile virtual canvas — narrow rail, one wave "row" per step. Stretched
   non-uniformly (preserveAspectRatio="none") to match however tall the
   stacked list actually renders, so the curve still lines up with steps
   whose description text wraps to different lengths. ──────────────────── */
const VW_M = 64;
const ROW_H = 100;
const CENTER_X = 32;
const BULGE = 18; // how far the wave swings out from center each side
const DOTS_M = STEPS.map((_, i) => ({ x: CENTER_X, y: (i + 0.5) * ROW_H }));
const VH_M = ROW_H * STEPS.length;

function wave(x: number, y1: number, y2: number, bulgeX: number) {
  return `C ${bulgeX} ${y1 + (y2 - y1) * 0.25}, ${bulgeX} ${y1 + (y2 - y1) * 0.75}, ${x} ${y2}`;
}

const mobileSegments: string[] = [`M ${DOTS_M[0].x} ${DOTS_M[0].y}`];
for (let i = 0; i < DOTS_M.length - 1; i++) {
  const bulgeX = CENTER_X + (i % 2 === 0 ? BULGE : -BULGE);
  mobileSegments.push(wave(DOTS_M[i + 1].x, DOTS_M[i].y, DOTS_M[i + 1].y, bulgeX));
}
const PATH_D_MOBILE = mobileSegments.join(" ");

/* ── Mobile comet — same technique as desktop's Comet, walking the wavy path ── */
function CometMobile({ progress, pathRef }: { progress: MotionValue<number>; pathRef: React.RefObject<SVGPathElement | null> }) {
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      const path = pathRef.current;
      const g = gRef.current;
      if (!path || !g) return;
      const total = path.getTotalLength();
      const pt = path.getPointAtLength(Math.max(0, Math.min(1, v)) * total);
      g.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
    });
    return unsub;
  }, [progress, pathRef]);

  return (
    <g ref={gRef} transform={`translate(${DOTS_M[0].x}, ${DOTS_M[0].y})`}>
      <circle r="9" fill="#ffffff" opacity="0.18" />
      <circle r="4" fill="#ffffff" />
    </g>
  );
}

/* ── Mobile dot — same pulse/brighten behavior as the desktop AnimatedDot,
   but as an HTML circle sitting inline in the stacked list ─────────────── */
function AnimatedDotMobile({ num, progress, threshold }: { num: string; progress: MotionValue<number>; threshold: number }) {
  const scale = useTransform(progress, [Math.max(0, threshold - 0.05), threshold], [1, 1.12]);
  const bg = useTransform(progress, [Math.max(0, threshold - 0.05), threshold], ["#3f3f46", "#ffffff"]);
  const color = useTransform(progress, [Math.max(0, threshold - 0.05), threshold], ["#a1a1aa", "#000000"]);
  return (
    <motion.span
      style={{ scale, backgroundColor: bg, color }}
      className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold"
    >
      {num}
    </motion.span>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.6 });

  const mobileRef = useRef<HTMLDivElement>(null);
  const mobilePathRef = useRef<SVGPathElement>(null);
  const { scrollYProgress: mobileScrollYProgress } = useScroll({ target: mobileRef, offset: ["start 0.8", "end 0.5"] });
  const mobileProgress = useSpring(mobileScrollYProgress, { stiffness: 80, damping: 22, mass: 0.6 });

  // rough cumulative thresholds for the "lit" pulse on each dot
  const THRESHOLDS = [0.04, 0.22, 0.40, 0.58, 0.76, 0.95];
  const MOBILE_THRESHOLDS = STEPS.map((_, i) => (i + 1) / (STEPS.length + 0.5));

  return (
    <section
      id="process"
      className="dark-island relative overflow-hidden py-24 md:py-32"
      style={{ background: "#000000" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-[500px] w-[300px] opacity-[0.05]" style={{ background: "radial-gradient(circle, #ffffff, transparent 70%)", filter: "blur(80px)" }} />

      <div className="mx-auto w-full max-w-3xl px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
            <span className="h-px w-8 bg-white/20" />
            Our Process
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start Here
          </h2>
          <p className="mt-2 text-lg text-white/50">
            from Figma to production — design and code, one person
          </p>
        </motion.div>

        {/* ── Illustrated path — desktop/tablet ────────────────────────── */}
        <div ref={ref} className="relative hidden md:block" style={{ aspectRatio: `${VW} / ${VH}` }}>
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            style={{ zIndex: 0 }}
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ghost full path */}
            <path d={PATH_D} fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.10" />

            {/* Animated drawing path, with soft glow */}
            <motion.path
              ref={pathRef}
              d={PATH_D}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow)"
              style={{ pathLength: progress }}
            />

            {/* Dots — pulse + brighten as the comet passes */}
            {DOTS.map((d, i) => (
              <AnimatedDot key={i} x={d.x} y={d.y} progress={progress} threshold={THRESHOLDS[i]} />
            ))}

            <Comet progress={progress} pathRef={pathRef} />
          </svg>

          {/* Step content blocks — always in the safe right-side content column */}
          {STEPS.map((step, i) => {
            const dot = DOTS[i];
            const isLeft = step.side === "left";
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  top: pct(dot.y, VH),
                  transform: "translateY(-50%)",
                  ...(isLeft
                    ? { left: pct(190, VW), textAlign: "left" as const }
                    : { right: pct(0, VW), textAlign: "right" as const }),
                  width: "min(70%, 320px)",
                }}
              >
                <span className="font-display text-2xl font-bold text-white">
                  {step.num}
                </span>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-white/90">
                  {step.label}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/50">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}

          {/* Handwritten annotations — small notes near the loops, in the rail's free space */}
          {ANNOTATIONS.map((a, i) => {
            const dot = DOTS[a.afterIndex];
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="pointer-events-none absolute text-[20px] leading-tight text-white/70"
                style={{
                  top: pct(dot.y - 95, VH),
                  left: pct(RAIL_X - 30, VW),
                  width: 150,
                  fontFamily: "var(--font-handwriting)",
                  transform: "rotate(-5deg)",
                }}
              >
                {a.text}
              </motion.p>
            );
          })}
        </div>

        {/* ── Mobile — same curved, comet-drawn path as desktop, adapted to a
             narrow single-column layout. The SVG is stretched non-uniformly
             (preserveAspectRatio="none") to fill however tall the step list
             actually renders, so the curve tracks the real content height. ── */}
        <div ref={mobileRef} className="relative md:hidden">
          <svg
            viewBox={`0 0 ${VW_M} ${VH_M}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-4 h-[calc(100%-2rem)] w-16 overflow-visible"
            style={{ left: -16, zIndex: 0 }}
          >
            {/* Ghost full path */}
            <path d={PATH_D_MOBILE} fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.12" vectorEffect="non-scaling-stroke" />
            {/* Animated drawing path */}
            <motion.path
              ref={mobilePathRef}
              d={PATH_D_MOBILE}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: mobileProgress, filter: "drop-shadow(0 0 4px rgba(255,255,255,0.6))" }}
            />
            <CometMobile progress={mobileProgress} pathRef={mobilePathRef} />
          </svg>

          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex gap-4"
              >
                <AnimatedDotMobile num={step.num} progress={mobileProgress} threshold={MOBILE_THRESHOLDS[i]} />
                <div className="pb-2 pt-0.5">
                  <h3 className="text-lg font-semibold text-white/90">{step.label}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-white/50">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex flex-col gap-6 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-white/40">
            Revanth — Software Engineer • UI/UX Designer
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-medium text-white transition-opacity hover:opacity-70"
          >
            What else can I build for you?
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
