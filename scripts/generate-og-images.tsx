/**
 * Standalone script — generates favicon/apple-icon/OG image as static PNGs
 * in /public. Run with `npx tsx scripts/generate-og-images.tsx` whenever the
 * branding changes.
 *
 * Why this exists: Next.js's dev/build webpack pipeline forcibly aliases all
 * `@vercel/og` imports to its own bundled copy, which has a Windows-only bug
 * (malformed file:// path when loading its default fallback font). Running
 * this script directly via tsx/node bypasses Next.js's webpack entirely, so
 * the real npm package is used and the bug never triggers.
 */
import React from "react";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { ImageResponse } from "@vercel/og";

const PUBLIC_DIR = join(__dirname, "..", "public");

const SITE = {
  name: "Revanth Banothu",
  role: "Full-Stack & AI Engineer",
  tagline: "Building AI-Powered Digital Experiences That Drive Results",
  location: "Hyderabad, India",
  url: "revanth.space",
};

async function loadGoogleFont(family: string, weight: number, text: string) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`,
    )
  ).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`Could not resolve font URL for ${family}`);
  const res = await fetch(match[1]);
  return Buffer.from(await res.arrayBuffer());
}

const ASCII_CHARS =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

async function toPngBuffer(res: Response) {
  const arrBuf = await res.arrayBuffer();
  return Buffer.from(arrBuf);
}

function hexagonSvg(strokeWidth: number, size: number) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={strokeWidth}>
      <path d="M12 2 L22 8 L22 16 L12 22 L2 16 L2 8Z" />
      <path d="M12 8 L17 11 L17 15 L12 18 L7 15 L7 11Z" />
    </svg>
  );
}

async function generateIcon() {
  const font = await loadGoogleFont("Inter", 700, "R");
  const res = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        {hexagonSvg(1.6, 22)}
      </div>
    ),
    { width: 32, height: 32, fonts: [{ name: "Inter", data: font, weight: 700 }] },
  );
  writeFileSync(join(PUBLIC_DIR, "icon.png"), await toPngBuffer(res));
  console.log("✓ icon.png");
}

async function generateAppleIcon() {
  const font = await loadGoogleFont("Inter", 700, "R");
  const res = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        {hexagonSvg(1.4, 110)}
      </div>
    ),
    { width: 180, height: 180, fonts: [{ name: "Inter", data: font, weight: 700 }] },
  );
  writeFileSync(join(PUBLIC_DIR, "apple-icon.png"), await toPngBuffer(res));
  console.log("✓ apple-icon.png");
}

async function generateOgImage() {
  const [bold, medium, regular] = await Promise.all([
    loadGoogleFont("Inter", 700, ASCII_CHARS),
    loadGoogleFont("Inter", 500, ASCII_CHARS),
    loadGoogleFont("Inter", 400, ASCII_CHARS),
  ]);

  const res = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(59,130,246,0.18), transparent 45%), radial-gradient(circle at 85% 85%, rgba(168,85,247,0.16), transparent 45%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {hexagonSvg(1.5, 34)}
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#ffffff" }}>
            Revanth
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#ffffff" }}>
            {SITE.name}
          </span>
          <span
            style={{
              marginTop: 18,
              fontSize: 34,
              fontWeight: 500,
              backgroundImage: "linear-gradient(90deg, #00e5ff, #3b82f6, #a855f7)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {SITE.role}
          </span>
          <span style={{ marginTop: 26, fontSize: 24, color: "#999999", maxWidth: 820 }}>
            {SITE.tagline}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "#666666", fontSize: 20 }}>
          <span>{SITE.location}</span>
          <span>{SITE.url}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: bold, weight: 700 },
        { name: "Inter", data: medium, weight: 500 },
        { name: "Inter", data: regular, weight: 400 },
      ],
    },
  );
  writeFileSync(join(PUBLIC_DIR, "og-image.png"), await toPngBuffer(res));
  console.log("✓ og-image.png");
}

async function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  await generateIcon();
  await generateAppleIcon();
  await generateOgImage();
  console.log("\nAll images generated in /public");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
