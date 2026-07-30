export const siteConfig = {
  name: "Revanth Banothu",
  role: "Full-Stack & AI Engineer",
  tagline: "Building AI-Powered Digital Experiences That Drive Results",
  description:
    "I help startups, businesses, and entrepreneurs build modern websites, AI solutions, automation systems, and scalable digital products.",
  url: "https://revanth.space",
  email: "dev@revanth.space",
  phone: "+91 6304174467",
  location: "Hyderabad, India",
  availability: "Available for new projects",
  socials: {
    github: "https://github.com/revanthvk",
    linkedin: "https://www.linkedin.com/in/revanth-banothu-4b3347279/",
    x: "https://x.com/Freelancerrev",
    whatsapp: "https://wa.me/916304174467",
  },
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#portfolio" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const sectionIds = [
  "hero",
  "about",
  "services",
  "skills",
  "portfolio",
  "process",
  "pricing",
  "faq",
  "contact",
] as const;
