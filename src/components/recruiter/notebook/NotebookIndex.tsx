"use client";

import { useEffect, useId, useRef, useState } from "react";
import { recruiterSections } from "@/content/recruiter";
import { cn } from "@/lib/cn";

/**
 * Phones only: the notebook's index. A square button at the lower right (the
 * same thumb-zone spot as the story page's menu) opens a ruled contents card
 * listing every section. Esc, a tap outside or picking a section closes it.
 */
export function NotebookIndex() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      )
        setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="md:hidden print:hidden">
      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="notebook-index fixed right-4 bottom-20 z-40 w-[min(17rem,calc(100vw-2rem))] border-[1.5px] border-ink bg-paper font-mono shadow-[6px_6px_0_var(--ink)]"
      >
        <p className="border-b border-line px-4 pt-3 pb-2 text-[0.6875rem] font-medium tracking-[0.08em] text-muted">
          INDEX
        </p>
        <nav aria-label="Sections (index)">
          <ol>
            {recruiterSections.map((item, i) => (
              <li
                key={item.href}
                className="border-b border-line last:border-b-0"
              >
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center gap-3 px-4 text-[0.8125rem] font-medium tracking-[0.06em] text-ink no-underline hover:bg-ink/5"
                >
                  <span className="text-red tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label.toUpperCase()}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close index" : "Open index"}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 bottom-6 z-40 flex size-12 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] bg-ink"
      >
        <span
          className={cn(
            "h-0.5 w-5 bg-bg transition-transform duration-200 motion-reduce:transition-none",
            open && "translate-y-1 rotate-45",
          )}
        />
        <span
          className={cn(
            "h-0.5 w-5 bg-bg transition-transform duration-200 motion-reduce:transition-none",
            open && "-translate-y-1 -rotate-45",
          )}
        />
      </button>
    </div>
  );
}
