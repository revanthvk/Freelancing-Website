"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  tag: string;
}

const AUTO_ADVANCE_MS = 3500;

interface CircularCarouselProps {
  items: CarouselItem[];
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function CircularCarousel({ items, className }: CircularCarouselProps) {
  const [active, setActive] = useState(0);
  const count = items.length;

  function offsetFor(i: number) {
    let diff = i - active;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  }

  function go(delta: number) {
    setActive((a) => (a + delta + count) % count);
  }

  // Auto-advance in a continuous loop; resets on any manual navigation
  // since `active` is a dependency, so clicks don't fight the timer.
  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [active, count]);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative mx-auto h-[300px] max-w-2xl">
        {items.map((item, i) => {
          const offset = offsetFor(i);
          const abs = Math.abs(offset);
          const isActive = offset === 0;
          if (abs > 2) return null;

          const x = offset * 165;
          const y = abs * 48;
          const scale = isActive ? 1 : Math.max(0.8, 0.92 - (abs - 1) * 0.08);
          const opacity = isActive ? 1 : Math.max(0.2, 0.55 - (abs - 1) * 0.22);

          return (
            <div
              key={item.id}
              className="absolute left-1/2 top-0 -translate-x-1/2"
              style={{ zIndex: 20 - abs }}
            >
              <motion.button
                type="button"
                onClick={() => setActive(i)}
                animate={{ x, y, scale, opacity }}
                transition={{ duration: 0.6, ease: EASE }}
                className={cn(
                  "block h-[150px] w-[230px] shrink-0 rounded-2xl border px-5 pb-5 pt-3 text-left",
                  isActive
                    ? "border-white/[0.14] bg-neutral-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
                    : "cursor-pointer border-white/[0.08] bg-neutral-900/80"
                )}
              >
                <span className="inline-block rounded-md bg-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/60">
                  {item.tag}
                </span>
                <h3 className="mt-3 font-display text-base font-bold leading-snug text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-400">
                  {item.description}
                </p>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Index counter */}
      <div className="mt-6 flex flex-col items-center">
        <motion.span
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="font-display text-4xl font-bold text-white tnum"
        >
          {String(active + 1).padStart(2, "0")}
        </motion.span>
        <span className="mt-1 text-sm text-neutral-500 tnum">
          of {String(count).padStart(2, "0")}
        </span>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.1] text-white/60 transition-colors hover:border-white/25 hover:text-white"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex items-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to ${item.title}`}
              className="p-1.5"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-6 bg-white" : "w-1.5 bg-white/25"
                )}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.1] text-white/60 transition-colors hover:border-white/25 hover:text-white"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
