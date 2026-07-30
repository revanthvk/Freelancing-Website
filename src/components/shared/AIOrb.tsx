"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────────
  Architecture
  • PlaneGeometry (grid of vertices) so the vertex shader can wave each vertex.
  • vWave varying passes wave height to fragment shader → crests glow brighter.
  • Four sine harmonics at different freq/dir/speed → organic, not mechanical.
  • Particle illumination pulses in sync with the disc wave.
───────────────────────────────────────────────────────────────────────────── */

/* ── Disc vertex ────────────────────────────────────────────────────────────── */
const DISC_VS = /* glsl */`
  uniform float uTime;
  varying vec2  vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 pos = position;

    /* Normalize position to ±1 (disc radius = 0.9 for core, 1.06 for halo) */
    float nx = pos.x / 0.9;
    float ny = pos.y / 0.9;
    float nr = length(vec2(nx, ny));

    /* ── Four traveling wave harmonics ─────────────────────────────────── *
     * w1 — main diagonal sweep                                             *
     * w2 — slow counter-wave                                               *
     * w3 — cross-axis ripple                                               *
     * w4 — radial ring pulse, fading toward edge                          */
    float w1 = sin(nx * 3.80 + uTime * 1.30) * 0.105;
    float w2 = sin(nx * 2.10 - uTime * 0.70) * 0.070;
    float w3 = sin(ny * 3.20 + uTime * 0.95) * 0.050;
    float w4 = sin(nr * 5.50 - uTime * 2.40) * 0.035
               * smoothstep(1.05, 0.0, nr);

    float wave = w1 + w2 + w3 + w4;
    pos.z  += wave;
    vWave   = wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/* ── Disc fragment ──────────────────────────────────────────────────────────── */
const DISC_FS = /* glsl */`
  uniform float uTime;
  uniform float uMult;
  varying vec2  vUv;
  varying float vWave;

  void main() {
    vec2  c = vUv - 0.5;
    float d = length(c) * 2.0;    /* 0 = centre, 1 = disc edge */
    if (d > 1.0) discard;

    /* Radial glow — wide, soft */
    float glow = pow(max(1.0 - d, 0.0), 0.62);

    /* Wave crests boost brightness */
    float crest = smoothstep(-0.06, 0.22, vWave);
    glow = glow * (0.72 + crest * 0.58)
         + crest * 0.28 * pow(max(1.0 - d, 0.0), 0.32);

    /* Colour gradient: pink/purple left → cyan/teal right,
       colour also drifts very slowly over time for variety */
    vec3 pink = vec3(0.72, 0.04, 0.88);
    vec3 cyan = vec3(0.04, 0.82, 1.00);
    float gx  = clamp(vUv.x + sin(uTime * 0.25) * 0.09, 0.0, 1.0);
    vec3  col = mix(pink, cyan, gx);

    /* White-hot core and crest highlight */
    col = mix(col, vec3(1.0, 0.97, 1.0), pow(glow, 1.45) * 0.93);
    col = mix(col, vec3(1.0), crest * 0.38 * glow);

    /* Gentle pulse so the whole disc breathes */
    float pulse = 0.90 + sin(uTime * 1.75) * 0.10;

    float alpha = glow * 0.97 * uMult * pulse;
    if (alpha < 0.005) discard;

    gl_FragColor = vec4(col * (0.86 + glow * 1.45), alpha);
  }
