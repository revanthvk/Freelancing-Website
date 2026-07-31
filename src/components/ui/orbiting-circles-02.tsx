"use client";

import React from "react";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiDocker,
  SiKubernetes,
  SiFigma,
  SiLangchain,
  SiAnthropic,
  SiVercel,
  SiGithub,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import ParticleGlobeAnimation from "@/components/ui/orbiting-circles-02-utils/particle-globe";

type Tool = { Icon: IconType; label: string; color: string; url: string };

type Ring = {
  label: string;
  size: string;
  duration: number;
  direction: "cw" | "ccw";
  tools: Tool[];
};

const RINGS: Ring[] = [
  {
    label: "Skills",
    size: "w-64 h-64 md:w-96 md:h-96",
    duration: 38,
    direction: "cw",
    tools: [
      { Icon: SiReact, label: "React", color: "#61DAFB", url: "https://react.dev" },
      { Icon: SiNextdotjs, label: "Next.js", color: "#FFFFFF", url: "https://nextjs.org" },
      { Icon: SiTypescript, label: "TypeScript", color: "#3178C6", url: "https://www.typescriptlang.org" },
      { Icon: SiTailwindcss, label: "Tailwind CSS", color: "#38BDF8", url: "https://tailwindcss.com" },
      { Icon: SiNodedotjs, label: "Node.js", color: "#339933", url: "https://nodejs.org" },
      { Icon: SiExpress, label: "Express", color: "#FFFFFF", url: "https://expressjs.com" },
      { Icon: SiPython, label: "Python", color: "#3776AB", url: "https://www.python.org" },
    ],
  },
  {
    label: "Tools",
    size: "w-[24rem] h-[24rem] md:w-[36rem] md:h-[36rem]",
    duration: 52,
    direction: "ccw",
    tools: [
      { Icon: SiMongodb, label: "MongoDB", color: "#47A248", url: "https://www.mongodb.com" },
      { Icon: SiPostgresql, label: "PostgreSQL", color: "#4169E1", url: "https://www.postgresql.org" },
      { Icon: SiMysql, label: "MySQL", color: "#4479A1", url: "https://www.mysql.com" },
      { Icon: FaAws, label: "AWS", color: "#FF9900", url: "https://aws.amazon.com" },
      { Icon: SiDocker, label: "Docker", color: "#2496ED", url: "https://www.docker.com" },
      { Icon: SiKubernetes, label: "Kubernetes", color: "#326CE5", url: "https://kubernetes.io" },
    ],
  },
  {
    label: "AI & Design",
    size: "w-[32rem] h-[32rem] md:w-[48rem] md:h-[48rem]",
    duration: 68,
    direction: "cw",
    tools: [
      { Icon: SiFigma, label: "Figma", color: "#A259FF", url: "https://figma.com" },
      { Icon: SiLangchain, label: "LangChain", color: "#4FD1C5", url: "https://www.langchain.com" },
      { Icon: SiAnthropic, label: "Claude", color: "#D97757", url: "https://claude.com" },
      { Icon: SiVercel, label: "Vercel", color: "#FFFFFF", url: "https://vercel.com" },
      { Icon: SiGithub, label: "GitHub", color: "#FFFFFF", url: "https://github.com" },
    ],
  },
];

export default function OrbitingCirclesGlobeDemo() {
  return (
    <div className="relative flex h-[22rem] w-full items-center justify-center overflow-hidden bg-black md:h-[56rem] md:overflow-visible">
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
        }
        @keyframes spin-y {
          from { transform: rotateY(0deg) }
          to   { transform: rotateY(360deg) }
        }
        .tool-orbit-link:hover {
          filter: drop-shadow(0 0 10px var(--glow)) drop-shadow(0 0 22px var(--glow));
        }
      `}</style>

      {/* Scaled wrapper — shrinks the whole diagram as one unit on mobile so no ring/icon
          extends past the viewport edge; desktop renders at native scale. */}
      <div
        className="relative w-[32rem] h-[32rem] scale-[0.6] md:w-[48rem] md:h-[48rem] md:scale-100"
        style={{ transformOrigin: "center center" }}
      >
        {/* Center — dense colorful particle globe */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-40 -translate-x-1/2 -translate-y-1/2 md:w-60" style={{ aspectRatio: "1 / 1" }}>
          <ParticleGlobeAnimation />
        </div>

        {/* Rings */}
        {RINGS.map((ring) => {
          const orbitAnim = ring.direction === "cw" ? "orbit-cw" : "orbit-ccw";
          const counterAnim = ring.direction === "cw" ? "counter-cw" : "counter-ccw";
          const count = ring.tools.length;

          return (
            <div
              key={ring.label}
              className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.15] ${ring.size}`}
              style={{ boxShadow: "0 0 16px rgba(56,189,248,0.15), inset 0 0 16px rgba(56,189,248,0.08)" }}
            >
              {ring.tools.map((tool, i) => {
                const Icon = tool.Icon;
                const angle = (360 / count) * i;
                const spinDuration = 5 + (i % 5);

                return (
                  <div
                    key={tool.label}
                    className="absolute left-1/2 top-0 -ml-6 flex h-1/2 origin-bottom flex-col items-center justify-start md:-ml-8"
                    style={
                      {
                        "--start-angle": `${angle}deg`,
                        animation: `${orbitAnim} ${ring.duration}s linear infinite`,
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className="-mt-6 md:-mt-8"
                      style={
                        {
                          "--counter-offset": `${-angle}deg`,
                          animation: `${counterAnim} ${ring.duration}s linear infinite`,
                        } as React.CSSProperties
                      }
                    >
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noreferrer"
                        title={tool.label}
                        aria-label={tool.label}
                        className="tool-orbit-link pointer-events-auto block transition-transform duration-200 hover:scale-125"
                        style={{ perspective: 400, "--glow": tool.color } as React.CSSProperties}
                      >
                        <div
                          className="relative h-12 w-12 md:h-16 md:w-16"
                          style={{
                            transformStyle: "preserve-3d",
                            animation: `spin-y ${spinDuration}s linear infinite`,
                          }}
                        >
                          <Icon
                            className="absolute inset-0 h-full w-full p-1.5 md:p-2"
                            style={{ color: tool.color, backfaceVisibility: "hidden" }}
                          />
                          <Icon
                            className="absolute inset-0 h-full w-full p-1.5 md:p-2"
                            style={{
                              color: tool.color,
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                            }}
                          />
                        </div>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
