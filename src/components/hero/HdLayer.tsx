"use client";

import { useEffect, useRef, useState } from "react";
import { avatar } from "@/content/assets";
import { isLite } from "@/lib/device";

/** The camera's closest zoom (the head) scales the avatar about this much. */
const MAX_ZOOM = 4.8;

/**
 * A sharper copy of the avatar, requested only once the page is idle so it never
 * competes with the intro. It fades in over the normal image when it arrives.
 *
 * Only on screens with the camera tour, and only the size this screen needs: the avatar's height on screen ×
 * the closest zoom × the screen's pixel density, rounded up to the next export
 * (2800px on most laptops, 4000px on large or very sharp screens; always 2800px
 * in light mode). The browser takes AVIF when it can (about half the download of WebP).
 */
export function HdLayer() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const file = avatar.hd.find((s) => s.height === height);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Only the camera tour zooms the avatar (768px and up, motion allowed). Phones and
    // reduced motion show it at card size, so they never download the HD file.
    const tour = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const pick = () => {
      if (!tour.matches) {
        // Picked up later if the window grows into the tour (a rotated tablet, a resized window).
        tour.addEventListener("change", pick, { once: true });
        return;
      }
      const shown = ref.current?.offsetHeight ?? 0;
      const needed = shown * MAX_ZOOM * (window.devicePixelRatio || 1);
      const sizes = avatar.hd;
      // Light mode: the smallest HD file, whatever the screen (less memory for a weak graphics chip).
      const choice = isLite()
        ? sizes[0]!
        : (sizes.find((s) => s.height >= needed) ?? sizes[sizes.length - 1]!);
      setHeight(choice.height);
    };
    const cleanup = () => tour.removeEventListener("change", pick);
    if (document.readyState === "complete") {
      const id = window.setTimeout(pick, 1200);
      return () => {
        window.clearTimeout(id);
        cleanup();
      };
    }
    const onLoad = () => window.setTimeout(pick, 1200);
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      cleanup();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      {file && (
        <picture>
          <source srcSet={file.avif} type="image/avif" />
          {/* eslint-disable-next-line @next/next/no-img-element -- deliberately bypasses next/image: the camera scales this layer up. */}
          <img
            src={file.webp}
            alt=""
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 size-full object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        </picture>
      )}
    </div>
  );
}
