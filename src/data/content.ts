import type { LucideIcon } from "lucide-react";
import {
  Code2,
  BrainCircuit,
  Layers,
  AppWindow,
  Cloud,
  BarChart3,
  Workflow,
  Palette,
} from "lucide-react";

export type ProjectService =
  | "ai"
  | "fullstack"
  | "saas"
  | "web"
  | "cloud"
  | "data"
  | "automation"
  | "design";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: ProjectService;
};

export const services: Service[] = [
  {
    icon: Code2,
    title: "Full-stack development",
    description:
      "End-to-end web apps with Next.js, TypeScript, and clean APIs — built to ship fast and scale.",
    tag: "fullstack",
  },
  {
    icon: BrainCircuit,
    title: "AI development",
    description:
      "LLM features, RAG pipelines, and AI agents wired into real products with measurable value.",
    tag: "ai",
  },
  {
    icon: Layers,
    title: "SaaS development",
    description:
      "Multi-tenant platforms with auth, billing, and dashboards — from MVP to production.",
    tag: "saas",
  },
  {
    icon: AppWindow,
    title: "Web applications",
    description:
      "Fast, accessible interfaces with thoughtful UX and motion that feels effortless.",
    tag: "web",
  },
  {
    icon: Cloud,
    title: "Cloud solutions",
    description:
      "Deploy, observe, and scale on AWS and Vercel with CI/CD and infrastructure as code.",
    tag: "cloud",
  },
  {
    icon: BarChart3,
    title: "Data analytics",
    description:
      "Pipelines, dashboards, and reporting that turn raw events into decisions.",
    tag: "data",
  },
  {
    icon: Workflow,
    title: "Automation systems",
    description:
      "Connect tools and remove busywork with reliable, observable workflows.",
    tag: "automation",
  },
  {
    icon: Palette,
    title: "UI/UX design",
    description:
      "Design systems and interfaces that look premium and convert visitors into clients.",
    tag: "design",
  },
];

export type SkillGroup = {
  category: string;
  skills: { name: string; level: number }[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 95 },
      { name: "TypeScript", level: 92 },
      { name: "Tailwind CSS", level: 96 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "Express", level: 88 },
      { name: "Python", level: 85 },
    ],
  },
  {
    category: "Database",
    skills: [
      { name: "MongoDB", level: 90 },
      { name: "PostgreSQL", level: 86 },
      { name: "MySQL", level: 82 },
    ],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      { name: "AWS", level: 84 },
      { name: "Docker", level: 88 },
      { name: "Kubernetes", level: 78 },
    ],
  },
];

export type Experience = {
  period: string;
  role: string;
  company: string;
  description: string;
};

export const experiences: Experience[] = [
  {
    period: "2024 — Present",
    role: "Founder",
    company: "InternSpringBoard.AI",
    description:
      "Founded and building an AI-powered platform connecting students with internship opportunities.",
  },
  {
    period: "2023 — Present",
    role: "Independent Engineer & Consultant",
    company: "Freelance",
    description:
      "Partnering with startups to design and build AI-powered products end to end, from architecture to launch.",
  },
  {
    period: "2021 — 2023",
    role: "Senior Full-Stack Engineer",
    company: "Helios Labs",
    description:
      "Led a product team building a multi-tenant SaaS platform; cut page load times by 60% and shipped the v1 AI assistant.",
  },
  {
    period: "2019 — 2021",
    role: "Full-Stack Engineer",
    company: "Northwind Studio",
    description:
      "Built client web apps and internal tooling across fintech and e-commerce with React and Node.",
  },
  {
    period: "2018 — 2019",
    role: "Frontend Developer",
    company: "Cobalt Agency",
    description:
      "Crafted marketing sites and design systems for agency clients with a focus on performance.",
  },
];

export type Project = {
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: "Completed" | "Concept" | "Case Study";
  featured: boolean;
  service: ProjectService;
  href: string;
  repo?: string;
  coverImage: string;
};

