"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Point {
  x: number;
  y: number;
  age: number;
}

export function TubesBackground({ children }: { children?: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pts = useRef<Point[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const hue = useRef(220);
  const raf = useRef(0);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();

    function tick() {
      ctx!.clearRect(0, 0, c!.width, c!.height);

      const m = mouse.current;
      if (m.x > 0) pts.current.push({ x: m.x, y: m.y, age: 0 });

      pts.current = pts.current.filter((p) => { p.age++; return p.age < 60; });

      const P = pts.current;
      if (P.length > 2) {
        for (let t = 0; t < 3; t++) {
          const off = (t - 1) * 10;
          const h = hue.current + t * 50;

          ctx!.beginPath();
          ctx!.strokeStyle = `hsla(${h}, 70%, 55%, ${0.15 - t * 0.03})`;
          ctx!.lineWidth = 1;
          ctx!.shadowColor = `hsla(${h}, 70%, 55%, 0.25)`;
          ctx!.shadowBlur = 6;

          ctx!.moveTo(P[0].x + off, P[0].y + off);
          for (let i = 1; i < P.length - 1; i++) {
            const fade = 1 - P[i].age / 60;
            if (fade <= 0) continue;
            const xc = (P[i].x + P[i + 1].x) / 2 + off * fade;
            const yc = (P[i].y + P[i + 1].y) / 2 + off * fade;
            ctx!.quadraticCurveTo(
              P[i].x + off * fade,
              P[i].y + off * fade,
              xc,
              yc,
            );
          }
          ctx!.stroke();
        }
        ctx!.shadowBlur = 0;
      }

      raf.current = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onClick = () => { hue.current = Math.random() * 360; };
    const onLeave = () => { mouse.current = { x: -1000, y: -1000 }; };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    window.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: 9999, mixBlendMode: "screen" }}
      />
      {children}
    </>
  );
}
