"use client";

import { useEffect, useId, useRef, useState } from "react";
import { links, navItems } from "@/content/site";
import { cn } from "@/lib/cn";

/** Thumb-zone menu for small screens: a square button bottom-right that opens the section list. */
export function MobileMenu() {
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
    // Tapping anywhere outside the panel or its button closes the menu.
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="fixed right-4 bottom-20 z-40 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-2 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
      >
        <nav aria-label="Sections (menu)">
          <ul className="flex flex-col">
            {navItems.map((item, i) => (
              <li key={item.href}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-4 text-lg font-semibold text-ink hover:bg-bg"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={links.resume}
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center rounded-xl px-4 text-lg font-semibold text-link hover:bg-bg"
              >
                Résumé<span aria-hidden="true">&nbsp;↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
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
