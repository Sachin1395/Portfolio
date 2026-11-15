"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";
import { getLenis } from "@/lib/smooth-scroll";
import { preloadAssets } from "./preload";

gsap.registerPlugin(useGSAP);

/** The counter runs 000 → 200: "200 OK". */
const TARGET = 200;
/**
 * The count always takes this long (s), even on a cached visit, so the intro reads
 * as a deliberate beat rather than a flash: about 1.9 s from first paint to
 * "200 OK" and the hand-off, which then takes another ~0.9 s.
 */
const MIN_DURATION = 1.4;
/** The count's pace: a soft start and a gentle landing on 200. */
const COUNT_EASE = "power2.inOut";
/** After this (ms), stop waiting for slow assets and finish anyway. */
const MAX_WAIT_MS = 2600;
/** Just before the CSS failsafe in globals.css (.loader-overlay starts fading at 3 s). */
const FAILSAFE_MS = 2600;
/** If anything throws, the hero is revealed no matter what after this. */
const SAFETY_MS = 5000;

/** Elements elsewhere on the page opt into the hand-off with data-intro. */
const INTRO = {
  number: '[data-intro="number"]',
  avatar: '[data-intro="avatar"]',
  chrome: '[data-intro="chrome"]',
} as const;

/** Page-wide lookup: these targets live outside the loader, so GSAP's scoped selectors can't see them. */
function pageTargets(selector: string): Element[] {
  return Array.from(document.querySelectorAll(selector));
}

function shouldSkip(): boolean {
  return (
    document.documentElement.dataset.loader === "skip" || prefersReducedMotion()
  );
}

/**
 * The "GET /sachin → 200 OK" intro. Counts with real preload progress, then
 * hands off: its 200 grows away while the hero's 200, avatar and chrome fade in.
 * Server HTML includes it, so CSS can hide it if JavaScript never runs.
 */
