/**
 * All copy and links for the site live here, so sections never hard-code text.
 * Source of truth: Portfolio V2/simpler version/profile/profile data.txt
 */

export type NavItem = {
  label: string;
  /** In-page anchor of the section this item opens. */
  href: `#${string}`;
};

export const person = {
  name: "Sachin A",
  shortName: "SACHIN A.",
  /** The hero headline, one entry per line. */
  heroNameLines: ["SACHIN"],
  role: "AI Engineer building intelligent systems.",
  context: "Final-year CSE · VIT Chennai",
  /** One line of evidence under the role. */
  proof: "Samsung PRISM intern · Freelancer",
  /** Small chip above the name. */
  tagline: "Prompting my way through life",
  email: "sachin13905@gmail.com",
} as const;

export const links = {
  github: "https://github.com/Sachin1395",
  linkedin: "https://www.linkedin.com/in/sachin1395/",
  leetcode: "https://leetcode.com/u/Sachin_1395/",
  /** The résumé PDF, served from public/resume.pdf. Replace that file to update it. */
  resume: "/resume.pdf",
} as const;

/**
 * Story-view sections, in camera order: the camera pans down the body
 * (head → phone → sweater → sneakers), so the nav follows the same order.
 */
export const navItems: readonly NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

/** The plain, skimmable page with every project (app/recruiter). */
export const recruiterHref = "/recruiter" as const;

export const site = {
  title: "Sachin A — AI Engineer",
  description:
    "Final-year CSE student at VIT Chennai building LLM agents, AI pipelines and full-stack systems. Open to full-time roles.",
  url: "https://portfolio-sachin-red.vercel.app",
} as const;
