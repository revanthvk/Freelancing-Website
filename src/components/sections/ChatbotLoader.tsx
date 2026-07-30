"use client";

import dynamic from "next/dynamic";

const AIChatbot = dynamic(() => import("./AIChatbot").then((m) => ({ default: m.AIChatbot })), { ssr: false });

export function ChatbotLoader() {
  return <AIChatbot />;
}
