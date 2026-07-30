"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = [
  { label: "GitHub", href: siteConfig.socials.github, icon: Github },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: Linkedin },
  { label: "Twitter / X", href: siteConfig.socials.x, icon: Twitter },
  { label: "WhatsApp", href: siteConfig.socials.whatsapp, icon: MessageCircle },
];

function Fade({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="dark-island relative w-full border-t border-white/[0.06]" style={{ background: "#000000" }}>
      {/* CTA strip */}
      <div className="mx-auto w-full max-w-6xl px-6 py-24 text-center lg:px-8 lg:py-32">
        <Fade>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-600">
            Ready to start?
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white">
            Let&apos;s build something
            <span className="text-neutral-500"> worth shipping.</span>
          </h2>
          <div className="mt-8">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-neutral-950 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              Start a Project
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Fade>
      </div>

      {/* Divider */}
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="h-px w-full bg-white/[0.06]" />
      </div>

      {/* Footer grid */}
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <Fade>
            <div className="lg:col-span-1">
              <a href="#hero" className="font-display text-lg font-bold text-white">
                Revanth Banothu
              </a>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">
                Software Engineer • UI/UX Designer
              </p>
            </div>
          </Fade>

          {/* Navigation */}
          <Fade delay={0.06}>
            <div>
              <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                Navigation
              </h4>
              <ul className="space-y-2.5">
                {NAV.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-neutral-600 transition-colors duration-200 hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Fade>

          {/* Contact */}
          <Fade delay={0.12}>
            <div>
              <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                Contact
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors duration-200 hover:text-white">
                    <Mail className="size-3.5" />
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors duration-200 hover:text-white">
                    <Phone className="size-3.5" />
                    {siteConfig.phone}
                  </a>
                </li>
                <li className="inline-flex items-center gap-2 pt-1 text-sm text-neutral-700">
                  <MapPin className="size-3.5" />
                  {siteConfig.location}
                </li>
              </ul>
            </div>
          </Fade>

          {/* Social */}
          <Fade delay={0.18}>
            <div>
              <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                Social
              </h4>
              <ul className="space-y-2.5">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors duration-200 hover:text-white">
                      <s.icon className="size-3.5" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Fade>
        </div>
      </div>

      {/* Scanline name — REVANTH */}
      <div className="relative w-full overflow-hidden">
        <div className="flex w-full items-center justify-center px-2 py-10 md:py-16">
          <span
            className="block w-full select-none text-center font-display font-bold uppercase leading-none"
            style={{
              fontSize: "clamp(5rem, 20vw, 18rem)",
              letterSpacing: "-0.05em",
              background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.13) 0px, rgba(255,255,255,0.13) 1px, transparent 1px, transparent 5px)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            REVANTH
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 sm:flex-row">
          <p className="text-xs text-neutral-700">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <a href="#hero" className="group inline-flex items-center gap-2 text-xs text-neutral-700 transition-colors hover:text-neutral-400">
            Back to top
            <span className="grid h-6 w-6 place-items-center rounded-full border border-white/[0.06] text-[10px] transition-colors group-hover:border-white/[0.12]">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
