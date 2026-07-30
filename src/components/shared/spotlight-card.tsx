"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Card that reveals a soft radial spotlight following the cursor. */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-colors duration-300 hover:border-white/15",
        className
      )}
    >
      {/* Spotlight layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x) var(--y), rgba(255,255,255,0.07), transparent 45%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
