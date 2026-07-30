"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useMemo, type ElementType, type ReactNode, type RefObject } from "react";

interface TimelineContentProps {
  children: ReactNode;
  as?: ElementType;
  animationNum: number;
  timelineRef: RefObject<HTMLElement | null>;
  customVariants: Variants;
  className?: string;
  once?: boolean;
}

export function TimelineContent({
  children,
  as: Tag = "div",
  animationNum,
  timelineRef,
  customVariants,
  className,
  once = true,
}: TimelineContentProps) {
  const isInView = useInView(timelineRef, { once, amount: 0.2 });
  const MotionTag = useMemo(() => motion.create(Tag), [Tag]) as typeof motion.div;

  return (
    <MotionTag
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={customVariants}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
