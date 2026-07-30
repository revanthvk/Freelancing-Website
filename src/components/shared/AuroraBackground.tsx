"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/* ── GLSL ─────────────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2  uResolution;

  /* --- noise primitives --- */
  float hash(vec2 p) {
    float h = dot(p, vec2(127.1, 311.7));
    return fract(sin(h) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),             hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float t  = uTime * 0.10;

    /* domain-warped fbm for fluid aurora movement */
    vec2 q = vec2(fbm(uv            + t * 0.6),
                  fbm(uv + vec2(1.7, 9.2)     ));
    vec2 r = vec2(fbm(uv + 2.0*q + vec2(1.7, 9.2) + t * 0.35),
                  fbm(uv + 2.0*q + vec2(8.3, 2.8) + t * 0.25));
    float f = fbm(uv * 2.0 + 2.0 * r + t * 0.5);

    /* primary aurora band — mid-height, undulates */
    float y1   = uv.y - (0.52 + r.y * 0.18);
    float band1 = exp(-abs(y1) * 6.5) * (f * 0.75 + 0.25) * 0.70;

    /* secondary band — higher up, thinner */
    float y2   = uv.y - (0.72 + r.x * 0.10);
    float band2 = exp(-abs(y2) * 12.0)
                * (fbm(uv * 3.0 + t * 0.45) * 0.55 + 0.2) * 0.35;

    /* tertiary faint streak near bottom */
    float y3   = uv.y - (0.30 + r.y * 0.08);
    float band3 = exp(-abs(y3) * 18.0)
                * fbm(uv * 5.0 - t * 0.2) * 0.18;

    /* dark navy base — matches neutral-950 warmth */
    vec3 col = vec3(0.020, 0.022, 0.038);

    /* aurora colours — teal ↔ indigo blend driven by noise */
    vec3 teal   = vec3(0.00, 0.85, 0.65);
    vec3 indigo = vec3(0.38, 0.12, 0.90);
    vec3 azure  = vec3(0.10, 0.55, 0.90);

    col += band1 * mix(teal, indigo, smoothstep(0.3, 0.7, f));
    col += band2 * azure;
    col += band3 * teal * 0.6;

    /* subtle atmospheric top-glow */
    col += (1.0 - uv.y) * 0.03 * vec3(0.05, 0.15, 0.30);

    /* stars */
    float s = hash(floor(uv * 700.0));
    col += step(0.9975, s) * mix(0.5, 0.9, hash(floor(uv * 300.0)));

    /* vignette */
    vec2 vc = uv - 0.5;
    col *= 1.0 - dot(vc, vc) * 1.35;

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;

/* ── Component ────────────────────────────────────────────────────────────── */

type Props = { className?: string } & Omit<React.ComponentProps<"div">, "ref">;

export function AuroraBackground({ className, ...props }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.RawShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime:       { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
    });

    scene.add(new THREE.Mesh(geometry, material));

    /* capped at 30 fps for performance */
    let rafId   = 0;
    let lastTs  = 0;
    const FRAME = 1000 / 30;

    const tick = (ts: number) => {
      rafId = requestAnimationFrame(tick);
      if (ts - lastTs < FRAME) return;
      lastTs = ts;
      material.uniforms.uTime.value = ts / 1000;
      renderer.render(scene, camera);
    };

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none fixed inset-0 -z-10", className)}
      {...props}
    />
  );
}
