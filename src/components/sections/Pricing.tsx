"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";

/* ── Pricing data ────────────────────────────────────────────────────────── */
const PLANS = [
  {
    name: "Starter",
    emoji: null as string | null,
    tagline: "For landing pages, portfolio websites, and small business websites.",
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    startingFrom: null as number | null,
    cta: "Get Started",
    ctaHref: "#contact",
    popular: false,
    includesLabel: "Includes",
    features: [
      "Up to 5 Sections",
      "Responsive Design",
      "Basic SEO",
      "Contact Form",
      "2 Revisions",
      "5–7 Days Delivery",
      "Free Deployment",
    ],
    highlighted: [] as string[],
  },
  {
    name: "Professional",
    tagline: "For startups and growing businesses.",
    monthlyPrice: 24999,
    yearlyPrice: 249990,
    startingFrom: null as number | null,
    cta: "Start a Project",
    ctaHref: "#contact",
    popular: true,
    includesLabel: "Everything in Starter, PLUS",
    features: [
      "Up to 12 Pages",
      "Custom UI/UX Design",
      "Admin Dashboard",
      "Database Integration",
      "Authentication",
      "AI Chatbot Integration",
      "CMS Integration",
      "4 Revisions",
      "10–14 Days Delivery",
      "1 Month Support",
    ],
    highlighted: [
      "AI Chatbot Integration",
      "Admin Dashboard",
      "1 Month Support",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For SaaS products, AI platforms, and enterprise solutions.",
    monthlyPrice: null as number | null,
    yearlyPrice: null as number | null,
    startingFrom: 49999,
    cta: "Contact Us",
    ctaHref: "#contact",
    popular: false,
    includesLabel: "Includes",
    features: [
      "Full Stack Development",
      "AI/LLM Integration",
      "Custom APIs",
      "Payment Gateway",
      "Role-Based Authentication",
      "Performance Optimization",
      "Priority Support",
      "Ongoing Maintenance",
    ],
    highlighted: [] as string[],
  },
] as const;

/* ── Monthly / Yearly switch ─────────────────────────────────────────────── */
function PricingSwitch({ onSwitch }: { onSwitch: (value: string) => void }) {
  const [selected, setSelected] = useState("0");

  function handleSwitch(value: string) {
    setSelected(value);
    onSwitch(value);
  }

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full border border-white/[0.1] bg-white/[0.03] p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 h-10 w-fit rounded-full px-4 py-1 text-sm font-medium transition-colors sm:px-6 sm:py-2",
            selected === "0" ? "text-neutral-950" : "text-neutral-400"
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute left-0 top-0 h-10 w-full rounded-full bg-white"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 h-10 w-fit flex-shrink-0 rounded-full px-4 py-1 text-sm font-medium transition-colors sm:px-6 sm:py-2",
            selected === "1" ? "text-neutral-950" : "text-neutral-400"
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute left-0 top-0 h-10 w-full rounded-full bg-white"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Yearly</span>
        </button>
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */
export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  // Sparkles run a continuous canvas animation — only render it while the
  // section is actually on screen instead of burning CPU the whole time
  // the visitor is anywhere else on the page.
  const [sparklesVisible, setSparklesVisible] = useState(false);
  useEffect(() => {
    const el = pricingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSparklesVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
    hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  return (
    <section
      id="pricing"
      className="dark-island relative overflow-hidden bg-black py-24 md:py-32"
      ref={pricingRef}
    >
      {/* Sparkles background — only mounted while the section is in view */}
      {sparklesVisible && (
        <Sparkles
          density={280}
          direction="bottom"
          speed={0.8}
          color="#38BDF8"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      )}

      <div className="container-x relative">
        <article className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-white/20" aria-hidden />
            Pricing
          </span>

          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.12}
              staggerFrom="first"
              containerClassName="justify-center"
              transition={{ type: "spring", stiffness: 250, damping: 40 }}
            >
              Simple packages, no surprises
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Transparent starting points. Every engagement is scoped to your goals
            after a quick call — you&apos;ll always know what you&apos;re paying for.
          </TimelineContent>

          <TimelineContent
            as="div"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="pt-4"
          >
            <PricingSwitch onSwitch={(v) => setIsYearly(v === "1")} />
          </TimelineContent>
        </article>

        <div className="grid items-center gap-4 md:grid-cols-3">
          {PLANS.map((plan, index) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <TimelineContent
                key={plan.name}
                as="div"
                animationNum={2 + index}
                timelineRef={pricingRef}
                customVariants={revealVariants}
              >
                <Card
                  className={cn(
                    "relative flex flex-col border-0 bg-transparent text-white",
                    plan.popular
                      ? "z-20 shadow-[0px_-40px_120px_-30px_rgba(56,189,248,0.35)] lg:-translate-y-3"
                      : "z-10"
                  )}
                >
                  {plan.popular && (
                    <span
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-semibold text-neutral-950"
                      style={{
                        background: "linear-gradient(120deg, #bae6fd 0%, #38bdf8 60%, #0284c7 100%)",
                      }}
                    >
                      Most popular
                    </span>
                  )}

                  <CardHeader className="text-left">
                    <p className="text-base font-semibold text-white/90">
                      {plan.name}
                    </p>

                    <div className="mt-2 flex items-baseline">
                      {price === null ? (
                        <span className="font-display text-4xl font-bold text-white">Custom</span>
                      ) : (
                        <NumberFlow
                          value={price}
                          format={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }}
                          className="font-display text-4xl font-bold text-white"
                        />
                      )}
                    </div>
                    {plan.startingFrom !== null && (
                      <p className="mt-1 text-xs text-neutral-500">
                        Starting from ₹{plan.startingFrom.toLocaleString("en-IN")}
                      </p>
                    )}
                    <p className="mb-2 mt-2 text-sm text-neutral-400">{plan.tagline}</p>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col pt-0">
                    <a
                      href={plan.ctaHref}
                      className={cn(
                        "mb-6 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200",
                        plan.popular
                          ? "bg-white text-neutral-950 hover:bg-neutral-100 active:scale-[0.98]"
                          : "border border-white/[0.14] bg-white/[0.05] text-white/80 hover:bg-white/[0.09] hover:text-white active:scale-[0.98]"
                      )}
                    >
                      {plan.cta}
                    </a>

                    <div className="flex-1 space-y-3 border-t border-white/[0.08] pt-5">
                      <p className="mb-3 text-xs text-neutral-500">{plan.includesLabel}</p>
                      <ul className="space-y-2.5">
                        {plan.features.map((feature) => {
                          const isHighlighted = (plan.highlighted as readonly string[]).includes(feature);
                          return (
                            <li key={feature} className="flex items-start gap-2.5">
                              <Check
                                className={cn(
                                  "mt-0.5 size-4 shrink-0",
                                  isHighlighted ? "text-sky-400" : "text-neutral-600"
                                )}
                              />
                              <span
                                className={cn(
                                  "text-sm",
                                  isHighlighted ? "text-white/90" : "text-neutral-400"
                                )}
                              >
                                {feature}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TimelineContent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
