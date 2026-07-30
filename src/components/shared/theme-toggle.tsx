"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  /* avoid hydration mismatch */
  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onKeyDown={(e) => e.key === "Enter" && setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex h-8 w-16 cursor-pointer items-center rounded-full p-1 transition-all duration-300",
        isDark
          ? "border border-zinc-800 bg-zinc-950"
          : "border border-zinc-200 bg-white",
        className
      )}
    >
      <div className="flex w-full items-center justify-between">
        {/* active thumb */}
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300",
            isDark
              ? "translate-x-0 bg-zinc-800"
              : "translate-x-8 bg-gray-200"
          )}
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
          ) : (
            <Sun className="h-3.5 w-3.5 text-gray-700" strokeWidth={1.5} />
          )}
        </div>

        {/* inactive icon */}
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300",
            !isDark ? "-translate-x-8" : ""
          )}
        >
          {isDark ? (
            <Sun className="h-3.5 w-3.5 text-gray-500" strokeWidth={1.5} />
          ) : (
            <Moon className="h-3.5 w-3.5 text-black" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
}
