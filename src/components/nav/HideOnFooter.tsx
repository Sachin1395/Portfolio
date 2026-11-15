"use client";

import { useEffect } from "react";

/**
 * Marks <html data-at-footer> while the footer fills the lower part of the screen,
 * so the top nav slides away (globals.css) and the big wordmark has the stage.
 * It comes back as soon as you scroll up. Renders nothing.
 */
export function HideOnFooter() {
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const root = document.documentElement;
    // Intersecting once the footer's top passes 60% of the way up the screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) root.dataset.atFooter = "true";
        else delete root.dataset.atFooter;
      },
      { rootMargin: "0px 0px -60% 0px" },
    );
    observer.observe(footer);
    return () => {
      observer.disconnect();
      delete root.dataset.atFooter;
    };
  }, []);
  return null;
}
