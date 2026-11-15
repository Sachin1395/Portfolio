/** Projects (source: profile data.txt). Featured ones appear on the Work stop. */

import { moreProjects } from "./recruiter";

export type ProjectLink = { label: "Live" | "Code" | "Demo"; href: string };

export type Project = {
  title: string;
  /** Fits one line in the Work card. */
  shortTitle: string;
  /** Solo / team role and date. */
  meta: string;
  summary: string;
  tech: readonly string[];
  links: readonly ProjectLink[];
  /** Recruiter view: the one-line proof, with numbers where they exist. */
  proof: string;
  /** Recruiter view: the fuller tech list. */
  fullTech: readonly string[];
};

export const featuredProjects: readonly Project[] = [
  {
    title: "AI Invoice Extraction & Validation Agent",
    shortTitle: "AI Invoice Agent",
    meta: "Solo · Oct 2026",
    summary:
      "Reads PDF, scanned and photographed invoices and routes each one to auto-approve, human review or reject. Covered by 186 automated tests.",
    tech: ["LangGraph", "Gemini Vision", "FastAPI"],
    proof: "A 5-stage LangGraph pipeline, deterministic validation, two-model fallback and 186 automated tests.",
    fullTech: ["Python", "LangGraph", "Gemini Vision", "FastAPI", "SQLite"],
    links: [
      { label: "Live", href: "https://invoice-processing-agent-7qni.onrender.com/" },
      { label: "Code", href: "https://github.com/Sachin1395/Invoice-Automation" },
    ],
  },
  {
    title: "Fact Court",
    shortTitle: "Fact Court",
    meta: "Solo · Sep 2026",
    summary:
      "Checks claims in PDFs against page-level evidence: deterministic rules first, the LLM only where judgement is needed.",
    tech: ["FastAPI", "Next.js", "Gemini"],
    proof: "Built a PDF fact-verification system that cross-checks claims against page-level evidence using Gemini, PyMuPDF, and FastAPI.",
    fullTech: ["FastAPI", "Next.js", "Gemini", "PyMuPDF"],
    links: [{ label: "Code", href: "https://github.com/Sachin1395/FACT_COURT" }],
  },
  {
    title: "MedInsight AI",
    shortTitle: "MedInsight AI",
    meta: "Led a team of 3 · Mar 2026",
    summary:
      "WhatsApp assistant that explains medical reports in plain language. 90% triage accuracy on a 10-report evaluation.",
    tech: ["LangGraph", "OCR", "Twilio"],
    proof: "A 6-node medical report analysis pipeline achieving 90% triage accuracy and 100% prescription-request blocking across 10 test reports.",
    fullTech: ["LangGraph", "FastAPI", "Tesseract OCR", "Twilio"],
    links: [{ label: "Code", href: "https://github.com/Sachin1395/med_analysis" }],
  },
  {
    title: "Nexus",
    shortTitle: "Nexus",
    meta: "Solo · Jul 2026",
    summary: "Multi-tenant developer platform 20 REST endpoints, 4 roles, API keys and Redis rate limiting.",
    tech: ["NestJS", "Prisma", "Redis"],
    proof: "Multi-tenant platform with 20 REST endpoints, 4 roles, JWT + API keys, Redis rate limiting.",
    fullTech: ["NestJS", "Next.js", "PostgreSQL", "Prisma", "Redis"],
    links: [{ label: "Code", href: "https://github.com/Sachin1395/nexus-platform" }],
  },
  {
    title: "SyncDraft",
    shortTitle: "SyncDraft",
    meta: "Solo · Dec 2025",
    summary: "Google Docs-style editor that merges concurrent edits with CRDTs and keeps working offline.",
    tech: ["Yjs", "WebSockets", "Redis"],
    proof: "CRDT editor that merges concurrent edits. Uses Redis Pub/Sub across instances and has offline-first nature.",
    fullTech: ["React", "Yjs", "WebSockets", "Redis"],
    links: [
      { label: "Live", href: "https://syncdraft.vercel.app" },
      { label: "Code", href: "https://github.com/Sachin1395/Distributed-Collaborative-Editor" },
    ],
  },
];

/** Count of the other projects, listed in the Recruiter view. */
export const moreProjectsCount = moreProjects.length;

export const work = {
  index: "02",
  eyebrow: "Work",
  titleLines: ["EVERYTHING I'VE SHIPPED", "LIVES HERE"],
} as const;
