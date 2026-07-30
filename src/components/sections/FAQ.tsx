"use client";

import { motion } from "framer-motion";
import { FAQ as FaqTabs } from "@/components/ui/faq-tabs";

/* ── Data ────────────────────────────────────────────────────────────────── */
const CATEGORIES = {
  working: "Working Together",
  projects: "Process & Timeline",
  technical: "Technical",
  pricing: "Pricing",
} as const;

type Category = keyof typeof CATEGORIES;

const FAQ_DATA: Record<Category, { question: string; answer: string }[]> = {
  working: [
    {
      question: "Do you work with early-stage startups?",
      answer:
        "Yes, a large part of my work is helping founders go from idea to a launched, polished v1. I can also advise on architecture and tech choices throughout so you're building on the right foundation from day one.",
    },
    {
      question: "How do we communicate during a project?",
      answer:
        "We agree on a channel (Slack, email, or weekly calls) up front. You'll see progress in reviewable increments rather than one big reveal at the end — no surprises.",
    },
    {
      question: "What if I'm not sure exactly what I need?",
      answer:
        "That's completely normal. Book a free consultation and we'll map out the right scope together — no pressure, no jargon. You leave with clarity regardless of whether we work together.",
    },
    {
      question: "Do you provide support after launch?",
      answer:
        "Every project includes a post-launch support window. Growth and Scale engagements can include ongoing maintenance, monitoring, and feature work on a retainer basis.",
    },
  ],
  projects: [
    {
      question: "How long does a typical project take?",
      answer:
        "Launch-tier sites deliver in 5–7 days, Growth-tier products run 10–14 days, and Scale engagements are scoped after discovery depending on complexity. You'll get a precise timeline before we start.",
    },
    {
      question: "How does the process work from start to launch?",
      answer:
        "Discovery → Design → Build → Review → Launch. Each phase ends with a checkpoint where you approve before we move forward. Nothing ships without your sign-off.",
    },
    {
      question: "Can I see work in progress?",
      answer:
        "Absolutely. You'll get access to a staging environment from week one. You can leave comments directly on the live preview rather than trying to describe feedback over email.",
    },
    {
      question: "What happens if scope changes mid-project?",
      answer:
        "Scope changes happen — that's fine. Any addition that meaningfully changes the timeline or cost gets a quick written estimate before work starts. No surprise invoices.",
    },
  ],
  technical: [
    {
      question: "What does the AI work actually involve?",
      answer:
        "Anything from adding an LLM-powered assistant or semantic search, to building full RAG pipelines and autonomous agents. I focus on features that create real measurable value, not AI for its own sake.",
    },
    {
      question: "What's your core tech stack?",
      answer:
        "Frontend: Next.js, React, TypeScript, Tailwind. Backend: Node.js, Python, REST & GraphQL APIs. AI: OpenAI, LangChain, Pinecone. Infra: AWS, Vercel, Docker. I pick the right tool for the job — not the trendy one.",
    },
    {
      question: "Can you work with an existing codebase?",
      answer:
        "Yes. I'll do a brief audit first to understand the architecture, then scope the work from there. I've jumped into codebases of all sizes and conditions — it's part of the job.",
    },
    {
      question: "Do you build mobile apps too?",
      answer:
        "I build progressive web apps (PWAs) and React Native apps. For complex native features (ARKit, Bluetooth, etc.) I'll loop in a specialist — I'd rather tell you that upfront than overpromise.",
    },
  ],
  pricing: [
    {
      question: "What's included in each plan?",
      answer:
        "Launch covers landing pages and small business sites, Growth adds custom UI/UX, admin dashboards, and AI integrations for growing businesses, and Scale is a fully custom engagement starting from ₹49,999 for SaaS and AI platforms. Full breakdowns are on the Pricing section above.",
    },
    {
      question: "Is pricing monthly, yearly, or one-time?",
      answer:
        "The Pricing section shows both Monthly and Yearly figures — switch the toggle to compare. Every engagement is still scoped to your specific goals after a quick discovery call, so you'll always know the exact number before we start.",
    },
    {
      question: "Can I upgrade my plan later?",
      answer:
        "Yes. Many clients start with Launch or Growth and upgrade as their product grows. I'll credit what's already been built toward the next tier.",
    },
    {
      question: "What's not included in the price?",
      answer:
        "Third-party costs like hosting, domain names, premium plugins, and paid API usage (e.g. OpenAI credits) are billed separately at cost — I'll flag these upfront so there are no surprises.",
    },
    {
      question: "Is there a payment plan?",
      answer:
        "For Growth and Scale engagements, payments are typically split 50% upfront and 50% on delivery. Custom milestone-based plans are available for longer projects.",
    },
  ],
};

/* ── Main export ─────────────────────────────────────────────────────────── */
export function FAQ() {
  return (
    <section id="faq" className="section">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.07),transparent_70%)] blur-3xl"
      />

      <div className="container-x relative">
        <FaqTabs
          eyebrow="FAQ"
          title="Questions, answered"
          subtitle="Everything you'd want to know before we start working together."
          categories={CATEGORIES}
          faqData={FAQ_DATA}
        />

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <p className="text-sm text-neutral-600">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-2.5 text-sm font-medium text-neutral-300 transition-all hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white"
          >
            Get in touch →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
