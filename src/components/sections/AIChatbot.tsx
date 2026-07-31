"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, RotateCcw, MessageCircle } from "lucide-react";
import ClaudeChatInput from "@/components/ui/claude-style-chat-input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

/* ── Floating trigger — gradient orb, matches the chat panel's own header ── */
function RobotButton({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AI chatbot"
      className="fixed bottom-6 right-6 z-50 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "scale(1)" : "scale(0.7)",
      }}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 shadow-2xl shadow-black/50"
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-violet-600"
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <MessageCircle size={26} className="relative text-white" strokeWidth={2} />
      </motion.div>
    </button>
  );
}

/* ── Floating AI Chatbot ────────────────────────────────────────────────── */
const CHIPS = ["Tell me about services", "Can you build AI apps?", "What's your tech stack?", "How do we start?"];

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (msgs.length) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
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
      const dec = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs((prev) => {
          const c = [...prev];
          c[c.length - 1] = { role: "assistant", content: acc };
          return c;
        });
      }
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError") {
        setMsgs((prev) => {
          const c = [...prev];
          c[c.length - 1] = { role: "assistant", content: "Sorry, something went wrong. Try the Contact section." };
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
  };

  return (
    <>
      {/* ── Floating robot button ─────────────────────────────────────── */}
      <RobotButton
        visible={!open}
        onClick={() => setOpen(true)}
      />

      {/* ── Chat panel ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[90vw] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/60"
            style={{ background: "#000000" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Revanth&apos;s AI</p>
                  <p className="text-[10px] text-neutral-600">Powered by Llama 3.3 70B</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {msgs.length > 0 && (
                  <button
                    onClick={reset}
                    title="Clear chat"
                    className="grid h-7 w-7 place-items-center rounded-lg text-neutral-600 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-7 w-7 place-items-center rounded-lg text-neutral-600 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
              {msgs.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Sparkles className="mb-3 size-6 text-purple-400/40" />
                  <p className="text-sm font-medium text-neutral-300">How can I help?</p>
                  <p className="mt-1 text-xs text-neutral-600">Ask about services, pricing, or tech.</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                    {CHIPS.map((c) => (
                      <button
                        key={c}
                        onClick={() => send(c)}
                        className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[11px] text-neutral-500 transition hover:border-purple-500/25 hover:bg-purple-500/10 hover:text-white"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {msgs.map((m, i) => (
                    <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                          m.role === "assistant"
                            ? "bg-white/[0.05] text-neutral-300"
                            : "bg-purple-500/15 text-neutral-200",
                        )}
                      >
                        {m.content || (
                          <span className="flex gap-1 py-1">
                            {[0, 1, 2].map((j) => (
                              <motion.span
                                key={j}
                                className="h-1.5 w-1.5 rounded-full bg-white/30"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, delay: j * 0.2, repeat: Infinity }}
                              />
                            ))}
                          </span>
                        )}
                        {streaming && i === msgs.length - 1 && m.content && (
                          <motion.span
                            className="ml-0.5 inline-block h-3 w-0.5 bg-purple-400 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input — Claude-style, no model selector */}
            <div className="border-t border-white/[0.06] px-3 py-3">
              <ClaudeChatInput
                onSendMessage={(message) => send(message)}
                placeholder="Ask something..."
                disabled={streaming}
                className="rounded-xl p-2"
              />
              <p className="mt-2 text-center text-[10px] text-neutral-700">
                For exact quotes, use the{" "}
                <a href="#contact" onClick={() => setOpen(false)} className="underline underline-offset-2 transition hover:text-neutral-500">
                  Contact section
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
