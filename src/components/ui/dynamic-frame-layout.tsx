"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Frame {
  id: number;
  video: string;
  poster: string;
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
  // Starts as `null` ("not yet known") rather than defaulting to true —
  // these video files are 5-31MB each, so guessing "desktop" for even one
  // render on a mobile device is enough to kick off a real fetch. Callers
  // treat null the same as mobile (poster only) until this resolves.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
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
function GridVideo({ src, poster, isHovered, shouldPlay }: { src: string; poster: string; isHovered: boolean; shouldPlay: boolean }) {
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
          poster={poster}
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
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const MAX_CONCURRENT = 3; // enough to feel alive without decoding all 9 at once

  // A stable-per-id ref callback matters here: an inline arrow function is a
  // new function every render, so React tears it down and reattaches it on
  // every single re-render (every hover, every visibility change) — if the
  // observer effect below happens to run mid-churn, it can end up watching
  // zero tiles and never recover, leaving every video permanently unloaded.
  // Cache one callback per id so the same function reference is reused
  // across renders instead of creating a fresh closure each time.
  const refCallbacks = useRef<Map<number, (el: HTMLDivElement | null) => void>>(new Map());
  const getTileRef = useCallback((id: number) => {
    let cb = refCallbacks.current.get(id);
    if (!cb) {
      cb = (el: HTMLDivElement | null) => {
        if (el) tileRefs.current.set(id, el);
        else tileRefs.current.delete(id);
      };
      refCallbacks.current.set(id, cb);
    }
    return cb;
  }, []);

  // Decoding video is expensive, and playing all 9 tiles at once tanks the
  // frame rate on any device — but playing just one at a time reads as
  // "barely anything is moving." Cap it at a handful instead: enough tiles
  // active to feel alive, far fewer than 9 so it stays smooth. Desktop uses
  // hover for the single active tile; mobile has no hover, so track the
  // tiles closest to the viewport's vertical center instead.
  //
  // This deliberately isn't IntersectionObserver-ratio-based: once several
  // tiles are simultaneously fully visible they all saturate at ratio 1.0,
  // so a "sort by ratio" selection gets permanently stuck on whichever
  // tiles reached 1.0 first and never updates again as you keep scrolling.
  // Distance-from-center has no such ceiling and updates continuously.
  useEffect(() => {
    if (isDesktop) return;
    let raf = 0;

    const recompute = () => {
      raf = 0;
      const viewportCenter = window.innerHeight / 2;
      const withDistance: { id: number; dist: number }[] = [];
      tileRefs.current.forEach((el, id) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return; // fully off-screen
        const tileCenter = r.top + r.height / 2;
        withDistance.push({ id, dist: Math.abs(tileCenter - viewportCenter) });
      });
      withDistance.sort((a, b) => a.dist - b.dist);
      const top = withDistance.slice(0, MAX_CONCURRENT).map((t) => t.id);
      if (top.length > 0) setVisibleIds(top);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(recompute);
    };

    recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isDesktop, frames]);

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
                : visibleIds.includes(frame.id);
              return (
                <div
                  key={frame.id}
                  ref={getTileRef(frame.id)}
                  data-frame-id={frame.id}
                  className="relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900"
                  onMouseEnter={() => setHovered(frame.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <GridVideo src={frame.video} poster={frame.poster} isHovered={isActive} shouldPlay={shouldPlay} />
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
