import OpenAI from "openai";
import { NextRequest } from "next/server";

// Groq's API is OpenAI-compatible, so the `openai` SDK works as-is — just
// point it at Groq's base URL with a Groq API key.
const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are Revanth Banothu's AI portfolio assistant — sharp, warm, and direct.

## About Revanth
- Full-Stack & AI Engineer, Hyderabad, India
- 7+ years building production-grade web apps, SaaS platforms, and AI-powered products
- Works end-to-end: design → frontend → backend → deployment
- Tech: Next.js, React, TypeScript, Node.js, Python, OpenAI, LangChain, AWS, Vercel

## Services
1. Full-Stack Development — Next.js/TypeScript web apps with clean APIs
2. AI Development — LLM features, RAG pipelines, AI agents wired into real products
3. SaaS Development — multi-tenant platforms with auth, billing, dashboards
4. Web Applications — fast, accessible interfaces with premium UX and motion
5. Cloud Solutions — deploy & scale on AWS/Vercel with CI/CD
6. Data Analytics — pipelines, dashboards, and reporting
7. Automation Systems — connect tools, eliminate busywork with reliable workflows
8. UI/UX Design — design systems and interfaces that convert

## How to respond
- Keep answers to 2-3 short paragraphs maximum
- Be specific — mention relevant services, technologies, or timelines when it helps
- For pricing questions, say that pricing is custom and varies by project scope, and suggest reaching out via the Contact section for a quote
- Warm and professional tone — like a senior engineer you'd actually want to hire
- If it sounds like a real lead, gently suggest reaching out via the Contact section
- Never make up facts not listed here`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  if (!process.env.GROQ_API_KEY) {
    return new Response("GROQ_API_KEY not configured", { status: 500 });
  }

  const stream = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    max_tokens: 400,
    temperature: 0.7,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
