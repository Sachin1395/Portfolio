/**
 * Everything only the Recruiter view shows (source: profile data.txt).
 * Featured projects, experience, stack and contact copy are shared with the story.
 */
import type { ProjectLink } from "./projects";
// (Type-only import: projects.ts imports moreProjects from here, so no value cycle.)

export const recruiterIntro = {
  /** Chips under the name. The last one is highlighted. */
  chips: [
    "B.Tech CSE · VIT Chennai · 2027",
    "CGPA 8.61",
    "Anywhere in India · Open to relocation",
  ],
  highlight: "Open to full-time roles",
} as const;

/** The anchors in the Recruiter view's header, in page order. */
export const recruiterSections = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Recognition", href: "#recognition" },
  { label: "Contact", href: "#contact" },
] as const;

export type MoreProject = {
  title: string;
  line: string;
  meta: string;
  tech: string;
  links: readonly ProjectLink[];
};

/** Everything after the five featured projects, strongest first. */
export const moreProjects: readonly MoreProject[] = [
  {
    title: "Pedestrian Collision Risk Prediction",
    line: "Dual-radar ESP32 system that rates a crossing as safe, warning or danger: 89.68% accuracy across 25,108 test scenarios.",
    meta: "Led a team of 3 · Apr 2026",
    tech: "ESP32 · TinyML · scikit-learn",
    links: [],
  },
  {
    title: "Water Network Leak Detection",
    line: "Digital twin that spots leaks from pressure residuals and isolates the affected district. Hydraulic validation done for 8 districts; the RL containment is in progress.",
    meta: "Team of 3 · In progress",
    tech: "Python · NetworkX · Reinforcement learning",
    links: [
      {
        label: "Code",
        href: "https://github.com/Sachin1395/reconfiguration_of_water_network",
      },
    ],
  },
  {
    title: "Secure Data Exchange",
    line: "Smart-grid data pipeline with AES-256-GCM encryption and RSA-2048 key exchange and signatures. Became a CRC Press book chapter.",
    meta: "Research internship · 2024",
    tech: "Python · Flask · AES / RSA",
    links: [
      {
        label: "Code",
        href: "https://github.com/Sachin1395/Secure_Data_Exchange",
      },
    ],
  },
  {
    title: "AgreeDeal",
    line: "Contract-farming marketplace: harvest listings, buyer bidding, a simulated escrow and auto-generated contracts.",
    meta: "Led a team of 6 · Sep 2024",
    tech: "Flask · MySQL · SQLAlchemy",
    links: [{ label: "Code", href: "https://github.com/Sachin1395/Agreedeal" }],
  },
  {
    title: "Dr. Jeevan",
    line: "Multilingual WhatsApp chatbot for disease awareness and preventive-health guidance, built on Azure.",
    meta: "Team of 6",
    tech: "Flask · Azure OpenAI · Azure Communication Services",
    links: [
      { label: "Code", href: "https://github.com/Sachin1395/WhatsappWebHook" },
    ],
  },
  {
    title: "Narratives in Motion",
    line: "Interactive storytelling platform where readers' comments and votes shape the story, with AI-assisted continuation.",
    meta: "Team of 4",
    tech: "Flask · SQLAlchemy · Hugging Face",
    links: [
      {
        label: "Code",
        href: "https://github.com/Sachin1395/Narratives-in-Motion-draft-1",
      },
    ],
  },
  {
    title: "Tidal Energy Forecasting",
    line: "Compared LSTM and XGBoost for tidal forecasting, evaluated with RMSE, MAE and R².",
    meta: "Research internship, team of 3 · 2025",
    tech: "TensorFlow · XGBoost · Pandas",
    links: [
      { label: "Code", href: "https://github.com/Sachin1395/lstm_prediction" },
    ],
  },
];

/** Languages are listed here only; the story's Stack card groups by area. */
export const languages = [
  "Python",
  "TypeScript",
  "JavaScript",
  "Java",
] as const;

export const recognition = {
  publication: {
    title: "Book chapter 11",
    text: "on critical-infrastructure protection and cyber-physical security in smart cities.",
    book: "Sustainable Cities: Paradigm of Digitalization",
    publisher: "CRC Press, 2025",
  },
  awards: [
    "1st Prize, Project Expo, Quality Week 2024",
    "Best Paper, AI Traffic Signals, SCES 2024",
    "Top 120 of 540, VITSIH Hackathon 2024",
    "1st Place, App Marvel, TechnoVIT'23",
  ],
  certificates: [
    {
      name: "Microsoft Certified: Azure AI Engineer Associate",
      detail: "Earned Jun 2025 · expired Jul 2026",
      href: "https://learn.microsoft.com/en-us/users/sachin-a-8960/credentials/certification/azure-ai-engineer",
    },
    {
      name: "Advanced Learning Algorithms",
      detail: "Stanford Online / DeepLearning.AI · Jul 2025",
    },
    {
      name: "Supervised Machine Learning: Regression and Classification",
      detail: "Stanford Online / DeepLearning.AI · Jan 2025",
    },
    { name: "Microsoft Azure AI Fundamentals", detail: "Microsoft" },
    {
      name: "Goldman Sachs Software Engineering Experience",
      detail: "Forage · Dec 2024",
    },
    { name: "Java Data Structures & Algorithms", detail: "Udemy · Jul 2025" },
    { name: "100 Days of Code (Python)", detail: "Udemy · 2025" },
  ],
  leetcode: "LeetCode: 167 solved",
} as const;

/**
 * The notebook design's own copy: handwritten section notes, labels around the
 * name, and the one number each featured project leads with (all from profile data).
 */
export const notebook = {
  nameLabels: [
    "AI ENGINEER",
    "VIT CHENNAI ’27",
    "Samsung PRISM intern",
    "Chennai, IN",
  ],
  openTo: "OPEN TO FULL-TIME AI / ML ROLES · ANYWHERE IN INDIA",
  statement: "I build agents that ship and systems that hold.",
  tags: ["LangGraph agents", "RAG", "FastAPI + NestJS", "Next.js"],
  captions: {
    head: "me, illustrated",
    wave: "hi from Chennai",
    contact: "say hi!",
  },
  notes: {
    about: "about me!",
    work: "things I've shipped",
    more: "+7, from hardware to research",
    experience: "where I've worked",
    stack: "what I'm knitted from",
  },
  /** Keyed by project title. */
  metrics: {
    "AI Invoice Extraction & Validation Agent": {
      value: "186",
      label: "automated tests",
    },
    "Fact Court": { value: "4", label: "verdict types per claim pair" },
    "MedInsight AI": { value: "90%", label: "triage accuracy, 10-report eval" },
    Nexus: { value: "20", label: "REST endpoints, 4 roles" },
    SyncDraft: { value: "CRDT", label: "offline-first, multi-instance" },
  } as Record<string, { value: string; label: string }>,
  /** Keyed by role start date. */
  roleNotes: {
    "2025-09": "team of 5",
    "2025-05": "team of 3",
    "2024-05": "published!",
    "2024-01": "where it started",
  } as Record<string, string>,
} as const;
