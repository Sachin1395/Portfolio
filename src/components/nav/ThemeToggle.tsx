"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

/**
 * Round light/dark switch. The half-filled moon turns half a revolution with a
 * slight overshoot when the theme flips (.theme-turn, globals.css), and the
 * button dips on press.
 * Renders a neutral label until the theme is known.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Counts clicks: each one remounts the icon so its turn animation plays again.
  // (A keyframe animation, not a transition: next-themes switches transitions off
  // for the instant the theme flips.)
  const [turns, setTurns] = useState(0);

  const isDark = mounted && resolvedTheme === "dark";
  const label = !mounted
    ? "Switch theme"
    : isDark
      ? "Switch to light theme"
      : "Switch to dark theme";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
        setTurns((n) => n + 1);
      }}
      className={cn(
        "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-ink text-ink",
        "transition-[opacity,transform] duration-200 hover:opacity-85 active:scale-[0.92] motion-reduce:active:scale-100",
        className,
      )}
    >
      <svg
        key={turns}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        // Ends where the theme says; on a click it turns there from half a turn back.
        className={cn(isDark && "rotate-180", turns > 0 && "theme-turn")}
        style={{ "--turn-from": isDark ? "0deg" : "-180deg" } as React.CSSProperties}
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
      </svg>
    </button>
  );
}
