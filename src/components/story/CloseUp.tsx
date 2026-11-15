"use client";

import { useEffect, useRef } from "react";
import { closeUps, type CloseUpId } from "@/content/assets";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The crops are framed for a 600×240 window (CSS px): narrower cards show its
 * middle, wider ones (up to 767px) cover with a slight zoom, so the picture
 * always reaches both edges of the card.
 */
const SIZES = "(min-width: 600px) 100vw, 600px";

/**
 * Phones only: a still close-up of the stop's detail at the top of its card,
 * in place of the camera tour. As the card scrolls in, the image eases from
 * 108% to 100% and the label rises (once, CSS in globals.css).
 * Without JS, or with reduced motion, it is simply shown.
 */
export function CloseUp({ id, index }: { id: CloseUpId; index: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shot = closeUps[id];

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window))
      return;
    // Already on screen (e.g. a reload mid-page): leave it as it is.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.dataset.reveal = "wait";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.reveal = "in";
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-closeup
      className="relative -mx-6 -mt-6 mb-1 h-60 overflow-hidden rounded-t-[19px] border-b border-border bg-[radial-gradient(closest-side,var(--card),var(--bg))] md:hidden"
    >
      <div className="absolute inset-y-0 left-1/2 w-[max(600px,100%)] -translate-x-1/2">
        <svg
          aria-hidden="true"
          viewBox="0 0 600 240"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full text-line"
          fill="none"
          stroke="currentColor"
        >
          {shot.floor ? (
            <>
              <ellipse cx="300" cy="196" rx="190" ry="34" />
              <ellipse
                cx="300"
                cy="196"
                rx="140"
                ry="24"
                className="text-ring"
                strokeDasharray="2 6"
              />
            </>
          ) : (
            <>
              <circle cx="300" cy="120" r="110" />
              <circle
                cx="300"
                cy="120"
                r="78"
                className="text-ring"
                strokeDasharray="2 6"
              />
            </>
          )}
        </svg>
        <picture>
          {/* Tablet and up hide the close-up; an empty source there stops the download. */}
          <source
            media="(min-width: 768px)"
            srcSet="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
          />
          <source
            type="image/avif"
            sizes={SIZES}
            srcSet={shot.sources.map((s) => `${s.avif} ${s.w}w`).join(", ")}
          />
          <source
            type="image/webp"
            sizes={SIZES}
            srcSet={shot.sources.map((s) => `${s.webp} ${s.w}w`).join(", ")}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized crops; next/image would re-encode them. */}
          <img
            data-closeup-image
            src={shot.sources[0]!.webp}
            alt={shot.alt}
            width={shot.frame.width}
            height={shot.frame.height}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
      </div>
      <span
        data-closeup-label
        className="absolute bottom-3.5 left-3.5 rounded-full bg-ink px-3 py-1.5 text-xs font-bold tracking-[0.04em] text-bg uppercase ring-1 ring-card/70"
      >
        {index} · {shot.part}
      </span>
    </div>
  );
}
