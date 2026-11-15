import type Lenis from "lenis";

/** The page's smooth-scroll instance, if one is running (none for reduced-motion visitors). */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Gentle start and end, so long jumps never feel like a snap. */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Scrolls to a position, smoothly when smooth scrolling is on. Nav jumps get a
 * duration that grows with distance (1.4–2.6 s), so the camera has time to travel.
 */
export function scrollToY(y: number, { immediate = false } = {}) {
  if (instance) {
    // The pinned story changes the page height after Lenis measured it; re-measure first.
    instance.resize();
    const distance = Math.abs(y - window.scrollY);
    const duration = Math.min(2.6, 1.4 + distance / 4000);
    instance.scrollTo(y, { immediate, force: true, duration, easing: easeInOutCubic });
  }
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}
