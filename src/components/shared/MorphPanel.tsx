"use client";

import React from "react";
import { cx } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

/* ── ColorOrb ──────────────────────────────────────────────────────────────
   CSS for .color-orb lives in globals.css so we avoid styled-jsx.          */

interface OrbProps {
  dimension?: string;
  className?: string;
  tones?: {
    base?: string;
    accent1?: string;
    accent2?: string;
    accent3?: string;
  };
  spinDuration?: number;
}

const ColorOrb: React.FC<OrbProps> = ({
  dimension = "192px",
  className,
  tones,
  spinDuration = 20,
}) => {
  const fallbackTones = {
    base: "oklch(95% 0.02 264.695)",
    accent1: "oklch(75% 0.15 350)",
    accent2: "oklch(80% 0.12 200)",
    accent3: "oklch(78% 0.14 280)",
  };

  const palette = { ...fallbackTones, ...tones };
  const dim = parseInt(dimension.replace("px", ""), 10);
  const blur = dim < 50 ? Math.max(dim * 0.008, 1) : Math.max(dim * 0.015, 4);
  const contrast = dim < 50 ? Math.max(dim * 0.004, 1.2) : Math.max(dim * 0.008, 1.5);
  const dot = dim < 50 ? Math.max(dim * 0.004, 0.05) : Math.max(dim * 0.008, 0.1);
  const shadow = dim < 50 ? Math.max(dim * 0.004, 0.5) : Math.max(dim * 0.008, 2);
  const mask = dim < 30 ? "0%" : dim < 50 ? "5%" : dim < 100 ? "15%" : "25%";
  const adjContrast = dim < 30 ? 1.1 : dim < 50 ? Math.max(contrast * 1.2, 1.3) : contrast;

  return (
    <div
      className={cx("color-orb", className)}
      style={{
        width: dimension,
        height: dimension,
        "--base": palette.base,
        "--accent1": palette.accent1,
        "--accent2": palette.accent2,
        "--accent3": palette.accent3,
        "--spin-duration": `${spinDuration}s`,
        "--blur": `${blur}px`,
        "--contrast": adjContrast,
        "--dot": `${dot}px`,
        "--shadow": `${shadow}px`,
        "--mask": mask,
      } as React.CSSProperties}
    />
  );
};

/* ── Context ────────────────────────────────────────────────────────────── */

const SPEED = 1;
const FORM_WIDTH = 360;
const FORM_HEIGHT = 200;

interface CtxShape {
  showForm: boolean;
  triggerOpen: () => void;
  triggerClose: () => void;
}

const FormCtx = React.createContext({} as CtxShape);
const useFormCtx = () => React.useContext(FormCtx);

/* ── MorphPanel ─────────────────────────────────────────────────────────── */

export function MorphPanel() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const triggerClose = React.useCallback(() => {
    setShowForm(false);
    textareaRef.current?.blur();
  }, []);

  const triggerOpen = React.useCallback(() => {
    setShowForm(true);
    setTimeout(() => textareaRef.current?.focus());
  }, []);

  const handleSuccess = React.useCallback(() => {
    triggerClose();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
  }, [triggerClose]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node) && showForm) {
        triggerClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showForm, triggerClose]);

  const ctx = React.useMemo(
    () => ({ showForm, triggerOpen, triggerClose }),
    [showForm, triggerOpen, triggerClose]
  );

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: FORM_WIDTH, height: FORM_HEIGHT }}
    >
      <motion.div
        ref={wrapperRef}
        className="bg-background relative bottom-8 z-[3] flex flex-col items-center overflow-hidden border border-white/10"
        initial={false}
        animate={{
          width: showForm ? FORM_WIDTH : "auto",
          height: showForm ? FORM_HEIGHT : 44,
          borderRadius: showForm ? 14 : 20,
        }}
        transition={{
          type: "spring",
          stiffness: 550 / SPEED,
          damping: 45,
          mass: 0.7,
          delay: showForm ? 0 : 0.08,
        }}
      >
        <FormCtx.Provider value={ctx}>
          <DockBar />
          <InputForm ref={textareaRef} onSuccess={handleSuccess} />
        </FormCtx.Provider>
      </motion.div>
    </div>
  );
}

/* ── DockBar ────────────────────────────────────────────────────────────── */

function DockBar() {
  const { showForm, triggerOpen } = useFormCtx();
  return (
    <footer className="mt-auto flex h-[44px] items-center justify-center select-none">
      <div className="flex items-center gap-2 px-3">
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div key="blank" className="h-5 w-5" />
          ) : (
            <motion.div
              key="orb"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ColorOrb
                dimension="24px"
                tones={{ base: "oklch(22.64% 0 0)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="button"
          variant="ghost"
          className="h-fit flex-1 justify-end rounded-full px-2 py-0.5"
          onClick={triggerOpen}
        >
          Ask AI
        </Button>
      </div>
    </footer>
  );
}

/* ── InputForm ──────────────────────────────────────────────────────────── */

function InputForm({
  ref,
  onSuccess,
}: {
  ref: React.Ref<HTMLTextAreaElement>;
  onSuccess: () => void;
}) {
  const { showForm, triggerClose } = useFormCtx();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSuccess();
  }

  function handleKeys(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") triggerClose();
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      btnRef.current?.click();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-0"
      style={{
        width: FORM_WIDTH,
        height: FORM_HEIGHT,
        pointerEvents: showForm ? "all" : "none",
      }}
    >
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 550 / SPEED,
              damping: 45,
              mass: 0.7,
            }}
            className="flex h-full flex-col p-1"
          >
            <div className="flex justify-between py-1">
              <p className="z-[2] ml-[38px] flex items-center gap-[6px] text-sm text-foreground select-none">
                AI Input
              </p>
              <button
                type="submit"
                ref={btnRef}
                className="right-4 mt-1 flex -translate-y-[3px] cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-transparent pr-1 text-center text-foreground select-none"
              >
                <KeyHint>⌘</KeyHint>
                <KeyHint className="w-fit">Enter</KeyHint>
              </button>
            </div>
            <textarea
              ref={ref}
              placeholder="Ask me anything…"
              name="message"
              className="h-full w-full resize-none scroll-py-2 rounded-md bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              required
              onKeyDown={handleKeys}
              spellCheck={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 left-3"
          >
            <ColorOrb
              dimension="24px"
              tones={{ base: "oklch(22.64% 0 0)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function KeyHint({ children, className }: { children: string; className?: string }) {
  return (
    <kbd
      className={cx(
        "flex h-6 w-fit items-center justify-center rounded-sm border border-white/10 px-[6px] font-sans text-xs text-foreground",
        className
      )}
    >
      {children}
    </kbd>
  );
}