export function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [ok, setOk] = useState(false);
  const [status, setStatus] = useState("Loading");
  const root = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      // On a slow device the CSS failsafe may already have removed the overlay
      // before hydration; never bring it back and replay the count.
      if (shouldSkip() || performance.now() > FAILSAFE_MS) {
        setVisible(false);
        return;
      }
      // JS is in charge now: cancel the CSS failsafe, hold the scroll still and hide the hero behind us.
      root.current?.style.setProperty("animation", "none");
      document.documentElement.style.overflow = "hidden";
      getLenis()?.stop();
      const number = pageTargets(INTRO.number);
      const avatar = pageTargets(INTRO.avatar);
      const chrome = pageTargets(INTRO.chrome);
      gsap.set(number, { autoAlpha: 0, scale: 0.72 });
      gsap.set(avatar, { autoAlpha: 0, y: 24 });
      gsap.set(chrome, { autoAlpha: 0 });

      const counter = { value: 0 };
      const render = () => {
        const n = Math.round(counter.value);
        if (numberRef.current)
          numberRef.current.textContent = String(n).padStart(3, "0");
        const pct = Math.round((n / TARGET) * 100);
        if (pctRef.current) pctRef.current.textContent = `${pct}%`;
        if (barRef.current)
          barRef.current.style.transform = `scaleX(${n / TARGET})`;
      };

      let finished = false;
      const revealHero = () =>
        gsap.set([...number, ...avatar, ...chrome], {
          clearProps: "opacity,visibility,transform",
        });
      const safety = window.setTimeout(() => {
        revealHero();
        setVisible(false);
      }, SAFETY_MS);

      const handOff = () => {
        setOk(true);
        setStatus("Loaded");
        gsap
          .timeline({
            delay: 0.25,
            defaults: { ease: "power3.out" },
            onComplete: () => {
              window.clearTimeout(safety);
              revealHero();
              setVisible(false);
            },
          })
          .to(numberRef.current, { scale: 1.5, autoAlpha: 0, duration: 0.6 }, 0)
          .to(
            root.current,
            { backgroundColor: "rgba(0,0,0,0)", duration: 0.6 },
            0,
          )
          .to(".intro-fade", { autoAlpha: 0, duration: 0.35 }, 0)
          .to(number, { autoAlpha: 1, scale: 1, duration: 0.6 }, 0.1)
          .to(avatar, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.25)
          .to(chrome, { autoAlpha: 1, duration: 0.4 }, 0.45);
      };

      /*
       * One smooth count on a fixed clock: `clock` runs 0 → 1 over MIN_DURATION
       * on COUNT_EASE, and the number shown is that clock held back by real
       * preload progress (eased, so a late file never makes it jump). It reaches
       * 200 only when both the time is up and the hero's images are in.
       */
      const clock = { t: 0 };
      let loaded = 0;
      let shown = 0;
      const tick = () => {
        shown += (loaded - shown) * 0.12;
        if (loaded === 1 && 1 - shown < 0.002) shown = 1;
        counter.value = Math.min(clock.t, shown) * TARGET;
        render();
        if (clock.t === 1 && shown === 1) finish();
      };
      const finish = () => {
        if (finished) return;
        finished = true;
        gsap.ticker.remove(tick);
        gsap.killTweensOf(clock);
        if (counter.value < TARGET) {
          // Gave up waiting (or slow assets): glide the rest of the way rather than snap.
          gsap.to(counter, {
            value: TARGET,
            duration: 0.35,
            ease: "power2.out",
            onUpdate: render,
            onComplete: handOff,
          });
        } else {
          handOff();
        }
      };
      gsap.to(clock, { t: 1, duration: MIN_DURATION, ease: COUNT_EASE });
      gsap.ticker.add(tick);

      const waitTimer = window.setTimeout(finish, MAX_WAIT_MS);
      // The hero's own images (avatar + blink patch), not their raw files: see preload.ts.
      const heroImages = avatar
        .flatMap((el) => Array.from(el.querySelectorAll("img")))
        .filter(
          (img) =>
            img.currentSrc.includes("/_next/image") ||
            img.src.includes("/_next/image"),
        );
      preloadAssets(heroImages, (fraction) => {
        loaded = Math.max(loaded, fraction);
      }).then(() => {
        loaded = 1;
      });

      return () => {
        window.clearTimeout(waitTimer);
        window.clearTimeout(safety);
        gsap.ticker.remove(tick);
      };
    },
    { scope: root },
  );

  // Give the scroll back (and let the story re-measure) as soon as the intro is gone.
  useEffect(() => {
    if (visible) return;
    document.documentElement.style.removeProperty("overflow");
    getLenis()?.start();
    ScrollTrigger.refresh();
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={root}
      className="loader-overlay fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-bg px-4 text-ink"
    >
      <p role="status" className="sr-only">
        {status}
      </p>

      <svg
        aria-hidden="true"
        className="intro-fade absolute inset-0 size-full text-line"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
      >
        <circle className="text-ring" cx="720" cy="440" r="470" />
        <line x1="0" y1="440" x2="1440" y2="440" />
        <line x1="720" y1="0" x2="720" y2="900" />
      </svg>

      <p
        aria-hidden="true"
        className="intro-fade relative font-mono text-[0.8125rem] font-medium text-muted lg:text-[0.9375rem]"
      >
        {ok ? "HTTP/1.1 " : "GET /sachin "}
        <span className="text-ink">{ok ? "200 OK" : "HTTP/1.1"}</span>
      </p>

      <div
        aria-hidden="true"
        className="relative flex items-center gap-3 lg:gap-6"
      >
        <span
          ref={numberRef}
          className={`block text-[clamp(120px,30vw,320px)] leading-[0.85] font-extrabold tracking-[-0.05em] tabular-nums ${ok ? "text-red" : "text-ink"}`}
        >
          000
        </span>
        <span
          className={`intro-fade rounded-full bg-ink px-3 py-2 text-xl font-extrabold tracking-[-0.02em] text-bg transition-opacity duration-200 lg:px-[22px] lg:py-3.5 lg:text-[40px] ${ok ? "opacity-100" : "opacity-0"}`}
        >
          OK
        </span>
      </div>

      <div
        aria-hidden="true"
        className="intro-fade relative flex w-[min(420px,80vw)] flex-col gap-2.5"
      >
        <div className="h-1 overflow-hidden rounded-full bg-border">
          <div
            ref={barRef}
            className="h-full origin-left bg-red"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <div className="flex justify-between text-[0.8125rem] font-semibold text-muted">
          <span>{ok ? "Ready" : "Loading the hero"}</span>
          <span ref={pctRef} className="tabular-nums">
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
