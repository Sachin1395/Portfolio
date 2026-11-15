"use client";

import { useEffect } from "react";
import { isLite } from "@/lib/device";

/** Max shift in px at the screen edges: the avatar leans toward the cursor, the backdrop away. */
const FRONT = 8;
const BACK = -3;
/** Share of the remaining distance covered each frame (a soft follow, no spring). */
const FOLLOW = 0.08;

/**
 * A gentle depth parallax on the hero: the avatar and the backdrop shift a few px
 * with the cursor, in opposite directions. Hero only — it snaps back to zero the
 * moment the page scrolls, so the camera tour is never offset. Skipped for touch,
 * reduced motion and light mode. Moves its own wrappers ([data-parallax]), never
 * the camera or intro layers. Renders nothing.
 */
export function HeroParallax() {
  useEffect(() => {
    const allowed = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const front = document.querySelector<HTMLElement>('[data-parallax="front"]');
    const back = document.querySelector<HTMLElement>('[data-parallax="back"]');
    if (!front || !back) return;

    let targetX = 0, targetY = 0, x = 0, y = 0, frame = 0;
    const onHero = () =>
      allowed.matches && !isLite() && window.scrollY < 4 && !document.documentElement.classList.contains("story-moving");

    const write = () => {
      front.style.transform = `translate3d(${(x * FRONT).toFixed(2)}px, ${(y * FRONT * 0.6).toFixed(2)}px, 0)`;
      back.style.transform = `translate3d(${(x * BACK).toFixed(2)}px, ${(y * BACK * 0.6).toFixed(2)}px, 0)`;
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      targetX = targetY = x = y = 0;
      for (const el of [front, back]) {
        el.style.removeProperty("transform");
        el.style.removeProperty("will-change");
      }
    };
    const tick = () => {
      x += (targetX - x) * FOLLOW;
      y += (targetY - y) * FOLLOW;
      write();
      if (Math.abs(targetX - x) < 0.002 && Math.abs(targetY - y) < 0.002) {
        frame = 0;
        // Settled: drop the GPU layer so the browser repaints once, sharp.
        for (const el of [front, back]) el.style.removeProperty("will-change");
        if (targetX === 0 && targetY === 0) reset();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame) return;
      for (const el of [front, back]) el.style.willChange = "transform";
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (!onHero()) return;
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      start();
    };
    const onLeave = () => {
      targetX = targetY = 0;
      if (x !== 0 || y !== 0) start();
    };
    // Any scroll hands the stage to the camera: snap back at once.
    const onScroll = () => {
      if (window.scrollY >= 4 && (x !== 0 || y !== 0 || frame)) reset();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      reset();
    };
  }, []);
  return null;
}
