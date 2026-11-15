"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { setLenis } from "@/lib/smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Weighted, eased scrolling (Lenis) driven by GSAP's ticker, so the camera
 * timeline and the scroll position move in the same frame. Off for reduced motion.
 */
export function SmoothScroll() {
  // Layout effect: Lenis must exist before the intro loader (also a layout effect) asks to pause it.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    // Pinning adds scroll length after load; keep Lenis's limits in sync.
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
