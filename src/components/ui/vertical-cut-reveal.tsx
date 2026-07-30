"use client";

import { motion, type Transition } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface VerticalCutRevealProps {
  children: string;
  splitBy?: "words" | "chars";
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number;
  reverse?: boolean;
  containerClassName?: string;
  wordClassName?: string;
  transition?: Transition;
}

export function VerticalCutReveal({
  children,
  splitBy = "words",
  staggerDuration = 0.1,
  staggerFrom = "first",
  reverse = false,
  containerClassName,
  wordClassName,
  transition,
}: VerticalCutRevealProps) {
  const units = useMemo(
    () => (splitBy === "chars" ? children.split("") : children.split(" ")),
    [children, splitBy],
  );

  function getDelay(index: number) {
    let distance: number;
    if (staggerFrom === "first") distance = index;
    else if (staggerFrom === "last") distance = units.length - 1 - index;
    else if (staggerFrom === "center") distance = Math.abs(index - (units.length - 1) / 2);
    else distance = Math.abs(index - staggerFrom);
    return distance * staggerDuration;
  }

  return (
    <span className={cn("inline-flex flex-wrap", containerClassName)}>
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden py-1">
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={{ y: reverse ? "-100%" : "100%" }}
            animate={{ y: "0%" }}
            transition={{ ...transition, delay: getDelay(i) }}
          >
            {unit}
            {splitBy === "words" && i < units.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
