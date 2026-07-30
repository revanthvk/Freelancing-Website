"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, RotateCcw } from "lucide-react";
import ClaudeChatInput from "@/components/ui/claude-style-chat-input";
import { cn } from "@/lib/utils";

const AIOrb = dynamic(
  () => import("@/components/shared/AIOrb").then((m) => ({ default: m.AIOrb })),
  { ssr: false, loading: () => <div className="h-full w-full" /> },
);

/* ── Typewriter placeholder ──────────────────────────────────────────────── */
const PROMPTS = [
  "What services do you offer for AI startups?",
  "Can you build a SaaS product from scratch?",
  "What's your typical project timeline?",
  "Do you integrate OpenAI into existing products?",
  "What's your core tech stack?",
  "How do we get started on a project?",
];

function useTypewriter(strings: string[], speed = 55, del = 28, pause = 1800) {
  const [shown, setShown] = useState("");
  const [idx, setIdx]     = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    const cur = strings[idx % strings.length];
    const t = setTimeout(() => {
      if (!erasing) {
        setShown(cur.slice(0, shown.length + 1));
        if (shown.length + 1 === cur.length) setTimeout(() => setErasing(true), pause);
      } else {
        setShown(cur.slice(0, shown.length - 1));
        if (shown.length === 0) { setErasing(false); setIdx(i => i + 1); }
      }
    }, erasing ? del : speed);
    return () => clearTimeout(t);
  }, [shown, erasing, idx, strings, speed, del, pause]);

  return shown;
}

/* ── Chat types ──────────────────────────────────────────────────────────── */
type Msg = { role: "user" | "assistant"; content: string };

const CHIPS = [
  "Tell me about your services",
  "Can you build AI-powered apps?",
  "What's your tech stack?",
  "How do we get started?",
];

/* ── Main section ────────────────────────────────────────────────────────── */
export function AIAssistant() {
  const placeholder = useTypewriter(PROMPTS);
  const [msgs, setMsgs]         = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [open, setOpen]         = useState(false);
  const respRef = useRef<HTMLDivElement>(null);
  const abort   = useRef<AbortController | null>(null);

  /* scroll to latest message */
  useEffect(() => {
    if (msgs.length) respRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs]);

  const send = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q || streaming) return;
    const history: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setStreaming(true);
    abort.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abort.current.signal,
      });
      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const dec    = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs(prev => {
          const c = [...prev];
          c[c.length - 1] = { role: "assistant", content: acc };
          return c;
        });
      }
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError") {
        setMsgs(prev => {
          const c = [...prev];
          c[c.length - 1] = { role: "assistant", content: "Sorry, something went wrong. Reach out via the Contact section." };
          return c;
        });
      }
    } finally {
      setStreaming(false);
    }
  }, [msgs, streaming]);

  const reset = () => {
    abort.current?.abort();
    setMsgs([]);
    setStreaming(false);
    setOpen(false);
  };

  const hasMsgs = msgs.length > 0;
  const userCount = msgs.filter(m => m.role === "user").length;

  return (
    <section id="ai-assistant" className="dark-island relative overflow-hidden bg-black py-28 md:py-36">

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="container-x relative z-10 flex flex-col items-center text-center">

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-neutral-400"
        >
          <Sparkles size={11} className="text-blue-400" />
          Revanth&apos;s Assistant
        </motion.span>

        {/* AI Orb avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 h-[120px] w-[120px] overflow-hidden rounded-full shadow-[0_0_48px_rgba(124,58,237,0.35)] ring-1 ring-white/[0.10]"
        >
          <AIOrb />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[1.1]"
        >
          Start a Conversation
        </motion.h2>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.14 }}
          className="font-display text-4xl font-bold tracking-tight text-blue-400 sm:text-5xl lg:text-[3.75rem] lg:leading-[1.1]"
        >
          with Revanth&apos;s Assistant
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-500"
        >
          Ask about services, pricing, timelines, or tech.
        </motion.p>

        {/* CTA button — hides when chat opens */}
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.button
              key="cta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              onClick={() => setOpen(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-all hover:bg-neutral-100 active:scale-[0.98]"
            >
              Try Revanth&apos;s Assistant <ArrowUpRight size={14} />
            </motion.button>
          ) : null}
        </AnimatePresence>

        {/* ── Chat panel (revealed on CTA click) ───────────────────── */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 w-full max-w-xl text-left"
            >
              {/* Quick chips */}
              {!hasMsgs && (
                <div className="mb-3 flex flex-wrap justify-center gap-2">
                  {CHIPS.map(c => (
                    <button
                      key={c}
                      onClick={() => send(c)}
                      className="rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-1.5 text-xs text-neutral-500 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {/* Conversation history */}
              {hasMsgs && (
                <div
                  ref={respRef}
                  className="mb-3 max-h-72 overflow-y-auto rounded-2xl border border-white/[0.07] bg-black/70 p-4 backdrop-blur-xl"
                >
                  <div className="space-y-4">
                    {msgs.map((m, i) => (
                      <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                        {/* Avatar */}
                        <div className={cn(
                          "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs",
                          m.role === "assistant"
                            ? "bg-gradient-to-br from-blue-500 to-violet-500 text-white"
                            : "bg-white/[0.08] text-white/70"
                        )}>
                          {m.role === "assistant" ? <Sparkles size={11} /> : "Y"}
                        </div>
                        {/* Bubble */}
                        <div className={cn(
                          "max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed",
                          m.role === "assistant"
                            ? "bg-white/[0.05] text-white/85"
                            : "border border-blue-500/20 bg-blue-500/10 text-white/85"
                        )}>
                          {m.content || (
                            <span className="flex gap-1">
                              {[0, 1, 2].map(j => (
                                <motion.span
                                  key={j}
                                  className="h-1.5 w-1.5 rounded-full bg-white/40"
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 1, delay: j * 0.2, repeat: Infinity }}
                                />
                              ))}
                            </span>
                          )}
                          {streaming && i === msgs.length - 1 && m.content && (
                            <motion.span
                              className="ml-0.5 inline-block h-3.5 w-0.5 bg-blue-400 align-middle"
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input — Claude-style, no model selector */}
              <ClaudeChatInput
                onSendMessage={(message) => send(message)}
                placeholder={`${placeholder}|`}
                disabled={streaming}
              />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-white/25">
                  {hasMsgs
                    ? `${userCount} message${userCount !== 1 ? "s" : ""}`
                    : "Enter ↵ to send · Shift+Enter for new line"}
                </span>
                {hasMsgs && (
                  <button
                    onClick={reset}
                    title="Clear conversation"
                    className="grid h-7 w-7 place-items-center rounded-lg text-white/30 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>

              <p className="mt-3 text-center text-xs text-white/20">
                For exact quotes reach out via the{" "}
                <a href="#contact" className="underline underline-offset-2 transition-colors hover:text-white/40">
                  Contact section
                </a>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
