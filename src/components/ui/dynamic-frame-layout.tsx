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

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

/** Loads and plays only once `shouldPlay` is true, and pauses (without
 * unmounting, so it doesn't re-buffer) once it's no longer the active tile. */
function GridVideo({ src, isHovered, shouldPlay }: { src: string; isHovered: boolean; shouldPlay: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasLoaded, setHasLoaded] = useState(shouldPlay);

  useEffect(() => {
    if (shouldPlay) setHasLoaded(true);
  }, [shouldPlay]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (shouldPlay) {
      // Mobile browsers are inconsistent about honoring a scripted play()
      // right after mount — retry once the video actually has data if the
      // first attempt was rejected, rather than silently giving up.
      const tryPlay = () => v.play().catch(() => {});
      tryPlay();
      v.addEventListener("loadeddata", tryPlay);
      return () => v.removeEventListener("loadeddata", tryPlay);
    } else {
      v.pause();
    }
  }, [shouldPlay, hasLoaded]);

  return (
    <div className="absolute inset-0">
      {hasLoaded && (
        <video
          ref={videoRef}
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
  const isDesktop = useIsDesktop();
  const tileRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [mostVisibleId, setMostVisibleId] = useState<number | null>(null);

  // Decoding video is expensive, and playing all 9 tiles at once tanks the
  // frame rate on any device. Desktop has real hover, so use that to pick
  // the one active tile (defaulting to the first when nothing's hovered).
  // Mobile has no hover and typically sees the grid one row at a time, so
  // track whichever tile is most visible in the viewport instead.
  useEffect(() => {
    if (isDesktop) return;
    const ratios = new Map<number, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = Number((entry.target as HTMLElement).dataset.frameId);
          ratios.set(id, entry.intersectionRatio);
        });
        let best: number | null = null;
        let bestRatio = 0.3; // require meaningful visibility before switching
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (best !== null) setMostVisibleId(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    tileRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isDesktop, frames.length]);

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
              const shouldPlay = isDesktop
                ? frame.id === (hovered ?? frames[0].id)
                : frame.id === mostVisibleId;
              return (
                <div
                  key={frame.id}
                  ref={(el) => {
                    if (el) tileRefs.current.set(frame.id, el);
                    else tileRefs.current.delete(frame.id);
                  }}
                  data-frame-id={frame.id}
                  className="relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900"
                  onMouseEnter={() => setHovered(frame.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <GridVideo src={frame.video} isHovered={isActive} shouldPlay={shouldPlay} />
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
