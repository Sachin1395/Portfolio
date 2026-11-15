/** The statement band and the Contact section (source: profile data.txt). */

export const door = {
  eyebrow: "**** The short version",
  /** Each entry is one line of the statement. */
  lines: ["AGENTS THAT SHIP +", "SYSTEMS THAT HOLD."],
} as const;

export const contact = {
  index: "05",
  eyebrow: "Contact",
  titleLines: ["GOT AN AGENT", "TO BUILD?"],
  location: "Based in Chennai · Anywhere in India · Open to relocation",
} as const;
