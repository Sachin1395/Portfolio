"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/smooth-scroll";

/**
 * Recruiter view: in-page links (#work, Back to top…) glide there with an eased
 * scroll instead of jumping. Without smooth scrolling (reduced motion) the
 * browser's own jump is left alone. Sections keep clear of the sticky header with
 * their own scroll-margin (scroll-mt-24), which Lenis honours. Renders nothing.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const lenis = getLenis();
      if (!link || !lenis) return;
      const id = link.getAttribute("href")!.slice(1);
      const target = id === "top" ? 0 : document.getElementById(id);
      if (target === null) return;
      event.preventDefault();
      lenis.scrollTo(target, {
        duration: 1.1,
        easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      });
      history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
