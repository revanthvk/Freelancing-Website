"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle2, Loader2, Send } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

type Fields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  details: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Fields): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!emailRe.test(values.email)) errors.email = "Enter a valid email address.";
  if (values.details.trim().length < 10)
    errors.details = "Tell me a little more about the project.";
  return errors;
}

const initial: Fields = {
  name: "",
  email: "",
  phone: "",
  company: "",
  details: "",
};

export function Contact() {
  const [values, setValues] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("loading");
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setValues(initial);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const rails = [
    { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Location", value: siteConfig.location, href: undefined },
  ];

  return (
    <section id="contact" className="section">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1),transparent_70%)] blur-3xl"
      />
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Left rail */}
        <div>
          <SectionHeading
            align="left"
            eyebrow="Contact"
            title="Let's build something worth shipping"
            description="Tell me about your project and I'll reply within one business day with next steps."
          />

          <div className="mt-8 space-y-3">
            {rails.map((r) => {
              const Icon = r.icon;
              const content = (
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/40 px-5 py-4 transition-colors hover:border-cyan-500/30">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.04]">
                    <Icon className="size-5 text-neutral-300" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {r.label}
                    </p>
                    <p className="text-sm font-medium text-foreground">{r.value}</p>
                  </div>
                </div>
              );
              return r.href ? (
                <a key={r.label} href={r.href} className="block">
                  {content}
                </a>
              ) : (
                <div key={r.label}>{content}</div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-3">
            <Button asChild variant="secondary" className="flex-1">
              <a href={`mailto:${siteConfig.email}`}>
                Email me
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href={siteConfig.socials.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Form */}
        <Reveal delay={0.1}>
          <div className="border-gradient rounded-3xl bg-card/40 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="grid h-16 w-16 place-items-center rounded-full bg-white/10"
                  >
                    <CheckCircle2 className="size-8 text-white" />
                  </motion.span>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
                    Message sent
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Thanks for reaching out. I&apos;ll get back to you within one
                    business day.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-6"
                    onClick={() => setStatus("idle")}
                  >
                    Send another
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="grid gap-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Name"
                      id="name"
                      required
                      value={values.name}
                      onChange={(v) => update("name", v)}
                      error={errors.name}
                      placeholder="Revanth Banothu"
                    />
                    <Field
                      label="Email"
                      id="email"
                      type="email"
                      required
                      value={values.email}
                      onChange={(v) => update("email", v)}
                      error={errors.email}
                      placeholder="dev@revanth.space"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Phone"
                      id="phone"
                      value={values.phone}
                      onChange={(v) => update("phone", v)}
                      placeholder="Optional"
                    />
                    <Field
                      label="Company"
                      id="company"
                      value={values.company}
                      onChange={(v) => update("company", v)}
                      placeholder="Optional"
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <label
                      htmlFor="details"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Project details <span className="text-neutral-300">*</span>
                    </label>
                    <textarea
                      id="details"
                      rows={4}
                      value={values.details}
                      onChange={(e) => update("details", e.target.value)}
                      placeholder="What are you building, and what does success look like?"
                      aria-invalid={!!errors.details}
                      className="w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                    />
                    {errors.details && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.details}</p>
                    )}
                  </div>

                  {status === "error" && submitError && (
                    <p className="-mt-1 text-sm text-red-400">{submitError}</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "loading"}
                    className="w-full"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <Send />
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-neutral-300">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
