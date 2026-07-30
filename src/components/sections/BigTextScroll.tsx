"use client";

export function BigTextScroll() {
  return (
    <div
      className="relative overflow-hidden py-16 md:py-24"
      style={{ background: "#000000" }}
    >
      {/* Scrolling track */}
      <div className="marquee-track flex items-center" style={{ animationDuration: "25s" }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10">
            {["DESIGN", "DEVELOP", "DELIVER"].map((word) => (
              <span key={`${copy}-${word}`} className="flex items-center gap-6 md:gap-10">
                <span
                  className="whitespace-nowrap uppercase leading-none text-white/60"
                  style={{
                    fontSize: "clamp(4.5rem, 13vw, 11rem)",
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontWeight: 300,
                    fontStretch: "condensed",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {word}
                </span>
                <span className="text-2xl text-white/10 md:text-3xl">+</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
