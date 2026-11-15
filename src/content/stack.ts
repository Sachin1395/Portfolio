/**
 * Skills (source: profile data.txt). Only skills backed by projects or confirmed
 * by Sachin are listed; AWS is deliberately left out (not confirmed).
 */

export const stack = {
  index: "03",
  eyebrow: "Stack",
  titleLines: ["WHAT I'M", "KNITTED FROM"],
  groups: [
    {
      name: "AI / ML",
      items: [
        "LangGraph", "LangChain", "LLMs", "RAG", "ChromaDB",
        "Gemini", "Azure OpenAI", "scikit-learn",
        "TensorFlow", "XGBoost", "Tesseract OCR",
      ],
    },
    {
      name: "Backend",
      items: [
        "Python", "FastAPI", "Flask", "NestJS",
        "Node.js", "Express", "WebSockets",
      ],
    },
    {
      name: "Frontend",
      items: ["JavaScript", "TypeScript", "React", "Next.js", "HTML/CSS"],
    },
    {
      name: "Data",
      items: [
        "PostgreSQL", "MySQL", "SQLite", "Redis",
        "Prisma", "SQLAlchemy",
      ],
    },
    {
      name: "Tools",
      items: [
        "Git", "Docker", "CI/CD", "Azure",
        "Selenium", "Swagger", "Bash",
      ],
    },
  ],
} as const;

