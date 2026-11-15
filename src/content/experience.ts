/**
 * Roles (source: profile data.txt). Newest first. One short line each; the full
 * write-ups belong in the Recruiter view. SpectoV is left out (incomplete, no
 * certificate), and the PDF parsing at Samsung was a teammate's, so it isn't claimed.
 */
export type Role = {
  dates: string;
  /** Machine-readable start, for <time>. */
  start: string;
  title: string;
  org: string;
  line: string;
};

export const experience = {
  index: "04",
  eyebrow: "Experience",
  titleLines: ["WHERE I'VE", "WALKED"],
  roles: [
    {
      dates: "Sep 2025 – Jan 2026",
      start: "2025-09",
      title: "Industry Project Intern",
      org: "Samsung R&D Institute, PRISM",
      line: "SlideCraft, a multimodal agent that builds template-true slide decks. Team of 5; met Samsung's >85% clarification and >90% layout targets.",
    },
    {
      dates: "May – Jul 2025",
      start: "2025-05",
      title: "Research Intern",
      org: "Centre for Smart Grid Technologies, VIT",
      line: "Compared LSTM and XGBoost for tidal energy forecasting. Team of 3.",
    },
    {
      dates: "May – Jul 2024",
      start: "2024-05",
      title: "Research Intern",
      org: "Centre for Smart Grid Technologies, VIT",
      line: "Hybrid encryption for smart-grid data (AES-256-GCM + RSA-2048). Published as a CRC Press book chapter.",
    },
    {
      dates: "Jan – Apr 2024",
      start: "2024-01",
      title: "Research Intern",
      org: "ISACA Chennai Chapter × VIT",
      line: "Researched the security of consumer IoT devices.",
    },
  ],
} as const satisfies { roles: readonly Role[]; index: string; eyebrow: string; titleLines: readonly string[] };
