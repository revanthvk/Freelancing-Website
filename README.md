# Premium Freelancer Portfolio — Phase 1

A black-luxury, fully responsive freelancer portfolio built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Radix**, and **Framer Motion**.

Design direction: *"midnight workshop"* — pure black (`#000000`) base with a warm **gold** (`#E8B04B`) signature accent and a cool **indigo** (`#6366F1`) secondary, set in Space Grotesk display / Inter body. Type-led, motion used with restraint, reduced-motion respected throughout.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build for production:

```bash
npm run build && npm start
```

Deploy to Vercel: push to a Git repo and import it — zero config needed.

## What's included (Phase 1)

| Section | File |
| --- | --- |
| Floating glass navbar + mobile menu | `src/components/sections/Navbar.tsx` |
| Hero (mouse-reactive glow, grid, marquee, stats) | `src/components/sections/Hero.tsx` |
| About (story, portrait, stat band) | `src/components/sections/About.tsx` |
| Services (spotlight cards) | `src/components/sections/Services.tsx` |
| Skills (animated progress) | `src/components/sections/Skills.tsx` |
| Experience (timeline) | `src/components/sections/Experience.tsx` |
| Portfolio (filterable grid) | `src/components/sections/Portfolio.tsx` |
| Testimonials (infinite marquee) | `src/components/sections/Testimonials.tsx` |
| Process (6 steps) | `src/components/sections/Process.tsx` |
| Pricing (3 tiers) | `src/components/sections/Pricing.tsx` |
| FAQ (accordion) | `src/components/sections/FAQ.tsx` |
| Contact (validated form + success state) | `src/components/sections/Contact.tsx` |
| Footer | `src/components/sections/Footer.tsx` |

## Folder structure

```
src/
├─ app/
│  ├─ globals.css        # design tokens, base styles, a11y, reduced-motion
│  ├─ layout.tsx         # fonts, SEO metadata, OpenGraph, JSON-LD
│  └─ page.tsx           # assembles every section
├─ components/
│  ├─ sections/          # the 13 page sections + navbar/footer
│  ├─ shared/            # motion helpers, count-up, spotlight, section heading
│  └─ ui/                # shadcn-style primitives (button, accordion)
├─ data/
│  └─ content.ts         # all copy + data, typed (single source of truth)
├─ hooks/
│  └─ use-active-section.ts
└─ lib/
   ├─ site-config.ts     # name, contact, nav links, socials
   └─ utils.ts           # cn() class merger
```

## Customizing

1. **Your details** → `src/lib/site-config.ts` (name, email, phone, socials, Calendly, WhatsApp).
2. **All content** → `src/data/content.ts` (services, skills, experience, projects, testimonials, pricing, FAQ).
3. **Brand colors** → `tailwind.config.ts` (`gold`, `indigo`) and `src/app/globals.css` (CSS variables).
4. **Your photo** → replace the gradient block in `About.tsx` with a `next/image` `<Image>`.

## Accessibility & SEO

- Skip-to-content link, visible keyboard focus rings, semantic landmarks, `aria-*` on interactive controls.
- `prefers-reduced-motion` disables marquees, parallax, and entrance motion.
- Full metadata, OpenGraph, Twitter cards, and Person JSON-LD in `layout.tsx`.

## Phase 2 (not included)

The contact form validates and shows a success state client-side. To make it send, replace the marked `// Wire to your backend here` block in `Contact.tsx` with a `fetch("/api/contact", …)` call, then add the API route, Nodemailer/Resend, and MongoDB — that's the next phase.
