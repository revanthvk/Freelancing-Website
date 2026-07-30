"use client";

import { HexLogo } from "./HexLogo";
import { cn } from "@/lib/utils";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function AIGreeting({ size = "lg", className }: { size?: "lg" | "sm"; className?: string }) {
  const greeting = getGreeting();
  return (
    <div className={cn("text-center", className)}>
      <div className={cn("mx-auto mb-4 flex items-center justify-center text-white", size === "lg" ? "h-12 w-12" : "h-8 w-8")}>
        <HexLogo className="h-full w-full" />
      </div>
      <h1
        className={cn(
          "font-display font-medium tracking-tight text-white",
          size === "lg" ? "text-3xl sm:text-4xl" : "text-lg",
        )}
      >
        {greeting},{" "}
        <span className="relative inline-block pb-1.5">
          Revanth
          <svg
            className="absolute -bottom-0.5 left-[-4%] h-[12px] w-[108%] text-blue-400"
            viewBox="0 0 140 24"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M6 16 Q 70 24, 134 14"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </span>
      </h1>
    </div>
  );
}
