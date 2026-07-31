"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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

/** Plays automatically, but only once scrolled near the viewport — with 9 videos
 * on the page, autoplaying all of them immediately would compete with the Hero
 * video for bandwidth on load and waste data on cards the visitor hasn't reached. */
function HoverVideo({ src, isHovered }: { src: string; isHovered: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {inView && (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "translateZ(0)" }}
        />
      )}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: "rgba(5,5,5,0.75)",
          opacity: isHovered ? 0.15 : 0.6,
        }}
      />
    </div>
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
