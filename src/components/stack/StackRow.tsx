"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

/** Pills: a touch smaller below 1024px, where groups run to two lines. */
const CHIP =
  "shrink-0 rounded-full border border-border bg-bg px-2 py-0.5 text-xs font-semibold whitespace-nowrap lg:px-2.5 lg:py-1 lg:text-[0.8125rem]";
const MORE = "rounded-full border border-dashed px-2 py-0.5 text-xs font-bold whitespace-nowrap lg:px-2.5 lg:py-1 lg:text-[0.8125rem]";
const GAP = "gap-1.5";
/** Popover timing, from the transitions.dev scale (dropdown: open 250ms, close 150ms). */
const CLOSE_MS = 150;
const HOVER_OPEN_MS = 60;
const HOVER_CLOSE_MS = 140;
/** Desktop: one line per group, label beside it. Narrower (tablet): label above, up to two lines. */
const WIDE = "(min-width: 1024px)";

type Placement = { top: number; left: number; above: boolean };

/**
 * One skill group as an aligned line: the label, as many skills as fit, then
 * "+n" (desktop: one line beside the label; tablet: label above, up to two lines). The "+n" opens the rest in a small popover: on hover with a mouse,
 * on click / tap, or with Enter / Space; Escape, a click outside or any scroll
 * closes it. Without JavaScript the line simply wraps and shows everything.
 */
export function StackRow({ name, items }: { name: string; items: readonly string[] }) {
  const popId = useId();
  const lineRef = useRef<HTMLUListElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  /** How many skills fit on the line; null until measured (then the line wraps). */
  const [shown, setShown] = useState<number | null>(null);
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");
  const [place, setPlace] = useState<Placement | null>(null);
  const timer = useRef(0);

  // Fit: measure every chip (in an invisible copy) and keep as many as fit, leaving room for "+n".
  useLayoutEffect(() => {
    const line = lineRef.current;
    const measure = measureRef.current;
    if (!line || !measure) return;
    const fit = () => {
      const width = line.clientWidth;
      const lines = window.matchMedia(WIDE).matches ? 1 : 2;
      const nodes = [...measure.children] as HTMLElement[];
      const plus = nodes[nodes.length - 1]!.offsetWidth;
      const gap = parseFloat(getComputedStyle(measure).columnGap) || 0;
      // Lay the chips out line by line, as the wrapping list would; the last line keeps room for "+n".
      let line_ = 1;
      let used = 0;
      let fits = 0;
      for (let i = 0; i < items.length; i++) {
        const w = nodes[i]!.offsetWidth;
        const more = items.length - (i + 1) > 0;
        const reserve = line_ === lines && more ? gap + plus : 0;
        let next = used + (used ? gap : 0) + w;
        if (next + reserve > width) {
          if (line_ === lines) break;
          line_ += 1;
          next = w;
          if (next + (line_ === lines && more ? gap + plus : 0) > width) break;
        }
        used = next;
        fits = i + 1;
      }
      setShown(Math.max(1, fits));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(line);
    void document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [items.length]);

  const hidden = shown === null ? [] : items.slice(shown);

  const position = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const r = button.getBoundingClientRect();
    const popHeight = popRef.current?.offsetHeight ?? 120;
    const popWidth = Math.min(300, window.innerWidth - 24);
    // Prefer opening upward, above the "+n", so the rows below stay readable.
    const above = r.top - 8 - popHeight >= 80;
    setPlace({
      top: above ? r.top - 8 - popHeight : r.bottom + 8,
      left: Math.max(12, Math.min(r.right - popWidth, window.innerWidth - popWidth - 12)),
      above,
    });
  }, []);

  const open = useCallback(() => {
    window.clearTimeout(timer.current);
    position();
    setState("open");
  }, [position]);

  const close = useCallback((focusButton = false) => {
    window.clearTimeout(timer.current);
    setState((s) => (s === "closed" ? s : "closing"));
    timer.current = window.setTimeout(() => setState("closed"), CLOSE_MS);
    if (focusButton) buttonRef.current?.focus();
  }, []);

  // Re-place once the popover has its real height (it may need to open upward).
  useLayoutEffect(() => {
    if (state === "open") position();
  }, [state, position]);

  // While open: Escape, a click outside, a scroll (the camera moves) or a resize closes it.
  useEffect(() => {
    if (state !== "open") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!popRef.current?.contains(t) && !buttonRef.current?.contains(t)) close();
    };
    const onScroll = () => close();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [state, close]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Hover (mouse / trackpad only): open after a beat, close after a short grace so the
  // pointer can travel from the button into the popover.
  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hoverIn = () => {
    if (!canHover()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(open, state === "open" ? 0 : HOVER_OPEN_MS);
  };
  const hoverOut = () => {
    if (!canHover() || state !== "open") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => close(), HOVER_CLOSE_MS);
  };

  return (
    <div className="grid gap-x-3 gap-y-1.5 py-2.5 first:pt-0 last:pb-0 lg:grid-cols-[5.25rem_minmax(0,1fr)] lg:items-center">
      <h3 className="text-xs font-bold tracking-[0.06em] whitespace-nowrap text-muted uppercase">{name}</h3>
      {/* overflow-hidden: the invisible measuring copy below is wider than the card. */}
      <div className="relative min-w-0 overflow-hidden">
        <ul
          ref={lineRef}
          aria-label={`${name} skills`}
          className={cn("flex flex-wrap", GAP, shown !== null && "lg:flex-nowrap lg:overflow-hidden")}
        >
          {items.map((item, i) => (
            <li key={item} className={cn(CHIP, shown !== null && i >= shown && "hidden")}>
              {item}
            </li>
          ))}
          {hidden.length > 0 && (
            <li className="shrink-0">
              <button
                ref={buttonRef}
                type="button"
                aria-expanded={state === "open"}
                aria-controls={popId}
                aria-label={`${hidden.length} more ${name} skills`}
                onClick={() => (state === "open" ? close() : open())}
                onPointerEnter={hoverIn}
                onPointerLeave={hoverOut}
                className={cn("stack-more cursor-pointer border-ink", MORE)}
              >
                +{hidden.length}
              </button>
            </li>
          )}
        </ul>

        {/* Invisible copy at natural width, for measuring (all chips plus a "+n" sample). */}
        <div
          ref={measureRef}
          aria-hidden="true"
          className={cn("pointer-events-none invisible absolute top-0 left-0 flex w-max", GAP)}
        >
          {items.map((item) => (
            <span key={item} className={CHIP}>
              {item}
            </span>
          ))}
          <span className={MORE}>+{items.length}</span>
        </div>
      </div>

      {state !== "closed" &&
        place &&
        createPortal(
          <div
            ref={popRef}
            id={popId}
            role="group"
            aria-label={`More ${name} skills`}
            data-state={state}
            data-above={place.above || undefined}
            onPointerEnter={hoverIn}
            onPointerLeave={hoverOut}
            style={{ top: place.top, left: place.left }}
            className="stack-pop fixed z-50 w-[min(300px,calc(100vw-24px))] rounded-[14px] border border-border bg-card p-3 shadow-[0_18px_40px_rgba(0,0,0,0.14)]"
          >
            <p className="mb-2 text-[0.6875rem] font-bold tracking-[0.06em] text-muted uppercase">{name} · more</p>
            <ul className={cn("flex flex-wrap", GAP)}>
              {hidden.map((item) => (
                <li key={item} className={CHIP}>
                  {item}
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
