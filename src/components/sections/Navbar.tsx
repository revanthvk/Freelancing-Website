"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  User,
  Layers,
  FolderGit2,
  Cpu,
  Workflow,
  IndianRupee,
  HelpCircle,
} from "lucide-react";
import { StarButton } from "@/components/ui/star-button";
import { ExpandableTabs, type TabItem } from "@/components/ui/expandable-tabs";
import { HexLogo } from "@/components/shared/HexLogo";
import { sectionIds, navLinks } from "@/lib/site-config";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

/** Tabs fed to ExpandableTabs — mirrors navLinks order with icons. */
const desktopTabs: TabItem[] = [
  { title: "About",      icon: User,        href: "#about"       },
  { title: "Services",   icon: Layers,      href: "#services"    },
  { type: "separator" },
  { title: "Work",       icon: FolderGit2,  href: "#portfolio"   },
  { title: "Skills",     icon: Cpu,         href: "#skills"      },
  { title: "Process",    icon: Workflow,    href: "#process"     },
  { title: "Pricing",    icon: IndianRupee, href: "#pricing"     },
  { title: "FAQ",        icon: HelpCircle,  href: "#faq"         },
];

/** Maps section id → tab index (separators don't count). */
const sectionToTabIndex: Record<string, number> = {
  about:      0,
  services:   1,
  // separator at 2
  portfolio:  3,
  skills:     4,
  process:    5,
  pricing:    6,
  faq:        7,
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  const activeTabIndex =
    active && sectionToTabIndex[active] !== undefined
      ? sectionToTabIndex[active]
      : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Primary"
        className={cn(
          "mt-4 flex w-[min(100%-1.5rem,80rem)] items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5",
          scrolled
            ? "glass shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]"
            : "border border-transparent bg-transparent"
        )}
      >
        {/* Brand — symbol + REVANTH */}
        <a
          href="#hero"
          aria-label="Revanth — Home"
          className="flex items-center gap-2 pl-1"
        >
          <HexLogo className="h-5 w-5 text-foreground" />
          <span className="font-display text-[0.85rem] font-semibold uppercase tracking-[0.12em] text-foreground">
            Revanth<sup className="ml-0.5 text-[0.5rem] align-super">®</sup>
          </span>
        </a>

        {/* Desktop — ExpandableTabs */}
        <div className="hidden lg:block">
          <ExpandableTabs
            tabs={desktopTabs}
            activeIndex={activeTabIndex}
            activeColor="text-foreground"
          />
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <StarButton href="#contact" lightColor="#FAFAFA" className="h-9 text-xs">
            Hire Me
          </StarButton>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="relative z-50 grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-white/[0.06] lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass absolute inset-x-3 top-20 rounded-3xl p-4"
            >
              <ul className="flex flex-col">
                {navLinks.map((link, i) => {
                  const id = link.href.replace("#", "");
                  const isActive = active === id;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                    >
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg transition-colors",
                          isActive
                            ? "bg-white/[0.06] text-foreground"
                            : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                        )}
                      >
                        {link.label}
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                        )}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="mt-3 flex items-center gap-3">
                <StarButton
                  href="#contact"
                  lightColor="#FAFAFA"
                  onClick={() => setOpen(false)}
                  className="h-12 flex-1 text-base"
                >
                  Hire Me
                </StarButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