`;

/* ── Particle vertex ────────────────────────────────────────────────────────── */
const PT_VS = /* glsl */`
  uniform float uTime;
  uniform float uDiscY;
  attribute vec3 aColor;
  varying vec3   vColor;

  void main() {
    float planeD  = abs(position.y - uDiscY);
    float radialD = length(vec2(position.x, position.z));

    float planeGlow   = exp(-planeD * planeD * 6.2)
                      * smoothstep(1.15, 0.0, radialD) * 5.2;
    float ambientGlow = smoothstep(0.80, -0.80, position.y) * 0.52;

    /* Pulse illumination to stay in sync with disc wave */
    float pulse = 0.82 + sin(uTime * 1.75 + radialD * 1.8) * 0.18;
    float near  = min((planeGlow + ambientGlow) * pulse, 1.0);

    float grad    = (position.x + 1.1) * (1.0 / 2.2);
    vec3  discCol = mix(vec3(0.72, 0.04, 0.88), vec3(0.04, 0.82, 1.00), grad);

    vColor = clamp(mix(aColor, discCol, near * 0.80) + near * 0.30, 0.0, 1.0);

    gl_PointSize = 2.2;
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* ── Particle fragment ──────────────────────────────────────────────────────── */
const PT_FS = /* glsl */`
  varying vec3 vColor;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.10, r);
    gl_FragColor = vec4(vColor, a * 0.82);
  }
`;

/* ── Component ─────────────────────────────────────────────────────────────── */
export function AIOrb() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const [webglOK, setWebglOK] = useState(true);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth, H = el.clientHeight;
    const DISC_Y = -0.14;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 100);
    camera.position.z = 3.5;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglOK(false);
      return;
    }
    if (!renderer.getContext()) {
      setWebglOK(false);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    /* ── Dense particle sphere ──────────────────────────────────────────── */
    const N   = 18000;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);

    for (let i = 0; i < N; i++) {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r     = 1.08 + (Math.random() - 0.5) * 0.05;

      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);

      const t    = Math.random();
      col[i*3]   = 0.22 + t * 0.44;
      col[i*3+1] = 0.00 + t * 0.08;
      col[i*3+2] = 0.58 + t * 0.42;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("aColor",   new THREE.BufferAttribute(col, 3));

    const pMat = new THREE.ShaderMaterial({
      vertexShader:   PT_VS,
      fragmentShader: PT_FS,
      uniforms:       { uTime: { value: 0 }, uDiscY: { value: DISC_Y } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(pGeo, pMat));

    /* ── Glowing wave disc ──────────────────────────────────────────────── *
     * PlaneGeometry (instead of CircleGeometry) gives a full vertex grid   *
     * so the wave shader can displace every vertex independently.           */
    const makeDisc = (radius: number, mult: number) => {
      const segs = Math.round(radius * 66);             /* ~60 for r=0.90  */
      const geo  = new THREE.PlaneGeometry(
        radius * 2, radius * 2, segs, segs,
      );
      const mat  = new THREE.ShaderMaterial({
        vertexShader:   DISC_VS,
        fragmentShader: DISC_FS,
        uniforms:       { uTime: { value: 0 }, uMult: { value: mult } },
        transparent: true, side: THREE.DoubleSide, depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2 + 0.36;   /* mostly horizontal, visible face */
      mesh.position.y = DISC_Y;
      return { mesh, mat };
    };

    const d1 = makeDisc(0.90, 1.00);   /* sharp bright core  */
    const d2 = makeDisc(1.06, 0.23);   /* wide soft glow halo */
    group.add(d1.mesh, d2.mesh);

    /* ── Ambient outer skin ─────────────────────────────────────────────── */
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.22, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x330066, transparent: true, opacity: 0.04,
        side: THREE.BackSide, depthWrite: false,
      }),
    ));

    /* ── Render loop ────────────────────────────────────────────────────── */
    let t = 0;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      t += 0.016;

      pMat.uniforms.uTime.value   = t;
      d1.mat.uniforms.uTime.value = t;
      d2.mat.uniforms.uTime.value = t;

      /* Slow Y spin + gentle sway + tiny z flutter for liveliness */
      group.rotation.y = t * 0.042;
      group.rotation.x = Math.sin(t * 0.13) * 0.08;
      group.rotation.z = Math.sin(t * 0.08) * 0.035;

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  if (!webglOK) {
    return (
      <div className="grid h-full w-full place-items-center">
        <div
          className="color-orb h-[85%] w-[85%]"
          style={
            {
              "--accent1": "oklch(70% 0.20 330)",
              "--accent2": "oklch(78% 0.16 200)",
              "--accent3": "oklch(72% 0.18 280)",
              "--blur": "6px",
              "--contrast": "1.6",
              "--mask": "15%",
              "--spin-duration": "14s",
              "--shadow": "18px",
            } as React.CSSProperties
          }
        />
      </div>
    );
  }

  return <div ref={mountRef} className="h-full w-full" />;
}
