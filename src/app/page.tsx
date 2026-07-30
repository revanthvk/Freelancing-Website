import dynamic from "next/dynamic";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { BigTextScroll } from "@/components/sections/BigTextScroll";

// Below-fold sections lazy-loaded so they don't block initial page paint
const Services = dynamic(() => import("@/components/sections/Services").then((m) => ({ default: m.Services })));
const Portfolio = dynamic(() => import("@/components/sections/Portfolio").then((m) => ({ default: m.Portfolio })));
const Skills = dynamic(() => import("@/components/sections/Skills").then((m) => ({ default: m.Skills })));
const Process = dynamic(() => import("@/components/sections/Process").then((m) => ({ default: m.Process })));
const Pricing = dynamic(() => import("@/components/sections/Pricing").then((m) => ({ default: m.Pricing })));
const FAQ = dynamic(() => import("@/components/sections/FAQ").then((m) => ({ default: m.FAQ })));
const AIAssistant = dynamic(() => import("@/components/sections/AIAssistant").then((m) => ({ default: m.AIAssistant })));
const Contact = dynamic(() => import("@/components/sections/Contact").then((m) => ({ default: m.Contact })));
const Footer = dynamic(() => import("@/components/sections/Footer").then((m) => ({ default: m.Footer })));
const ChatbotLoader = dynamic(() => import("@/components/sections/ChatbotLoader").then((m) => ({ default: m.ChatbotLoader })));

export default function Home() {
  return (
    <>
      <Navbar />
      <ChatbotLoader />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <BigTextScroll />
        <Services />
        <Portfolio />
        <Marquee />
        <Skills />
        <Process />
        <Pricing />
        <FAQ />
        <AIAssistant />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
