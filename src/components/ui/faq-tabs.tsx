"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQEntry {
  question: string;
  answer: string;
}

interface FAQProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  categories: Record<string, string>;
  faqData: Record<string, FAQEntry[]>;
  className?: string;
}

function AccordionItem({ question, answer }: FAQEntry) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      className={cn(
        "rounded-2xl border transition-all duration-300",
        open
          ? "border-white/[0.1] bg-white/[0.05]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.09] hover:bg-white/[0.03]"
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span
          className={cn(
            "min-w-0 text-base font-medium leading-snug transition-colors duration-200",
            open ? "text-white" : "text-neutral-400"
          )}
        >
          {question}
        </span>
        <motion.span
          variants={{ open: { rotate: 45 }, closed: { rotate: 0 } }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="shrink-0"
        >
          <Plus
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              open ? "text-white" : "text-neutral-600"
            )}
          />
        </motion.span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-sm leading-relaxed text-neutral-500">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export function FAQ({ eyebrow, title, subtitle, categories, faqData, className }: FAQProps) {
  const keys = Object.keys(categories);
  const [active, setActive] = useState(keys[0]);

  return (
    <div className={cn("w-full", className)}>
      <div className="text-center">
        {eyebrow && (
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-white/20" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-400 md:text-lg">{subtitle}</p>
        )}
      </div>

      <div className="border-gradient mt-14 rounded-3xl bg-card/40 p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
          {/* Category tabs */}
          <div className="relative -mx-6 sm:-mx-8 lg:mx-0">
            {/* Fade hint that the row scrolls horizontally — mobile/tablet only */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-card/95 to-transparent lg:hidden"
            />
            <div className="flex gap-2 overflow-x-auto px-6 pb-2 sm:px-8 lg:flex-col lg:overflow-visible lg:border-r lg:border-white/[0.08] lg:px-0 lg:pb-0 lg:pr-8">
              {keys.map((key) => {
                const isActive = active === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={cn(
                      "relative shrink-0 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors duration-200 lg:w-full",
                      isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="faq-tab-active"
                        className="absolute inset-0 rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/[0.08]"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      >
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-sky-400" />
                      </motion.span>
                    )}
                    <span className="relative z-10 whitespace-nowrap lg:whitespace-normal">
                      {categories[key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accordion list */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-3"
              >
                {faqData[active]?.map((item, i) => (
                  <AccordionItem key={i} {...item} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
