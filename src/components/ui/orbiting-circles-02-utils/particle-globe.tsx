"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Evenly distributes `count` points across a sphere surface (golden-angle spiral). */
function fibonacciSpherePositions(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }

  return positions;
}

/** Dense, vivid sparkle palette: blue-dominant with white "stars" and warm flecks. */
function sphereVertexColors(count: number) {
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    if (roll < 0.12) {
      // bright white stars
      color.setHSL(0.6, 0.5, 0.92);
    } else if (roll < 0.18) {
      // occasional warm flecks for variety
      color.setHSL(0.08 + Math.random() * 0.05, 0.75, 0.55);
    } else {
      // dominant cool blues/violets
      const hue = 0.55 + Math.random() * 0.2;
      const saturation = 0.75 + Math.random() * 0.2;
      const lightness = 0.4 + Math.random() * 0.3;
      color.setHSL(hue, saturation, lightness);
    }
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return colors;
}

export default function ParticleGlobeAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const RADIUS = 1.4;
    const COUNT = 2200;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(fibonacciSpherePositions(COUNT, RADIUS), 3)
    );
    geometry.setAttribute("color", new THREE.BufferAttribute(sphereVertexColors(COUNT), 3));

    const material = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const shellGeometry = new THREE.SphereGeometry(RADIUS, 24, 16);
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: 0x5b8def,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    scene.add(shell);

    function resize() {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      points.rotation.y += 0.0022;
      shell.rotation.y = points.rotation.y;
      const tilt = Math.sin(Date.now() * 0.00015) * 0.15;
      points.rotation.x = tilt;
      shell.rotation.x = tilt;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      shellGeometry.dispose();
      shellMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
