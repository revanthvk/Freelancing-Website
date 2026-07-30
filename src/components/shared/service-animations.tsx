"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   1. Full-Stack Development — stacked code-editor panels
───────────────────────────────────────────────────────────── */
export function FullStackAnim() {
  const reduce = useReducedMotion();
  const panels = [
    { z: -2, scale: 0.80, opacity: 0.30, delay: 0.4, lines: [[75, "rgba(99,102,241,0.6)"], [50, "rgba(20,184,166,0.5)"], [62, "rgba(255,255,255,0.2)"]] },
    { z: -1, scale: 0.90, opacity: 0.60, delay: 0.2, lines: [[55, "rgba(20,184,166,0.6)"], [80, "rgba(255,255,255,0.25)"], [40, "rgba(99,102,241,0.5)"]] },
    { z:  0, scale: 1.00, opacity: 1.00, delay: 0.0, lines: [[80, "rgba(99,102,241,0.7)"], [60, "rgba(20,184,166,0.6)"], [70, "rgba(255,255,255,0.3)"]] },
  ] as const;

  return (
    <div className="relative flex h-full items-end justify-center pb-3" style={{ perspective: 600 }}>
      {panels.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-40 rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm"
          style={{ scale: p.scale, opacity: p.opacity, translateY: i * 10 }}
          animate={reduce ? {} : { y: [i * 10, i * 10 - 5, i * 10] }}
          transition={{ duration: 2.8, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mb-2.5 flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <span className="h-2 w-2 rounded-full bg-green-400/70" />
          </div>
          {(p.lines as unknown as [number, string][]).map(([w, color], j) => (
            <div key={j} className="mb-1.5 h-1.5 rounded-full" style={{ width: `${w}%`, background: color }} />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. AI Development — neural network with pulsing signals
───────────────────────────────────────────────────────────── */
const INS  = [[12, 22], [12, 50], [12, 78]] as const;
const HIDD = [[50, 14], [50, 38], [50, 62], [50, 86]] as const;
const OUT  = [88, 50] as const;

const EDGES = [
  ...INS.flatMap(([ix, iy]) => HIDD.map(([hx, hy]) => [ix, iy, hx, hy] as const)),
  ...HIDD.map(([hx, hy]) => [hx, hy, OUT[0], OUT[1]] as const),
];

export function AIAnim() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-32 w-full" style={{ overflow: "visible" }}>
        {/* edges */}
        {EDGES.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
            stroke="rgba(99,102,241,0.25)" strokeWidth="0.7" />
        ))}

        {/* animated signal pulses */}
        {!reduce && EDGES.slice(0, 8).map(([x1, y1, x2, y2], i) => (
          <motion.circle key={`p${i}`} r="1.4" fill="rgba(99,102,241,0.95)"
            animate={{ cx: [`${x1}%`, `${x2}%`], cy: [`${y1}%`, `${y2}%`], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, delay: i * 0.22, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* input nodes */}
        {INS.map(([x, y], i) => (
          <motion.circle key={`i${i}`} cx={`${x}%`} cy={`${y}%`} r="5.5"
            fill="rgba(20,184,166,0.18)" stroke="rgba(20,184,166,0.8)" strokeWidth="0.8"
            animate={reduce ? {} : { r: [5.5, 6.5, 5.5] }}
            transition={{ duration: 2.2, delay: i * 0.35, repeat: Infinity }} />
        ))}

        {/* hidden nodes */}
        {HIDD.map(([x, y], i) => (
          <motion.circle key={`h${i}`} cx={`${x}%`} cy={`${y}%`} r="4.5"
            fill="rgba(99,102,241,0.18)" stroke="rgba(99,102,241,0.7)" strokeWidth="0.8"
            animate={reduce ? {} : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, delay: i * 0.28, repeat: Infinity }} />
        ))}

        {/* output node */}
        <motion.circle cx={`${OUT[0]}%`} cy={`${OUT[1]}%`} r="7"
          fill="rgba(168,85,247,0.22)" stroke="rgba(168,85,247,0.9)" strokeWidth="1"
          animate={reduce ? {} : { r: [7, 8.5, 7], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity }} />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. SaaS Development — users connecting to central platform
───────────────────────────────────────────────────────────── */
const USERS = [
  { cx: "18%", cy: "22%", color: "rgba(20,184,166,0.8)",  delay: 0   },
  { cx: "18%", cy: "50%", color: "rgba(99,102,241,0.8)",  delay: 0.4 },
  { cx: "18%", cy: "78%", color: "rgba(168,85,247,0.8)",  delay: 0.8 },
];

export function SaaSAnim() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-32 w-full">
        {/* connection lines */}
        {USERS.map((u, i) => (
          <motion.line key={i} x1={u.cx} y1={u.cy} x2="65%" y2="50%"
            stroke={u.color} strokeWidth="0.7" strokeDasharray="3 2"
            animate={reduce ? {} : { strokeOpacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2, delay: u.delay, repeat: Infinity }} />
        ))}

        {/* animated packets */}
        {!reduce && USERS.map((u, i) => (
          <motion.circle key={`pk${i}`} r="1.5" fill={u.color}
            animate={{ cx: [u.cx, "65%"], cy: [u.cy, "50%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, delay: u.delay, repeat: Infinity, ease: "linear" }} />
        ))}

        {/* user avatar circles */}
        {USERS.map((u, i) => (
          <g key={`u${i}`}>
            <circle cx={u.cx} cy={u.cy} r="7" fill="rgba(255,255,255,0.04)" stroke={u.color} strokeWidth="0.8" />
            <circle cx={u.cx} cy={u.cy} r="3.5" fill={u.color} />
          </g>
        ))}

        {/* central platform */}
        <motion.rect x="54%" y="38%" width="22%" height="24%" rx="3%"
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"
          animate={reduce ? {} : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity }} />
        {/* platform lines */}
        {[42, 48, 54].map((y, i) => (
          <rect key={i} x="57%" y={`${y}%`} width={`${12 - i * 3}%`} height="1.5%" rx="1%"
            fill="rgba(255,255,255,0.3)" />
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. Web Applications — browser with animated cursor + UI
───────────────────────────────────────────────────────────── */
export function WebAppAnim() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className="w-44 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.04] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red-400/60" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
          <span className="h-2 w-2 rounded-full bg-green-400/60" />
          <div className="ml-2 h-1.5 flex-1 rounded-full bg-white/10" />
        </div>

        {/* page content */}
        <div className="relative p-3">
          {/* heading bar */}
          <motion.div className="mb-2 h-2.5 w-3/4 rounded-full bg-white/25"
            animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }} />
          {/* text lines */}
          {[85, 70, 55].map((w, i) => (
            <motion.div key={i} className="mb-1.5 h-1.5 rounded-full bg-white/12"
              style={{ width: `${w}%` }}
              animate={reduce ? {} : { opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} />
          ))}
          {/* CTA button */}
          <motion.div className="mt-3 h-5 w-20 rounded-md bg-indigo-500/40 border border-indigo-400/40"
            animate={reduce ? {} : { scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }} />

          {/* cursor */}
          {!reduce && (
            <motion.div className="pointer-events-none absolute"
              animate={{ x: [10, 68, 68, 10], y: [10, 10, 36, 10], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path d="M0 0L0 12L3 9L5.5 14L7 13L4.5 8L8 8Z" fill="white" fillOpacity="0.85" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. Cloud Solutions — nodes orbiting a central cloud icon
───────────────────────────────────────────────────────────── */
const CLOUD_NODES = [
  { angle: -60,  color: "rgba(20,184,166,0.8)",  delay: 0    },
  { angle:   0,  color: "rgba(99,102,241,0.8)",  delay: 0.5  },
  { angle:  60,  color: "rgba(168,85,247,0.8)",  delay: 1.0  },
];

function polarToPercent(angleDeg: number, r = 32, cx = 50, cy = 50) {
  const a = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function CloudAnim() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-32 w-full">
        {/* connection lines to centre */}
        {CLOUD_NODES.map((n, i) => {
          const { x, y } = polarToPercent(n.angle);
          return (
            <motion.line key={i} x1={`${x}%`} y1={`${y}%`} x2="50%" y2="50%"
              stroke={n.color} strokeWidth="0.7" strokeDasharray="3 2"
              animate={reduce ? {} : { strokeOpacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2, delay: n.delay, repeat: Infinity }} />
          );
        })}

        {/* data packets */}
        {!reduce && CLOUD_NODES.map((n, i) => {
          const { x, y } = polarToPercent(n.angle);
          return (
            <motion.circle key={`dp${i}`} r="1.5" fill={n.color}
              animate={{ cx: [`${x}%`, "50%"], cy: [`${y}%`, "50%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.2, delay: n.delay, repeat: Infinity, ease: "linear" }} />
          );
        })}

        {/* server nodes */}
        {CLOUD_NODES.map((n, i) => {
          const { x, y } = polarToPercent(n.angle);
          return (
            <g key={`cn${i}`}>
              <motion.rect x={`${x - 7}%`} y={`${y - 5}%`} width="14%" height="10%" rx="2%"
                fill="rgba(255,255,255,0.04)" stroke={n.color} strokeWidth="0.8"
                animate={reduce ? {} : { opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, delay: n.delay, repeat: Infinity }} />
              <rect x={`${x - 4}%`} y={`${y - 2}%`} width="8%" height="1.5%" rx="1%" fill={n.color} opacity="0.7" />
              <rect x={`${x - 4}%`} y={`${y + 1}%`} width="5%" height="1.5%" rx="1%" fill={n.color} opacity="0.4" />
            </g>
          );
        })}

        {/* central cloud */}
        <motion.path
          d="M43,54 Q40,54 40,50 Q40,45 45,45 Q46,42 50,41 Q54,40 57,43 Q61,42 62,46 Q65,46 65,50 Q65,54 62,54 Z"
          fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"
          animate={reduce ? {} : { opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }} />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. Data Analytics — live animated bar chart
───────────────────────────────────────────────────────────── */
const BARS = [
  { color: "rgba(20,184,166,0.7)",  heights: [40, 65, 40] },
  { color: "rgba(99,102,241,0.7)",  heights: [70, 45, 70] },
  { color: "rgba(168,85,247,0.7)",  heights: [55, 80, 55] },
  { color: "rgba(20,184,166,0.5)",  heights: [85, 55, 85] },
  { color: "rgba(99,102,241,0.5)",  heights: [45, 75, 45] },
];

export function DataAnim() {
  const reduce = useReducedMotion();
  const maxH = 72;

  return (
    <div className="flex h-full items-end justify-center gap-1 px-6 pb-4">
      {/* y-axis */}
      <div className="mb-0 mr-1 flex h-[72px] flex-col justify-between">
        {[100, 50, 0].map((v) => (
          <span key={v} className="text-[8px] text-white/30 leading-none">{v}</span>
        ))}
      </div>

      <div className="flex flex-1 items-end gap-1.5">
        {BARS.map((b, i) => (
          <div key={i} className="relative flex flex-1 flex-col items-center">
            <motion.div
              className="w-full rounded-t-sm"
              style={{ background: b.color }}
              animate={reduce ? { height: maxH * b.heights[0] / 100 } : {
                height: b.heights.map((h) => maxH * h / 100),
              }}
              transition={{ duration: 2.5, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. Automation Systems — flow nodes with animated packet
───────────────────────────────────────────────────────────── */
const FLOW = [
  { cx: 15, cy: 50, label: "Trigger" },
  { cx: 38, cy: 25, label: "Filter"  },
  { cx: 62, cy: 25, label: "Action"  },
  { cx: 85, cy: 50, label: "Done"    },
] as const;

const FLOW_EDGES = [[0, 1], [1, 2], [2, 3]] as const;

export function AutomationAnim() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-32 w-full">
        {/* edges */}
        {FLOW_EDGES.map(([a, b], i) => (
          <g key={i}>
            <motion.line
              x1={`${FLOW[a].cx}%`} y1={`${FLOW[a].cy}%`}
              x2={`${FLOW[b].cx}%`} y2={`${FLOW[b].cy}%`}
              stroke="rgba(20,184,166,0.3)" strokeWidth="0.8" strokeDasharray="3 2"
              animate={reduce ? {} : { strokeOpacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }} />

            {/* animated packet */}
            {!reduce && (
              <motion.circle r="2" fill="rgba(20,184,166,0.95)"
                animate={{
                  cx: [`${FLOW[a].cx}%`, `${FLOW[b].cx}%`],
                  cy: [`${FLOW[a].cy}%`, `${FLOW[b].cy}%`],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 1.2, delay: i * 0.6, repeat: Infinity, ease: "linear" }} />
            )}
          </g>
        ))}

        {/* nodes */}
        {FLOW.map((n, i) => (
          <g key={`fn${i}`}>
            <motion.circle cx={`${n.cx}%`} cy={`${n.cy}%`} r="9"
              fill="rgba(255,255,255,0.04)" stroke="rgba(20,184,166,0.7)" strokeWidth="0.8"
              animate={reduce ? {} : { opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: i * 0.35, repeat: Infinity }} />
            {/* checkmark for last node */}
            {i === 3 ? (
              <motion.path d="M82,50 L84,53 L88,47" stroke="rgba(20,184,166,0.9)" strokeWidth="1.2"
                fill="none" strokeLinecap="round"
                animate={reduce ? {} : { opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, delay: 1.8, repeat: Infinity }} />
            ) : (
              <text x={`${n.cx}%`} y={`${n.cy + 1}%`} textAnchor="middle"
                fontSize="4" fill="rgba(255,255,255,0.5)" dominantBaseline="middle">
                {i + 1}
              </text>
            )}
          </g>
        ))}

        {/* branch node bottom */}
        <motion.circle cx="38%" cy="75%" r="7"
          fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.4)" strokeWidth="0.7"
          animate={reduce ? {} : { opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity }} />
        <motion.line x1="38%" y1="34%" x2="38%" y2="68%"
          stroke="rgba(99,102,241,0.3)" strokeWidth="0.7" strokeDasharray="2 2"
          animate={reduce ? {} : { strokeOpacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }} />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   8. UI/UX Design — palette + morphing card + pen cursor
───────────────────────────────────────────────────────────── */
const SWATCHES = [
  "rgba(20,184,166,0.85)",
  "rgba(99,102,241,0.85)",
  "rgba(168,85,247,0.85)",
  "rgba(245,158,11,0.85)",
  "rgba(239,68,68,0.85)",
];

export function UIUXAnim() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-4">
      {/* design canvas */}
      <motion.div
        className="relative w-44 rounded-xl border border-white/10 bg-white/[0.03] p-3"
        animate={reduce ? {} : { y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* header bar */}
        <div className="mb-2 flex items-center gap-1.5">
          <div className="h-1.5 w-12 rounded-full bg-indigo-400/50" />
          <div className="ml-auto h-4 w-8 rounded-md border border-white/15 bg-white/[0.05]" />
        </div>
        {/* layout skeleton */}
        <div className="flex gap-2">
          <motion.div className="h-14 w-16 rounded-lg bg-white/[0.06] border border-white/[0.08]"
            animate={reduce ? {} : { borderColor: ["rgba(255,255,255,0.08)", "rgba(99,102,241,0.5)", "rgba(255,255,255,0.08)"] }}
            transition={{ duration: 2.5, repeat: Infinity }} />
          <div className="flex flex-1 flex-col justify-between">
            <div className="h-1.5 w-full rounded-full bg-white/20" />
            <div className="h-1.5 w-3/4 rounded-full bg-white/12" />
            <div className="h-4 w-10 rounded-md bg-purple-500/40" />
          </div>
        </div>
      </motion.div>

      {/* colour swatches */}
      <div className="flex gap-1.5">
        {SWATCHES.map((color, i) => (
          <motion.div
            key={i}
            className="h-4 w-4 rounded-full"
            style={{ background: color }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.1 * i, duration: 0.3, type: "spring" }}
            {...(!reduce && {
              animate: { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] },
              transition: { duration: 2, delay: i * 0.2, repeat: Infinity },
            })}
          />
        ))}
      </div>
    </div>
  );
}
