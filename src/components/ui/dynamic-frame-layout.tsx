"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Frame {
  id: number;
  video: string;
}

interface DynamicFrameLayoutProps {
  frames: Frame[];
  className?: string;
  hoverSize?: number;
  gapSize?: number;
  cols?: number;
  overlay?: (frame: Frame, index: number) => ReactNode;
}

function HoverVideo({ src, isHovered }: { src: string; isHovered: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (isHovered) {
      v.play().catch(() => null);
    } else {
      v.pause();
    }
  }, [isHovered]);

  return (
    <>
      <video
        ref={ref}
        src={src}
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: "translateZ(0)" }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: "rgba(5,5,5,0.75)",
          opacity: isHovered ? 0.15 : 0.6,
        }}
      />
    </>
  );
}

export function DynamicFrameLayout({
  frames,
  className,
  hoverSize = 3,
  gapSize = 4,
  cols = 4,
  overlay,
}: DynamicFrameLayoutProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const rows: Frame[][] = [];
  for (let i = 0; i < frames.length; i += cols) {
    rows.push(frames.slice(i, i + cols));
  }

  const hoveredRow = hovered !== null ? Math.floor(frames.findIndex((f) => f.id === hovered) / cols) : -1;

  return (
    <div
      className={cn("flex flex-col", className)}
      style={{ gap: gapSize }}
    >
      {rows.map((row, ri) => {
        const hoveredInRow = row.find((f) => f.id === hovered);
        const colTemplate = hoveredInRow
          ? row.map((f) => (f.id === hovered ? `${hoverSize}fr` : "1fr")).join(" ")
          : row.map(() => "1fr").join(" ");

        return (
          <div
            key={ri}
            style={{
              display: "grid",
              gridTemplateColumns: colTemplate,
              gap: gapSize,
              flex: ri === hoveredRow ? 1.6 : 1,
              transition: "grid-template-columns 0.5s cubic-bezier(0.22, 1, 0.36, 1), flex 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              minHeight: 0,
            }}
          >
            {row.map((frame, ci) => {
              const globalIndex = ri * cols + ci;
              const isActive = frame.id === hovered;
              return (
                <div
                  key={frame.id}
                  className="relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900"
                  onMouseEnter={() => setHovered(frame.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <HoverVideo src={frame.video} isHovered={isActive} />
                  {overlay?.(frame, globalIndex)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