export const projects: Project[] = [
  {
    title: "Cloud-Native Enterprise Architecture",
    category: "Cloud Architecture • Enterprise Infrastructure",
    description:
      "Architected a scalable multi-cloud infrastructure across AWS and Azure using Kubernetes (EKS/AKS) for high availability and disaster recovery — with IAM, VPC isolation, and WAF locking down security, serverless functions keeping costs lean, and Grafana plus CloudWatch giving the team real-time visibility into enterprise-grade deployments.",
    tags: ["AWS", "Azure", "Kubernetes", "Route 53", "Traffic Manager", "Grafana"],
    status: "Completed",
    featured: true,
    service: "cloud",
    href: "#",
    coverImage: "https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
  },
  {
    title: "Offline PDF Intelligence Platform",
    category: "Artificial Intelligence • Defense Research (DRDO)",
    description:
      "Built an offline document analyzer for DRDO where classified data never leaves the building. OCR reads scanned PDFs and DOCs, semantic search ranks results, and natural language Q&A answers questions instantly — with export to PDF/Word for cross-domain use in medical, legal, and education contexts.",
    tags: ["Python", "OCR", "SentenceTransformers", "ChromaDB", "SQL"],
    status: "Completed",
    featured: true,
    service: "ai",
    href: "#",
    coverImage: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
  },
  {
    title: "Secure Internet Banking Auth System",
    category: "Cybersecurity • FinTech Mobile",
    description:
      "Prototyped a mobile banking authentication flow combining biometrics with OTP-based two-factor verification. RSA encryption and transaction-specific OTPs close the door on phishing and man-in-the-middle attacks, designed from the ground up for scalable, secure end-to-end transactions.",
    tags: ["Biometrics", "RSA Encryption", "OTP", "Mobile Security"],
    status: "Completed",
    featured: false,
    service: "fullstack",
    href: "#",
    coverImage: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
  },
  {
    title: "Gamified Citizen Engagement Platform",
    category: "UX Design • GovTech (Govt. of Kerala)",
    description:
      "Designed a gamified platform for the Government of Kerala where badges, leaderboards, and rewards turn participation in government schemes into something citizens actually want to do. Shaped by rapid user research and interactive Figma prototypes, built in step with developers and policy experts to meet real-world GovTech requirements.",
    tags: ["Figma", "UX Research", "Prototyping", "GovTech"],
    status: "Completed",
    featured: true,
    service: "design",
    href: "#",
    coverImage: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
  },
  {
    title: "Smart Restaurant Order & Inventory System",
    category: "Full-Stack Development",
    description:
      "Built a SQL-driven system to manage restaurant orders, inventory, and billing in one place. Triggers and stored procedures auto-update stock and fire low-stock alerts, while optimized queries and relational schema design cut processing overhead by 40%.",
    tags: ["MySQL", "PHP", "HTML/CSS"],
    status: "Completed",
    featured: false,
    service: "fullstack",
    href: "#",
    coverImage: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  initials: string;
  rating: number;
  photo?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "We had a strict requirement nothing could touch the internet. Revanth built the whole thing locally: PDFs go in, answers come out, completely air-gapped. Our team was querying classified documents through a clean interface within weeks. Exactly what we asked for.",
    name: "D Lal Kisan",
    title: "Assistant Manager, SBI Bank",
    initials: "DK",
    photo: "/Client1.png",
    rating: 5,
  },
  {
    quote:
      "Shipped our AI assistant in six weeks. It now handles most of our inbound support and our team finally has room to breathe.",
    name: "Sara Lindholm",
    title: "COO, Nimbus",
    initials: "SL",
    rating: 5,
  },
  {
    quote:
      "The most reliable engineer we've worked with. Clear communication, beautiful UI, and everything just works.",
    name: "Daniel Okafor",
    title: "Founder, Vellum",
    initials: "DO",
    photo: "/Client1.png",
    rating: 5,
  },
  {
    quote:
      "Took our messy dashboard and made it fast and genuinely pleasant to use. Our customers noticed immediately.",
    name: "Priya Nair",
    title: "Head of Product, Quanta",
    initials: "PN",
    rating: 5,
  },
  {
    quote:
      "From strategy to launch, the whole process felt effortless. We'd hire again without a second thought.",
    name: "Marcus Bauer",
    title: "CEO, Arclight",
    initials: "MB",
    rating: 5,
  },
];

export type ProcessStep = {
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    title: "Discovery",
    description:
      "We dig into goals, users, and constraints to define what success actually looks like.",
  },
  {
    title: "Planning",
    description:
      "A clear scope, architecture, and timeline so there are no surprises later.",
  },
  {
    title: "Design",
    description:
      "Wireframes and a polished UI that reflect your brand and convert visitors.",
  },
  {
    title: "Development",
    description:
      "Clean, typed, well-tested code shipped in reviewable increments.",
  },
  {
    title: "Testing",
    description:
      "QA, accessibility, and performance passes so it's solid before launch.",
  },
  {
    title: "Launch",
    description:
      "Deploy, monitor, and hand off with documentation — plus support after go-live.",
  },
];

export type PricingTier = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$2,500",
    cadence: "/ project",
    description: "For a focused landing page or small site that needs to look sharp.",
    features: [
      "Up to 5 sections",
      "Responsive + accessible build",
      "Basic SEO setup",
      "1 round of revisions",
      "2-week delivery",
    ],
    cta: "Start a project",
  },
  {
    name: "Professional",
    price: "$7,500",
    cadence: "/ project",
    description: "For a full product or web app with custom features and integrations.",
    features: [
      "Everything in Starter",
      "Custom web app / dashboard",
      "API + database integration",
      "CMS or admin panel",
      "3 rounds of revisions",
      "Priority support",
    ],
    cta: "Start a project",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "For AI platforms and complex systems that need ongoing partnership.",
    features: [
      "Everything in Professional",
      "AI / LLM integration",
      "Architecture & scaling",
      "Dedicated engineering",
      "SLA & ongoing support",
    ],
    cta: "Contact Sales",
  },
];

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "How long does a typical project take?",
    answer:
      "A landing page is usually 1–2 weeks; a full web app or SaaS MVP runs 4–8 weeks depending on scope. You'll get a precise timeline after our discovery call.",
  },
  {
    question: "Do you work with early-stage startups?",
    answer:
      "Yes, a lot of my work is helping founders go from idea to a launched, polished v1. I can also advise on architecture and tech choices along the way.",
  },
  {
    question: "What does the AI work actually involve?",
    answer:
      "Anything from adding an LLM-powered assistant or search to building RAG pipelines and agents. I focus on features that create real value, not AI for its own sake.",
  },
  {
    question: "How do we communicate during the project?",
    answer:
      "We agree on a channel (Slack, email, or weekly calls) up front. You'll see progress in reviewable increments rather than one big reveal at the end.",
  },
  {
    question: "Do you provide support after launch?",
    answer:
      "Every project includes a support window after go-live, and Professional and Enterprise engagements can include ongoing maintenance and feature work.",
  },
  {
    question: "What if I'm not sure exactly what I need?",
    answer:
      "That's common and completely fine. Book a free consultation and we'll figure out the right scope together no pressure.",
  },
];
