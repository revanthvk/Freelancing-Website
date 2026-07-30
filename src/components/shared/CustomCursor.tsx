"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible]     = useState(false);
  const [clicking, setClicking]   = useState(false);
  const [hovering, setHovering]   = useState(false);

  const rawX = useRef(0);
  const rawY = useRef(0);

  const springCfg = { stiffness: 400, damping: 32, mass: 0.6 };
  const x = useSpring(0, springCfg);
  const y = useSpring(0, springCfg);

  const dotSpring = { stiffness: 800, damping: 40, mass: 0.2 };
  const dx = useSpring(0, dotSpring);
  const dy = useSpring(0, dotSpring);

  useEffect(() => {
    /* hide on touch devices */
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      rawX.current = e.clientX;
      rawY.current = e.clientY;
      x.set(e.clientX);
      y.set(e.clientY);
      dx.set(e.clientX);
      dy.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive =
        t.closest("a,button,input,textarea,select,[role=button],[data-cursor-hover]") !== null;
      setHovering(isInteractive);
    };

    const down = () => setClicking(true);
    const up   = () => setClicking(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove",  move,  { passive: true });
    window.addEventListener("mouseover",  over,  { passive: true });
    window.addEventListener("mousedown",  down);
    window.addEventListener("mouseup",    up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove",  move);
      window.removeEventListener("mouseover",  over);
      window.removeEventListener("mousedown",  down);
      window.removeEventListener("mouseup",    up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      window.removeEventListener("mousemove", move);
    };
  }, [x, y, dx, dy, visible]);

  if (typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ x, y, opacity: visible ? 1 : 0 }}
        animate={{
          width:  hovering ? 52 : clicking ? 28 : 40,
          height: hovering ? 52 : clicking ? 28 : 40,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: hovering
              ? "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.1) 60%, transparent 100%)"
              : "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 100%)",
            border: hovering
              ? "1px solid rgba(139,92,246,0.5)"
              : "1px solid rgba(255,255,255,0.15)",
            transition: "background 0.2s, border 0.2s",
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: dx,
          y: dy,
          opacity: visible ? 1 : 0,
          backgroundColor: hovering ? "#818cf8" : "#ffffff",
          scale: clicking ? 0.5 : 1,
        }}
      />
    </>
  );
}
