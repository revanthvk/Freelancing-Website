"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;   /* default 12 deg */
  shine?: boolean;
}

export function TiltCard({ children, className, intensity = 12, shine = true }: TiltCardProps) {
  const ref   = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -intensity;
    const ry = ((e.clientX - cx) / (rect.width  / 2)) *  intensity;

    el.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
    el.style.transition = "transform 0.08s ease-out";

    if (shine && shineRef.current) {
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      shineRef.current.style.background =
        `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.09) 0%, transparent 65%)`;
      shineRef.current.style.opacity = "1";
    }
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform  = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    el.style.transition = "transform 0.45s cubic-bezier(0.03,0.98,0.52,0.99)";
    if (shine && shineRef.current) shineRef.current.style.opacity = "0";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      className={cn("relative", className)}
    >
      {shine && (
        <div
          ref={shineRef}
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-200"
        />
      )}
      {children}
    </div>
  );
}
