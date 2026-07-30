"use client";

const ITEMS = [
  "Full-Stack Development",
  "AI & ML Solutions",
  "SaaS Products",
  "Web Applications",
  "UI/UX Design",
  "Cloud Infrastructure",
  "Data Analytics",
  "Automation Systems",
];

function MarqueeStrip() {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-10">
          <span className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em] text-white/20">
            {item}
          </span>
          <span className="text-[10px] text-white/10">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div
      className="dark-island relative overflow-hidden border-y border-white/[0.05] py-5"
      style={{ background: "#000000" }}
    >
      <div className="marquee-track flex">
        <MarqueeStrip />
        <MarqueeStrip />
      </div>
    </div>
  );
}
