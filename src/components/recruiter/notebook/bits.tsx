import { cn } from "@/lib/cn";
import { fontHand } from "./fonts";

/** A strip of translucent tape, for taping photos and notes to the page. */
export function Tape({ className, tone = "red" }: { className?: string; tone?: "red" | "ink" | "light" }) {
  const colour = tone === "red" ? "bg-red/35" : tone === "ink" ? "bg-ink/25" : "bg-white/50";
  return <span aria-hidden="true" className={cn("absolute block h-5 w-16", colour, className)} />;
}

/** A section's opening: a small handwritten note, then the title in a ruled box. */
export function NoteHeading({ id, note, title, aside }: { id: string; note?: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      {note && <p className={cn(fontHand, "text-[1.375rem] leading-none text-muted")}>{note}</p>}
      <div className="flex flex-wrap items-center gap-3.5">
        <h2 id={id} className="border-[1.5px] border-ink px-4 py-1.5 font-mono text-lg font-medium">
          {title}
        </h2>
        {aside}
      </div>
    </div>
  );
}

/** "LIVE ↗ · CODE ↗" in the notebook's mono caps, coloured by the card it sits on. */
export function MonoLinks({ links, project }: { links: readonly { label: string; href: string }[]; project: string }) {
  if (!links.length) return <span className="font-mono text-[0.6875rem] font-medium tracking-[0.08em] opacity-70">NO PUBLIC LINK</span>;
  return (
    <ul className="flex gap-4 font-mono text-[0.6875rem] font-medium tracking-[0.08em]">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noopener" className="inline-flex min-h-8 items-center underline underline-offset-4 hover:opacity-80">
            {link.label.toUpperCase()}
            <span aria-hidden="true">&nbsp;↗</span>
            <span className="sr-only">
              {" "}
              — {project} (opens in a new tab)
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
