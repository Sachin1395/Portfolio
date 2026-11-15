"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DOOR_TIMING, STORY_TIMING, panLength, storyStops } from "@/content/story";
import { scrollToY } from "@/lib/smooth-scroll";
import { HERO_FRAME, blendFrames, cameraFor } from "./camera";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Class on <html> that switches panels and the stage into their motion layouts. */
const MOTION_CLASS = "story-motion";
/**
 * Class on <html> while the camera is moving. It promotes the moving layers to
 * their own GPU layers (will-change, in globals.css), so a zoom only moves pixels
 * instead of repainting a 4x-scaled scene every frame (the scroll flicker).
 * It comes off shortly after the camera stops, so the browser repaints once,
 * sharp, at the resting zoom.
 */
const MOVING_CLASS = "story-moving";
const MOVING_SETTLE_MS = 180;
/**
 * A promoted layer is painted once, at the zoom it had when promoted, and only
 * around what was visible then. Zooming out from a close-up (4.7x) reveals parts
 * that were never painted, so the avatar blanks or flickers; zooming in stretches
 * a small paint and looks soft. So whenever the zoom has changed by more than this
 * factor since the last paint, the layers are un-promoted for one frame, which
 * repaints them at the current zoom (about 5 quick repaints from 4.7x down to 1x).
 */
const REPAINT_ZOOM_STEP = 1.35;
/** How far the 200 and the floor follow the camera (0 = stay put, 1 = zoom with the avatar). */
const DEPTH = 0.35;
/** Opacity of the 200 and the floor while zoomed in. */
const DIM = 0.55;
/**
 * Camera moves are scrubbed by scroll, so the ease *is* the scroll sensitivity.
 * sine.inOut keeps a soft start and stop but peaks at ~1.6x the average speed
 * (power2.inOut peaked at 2x, which felt like a lurch mid-move).
 */
const CAMERA_EASE = "sine.inOut";
/**
 * While a card holds, the camera creeps this fraction of the way towards the
 * next stop (or back towards the hero after the last one). It drifts along the
 * path it is about to take, so it never zooms in and then turns back out.
 */
const HOLD_DRIFT = 0.06;

type Hold = { id: string; start: number; end: number };

/**
 * Drives the camera tour: pins the stage, scrubs one timeline through every
 * stop (zoom in → card → pan to the next detail → … → pull back out), keeps the nav's current item in sync and
 * turns #anchor links into jumps along the timeline.
 * Renders nothing; does nothing for reduced-motion visitors.
 */
export function StoryController() {
  useGSAP(() => {
    const stage = document.querySelector<HTMLElement>("[data-story-stage]");
    const hero = stage?.querySelector<HTMLElement>("#top");
    const avatar = hero?.querySelector<HTMLElement>('[data-hero="avatar"] img');
    if (!stage || !hero || !avatar) return;

    const layers = gsap.utils.toArray<HTMLElement>("[data-camera]", hero);
    const depthLayers = gsap.utils.toArray<HTMLElement>("[data-camera-depth]", hero);
    const fades = gsap.utils.toArray<HTMLElement>("[data-camera-fade]", hero);
    const dims = gsap.utils.toArray<HTMLElement>("[data-camera-dim]", hero);
    const shapeSet = hero.querySelector<HTMLElement>("[data-story-shapes]");
    const shapes = gsap.utils.toArray<HTMLElement>("[data-story-shape]", hero);
    // End of the tour: the red statement band. Contact comes after the tour, as a normal section.
    const door = stage.querySelector<HTMLElement>("[data-story-door]");
    const letters = door ? gsap.utils.toArray<HTMLElement>("[data-door-letter]", door) : [];
    const contactScreen = document.querySelector<HTMLElement>("[data-story-contact]");
    const veil = document.querySelector<HTMLElement>("[data-jump-veil]");
    const contactReveals = contactScreen ? gsap.utils.toArray<HTMLElement>("[data-contact-reveal]", contactScreen) : [];
    const mm = gsap.matchMedia();

    mm.add(
      {
        phone: "(max-width: 767px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { phone, motion } = context.conditions as { phone: boolean; motion: boolean };
        // Phones have no tour: the cards are normal sections, each opening with a
        // still close-up of its detail (CloseUp). Same layout as reduced motion.
        if (!motion || phone) return;

        document.documentElement.classList.add(MOTION_CLASS);
        const { enter, hold, exit } = STORY_TIMING;
        // pans[i] = scroll length of the move into stop i (from stop i-1).
        const pans = storyStops.map((stop, i) => (i === 0 ? 0 : panLength(storyStops[i - 1]!, stop)));
        const hasDoor = !!door;
        const doorLength = hasDoor ? DOOR_TIMING.beat + DOOR_TIMING.rise + DOOR_TIMING.read : 0;
        const totalLength = enter + storyStops.length * hold + pans.reduce((a, b) => a + b, 0) + exit + doorLength;

        // Band offsets in px, measured on every refresh. (Not yPercent: GSAP re-reads
        // a % transform as px on refresh and would count it twice.)
        const below = () => door?.offsetHeight ?? window.innerHeight;
        const letterDrop = (_: number, el: HTMLElement) => el.offsetHeight * 1.1;

        // The band waits below the screen.
        // (Set here, not in CSS: GSAP owns these transforms.)
        if (door) gsap.set(door, { y: below });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${totalLength * window.innerHeight}`,
            pin: true,
            // true, not a lag: Lenis already smooths the scroll, and a second
            // smoothing layer makes the camera trail the fingers on a touchpad.
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Every stop's framing, measured lazily (function values re-run on refresh).
        const shots = storyStops.map((stop) => {
          const panel = stage.querySelector<HTMLElement>(`[data-story-panel="${stop.id}"]`);
          const shot = stop.shot;
          return {
            stop,
            panel,
            camera: () => cameraFor({ stage: hero, avatar, focus: stop.focus, shot, panel }),
          };
        });

        /** Moves every camera layer to a framing (or back to the hero when `frame` is null). */
        const moveCamera = (
          frame: (() => ReturnType<typeof cameraFor>) | null,
          at: number,
          duration: number,
          ease: string,
        ) => {
          for (const layer of layers) {
            tl.to(
              layer,
              frame
                ? {
                    x: () => frame().layerTranslate(layer).x,
                    y: () => frame().layerTranslate(layer).y,
                    scale: () => frame().scale,
                    transformOrigin: "0 0",
                    duration,
                    ease,
                  }
                : { x: 0, y: 0, scale: 1, duration, ease },
              at,
            );
          }
          // The 200 and the floor follow part of the way, like a far wall.
          for (const layer of depthLayers) {
            tl.to(
              layer,
              frame
                ? {
                    x: () => frame().depthFor(layer, DEPTH).x,
                    y: () => frame().depthFor(layer, DEPTH).y,
                    scale: () => frame().depthFor(layer, DEPTH).scale,
                    transformOrigin: "0 0",
                    duration,
                    ease,
                  }
                : { x: 0, y: 0, scale: 1, duration, ease },
              at,
            );
          }
        };

        /**
         * Screen-fixed corner shapes: each stop gets its own small drift and turn.
         * (Shapes that land behind the avatar or a card are simply covered.)
         */
        const poseShapes = (stopIndex: number, at: number, duration: number) => {
          shapes.forEach((shape, j) => {
            const turn = j % 2 === 0 ? 1 : -1;
            tl.to(
              shape,
              {
                x: Math.round(Math.sin(stopIndex * 1.7 + j * 2.1) * 18),
                y: Math.round(Math.cos(stopIndex * 1.3 + j * 1.9) * 30),
                rotation: (stopIndex + 1) * 45 * turn,
                duration,
                ease: CAMERA_EASE,
              },
              at,
            );
          });
        };

        const cardIn = (panel: HTMLElement | null, at: number, duration: number) =>
          panel && tl.fromTo(panel, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration, ease: "power2.out" }, at);
        const cardOut = (panel: HTMLElement | null, at: number, duration: number) =>
          panel && tl.to(panel, { autoAlpha: 0, y: -40, duration, ease: "power2.in" }, at);

        const holds: Hold[] = [];
        let t = 0;
        shots.forEach((current, i) => {
          if (i === 0) {
            // Hero → first detail: the hero fades, the camera dives in, the card rides
            // in with the second half of the zoom.
            tl.to(fades, { autoAlpha: 0, duration: 0.35, ease: "power1.out" }, t);
            tl.to(dims, { opacity: DIM, duration: 0.35, ease: "power1.out" }, t);
            moveCamera(() => current.camera(), t, enter, CAMERA_EASE);
            poseShapes(i, t, enter);
            if (shapeSet) tl.to(shapeSet, { autoAlpha: 1, duration: enter * 0.5, ease: "power1.out" }, t + enter * 0.5);
            cardIn(current.panel, t + enter * 0.5, enter * 0.5);
            t += enter;
          } else {
            // Detail → next detail in one steady glide (no zoom dip): the previous card
            // leaves in the first third, the next arrives over the second half.
            const previous = shots[i - 1]!;
            const pan = pans[i]!;
            cardOut(previous.panel, t, pan * 0.35);
            moveCamera(() => current.camera(), t, pan, CAMERA_EASE);
            poseShapes(i, t, pan);
            cardIn(current.panel, t + pan * 0.55, pan * 0.45);
            t += pan;
          }
          holds.push({ id: current.stop.id, start: t, end: t + hold });
          // While the card holds, the camera keeps creeping towards the next stop,
          // so every bit of scroll still moves something (no dead zones, no wobble).
          const next = shots[i + 1];
          moveCamera(() => blendFrames(current.camera(), next ? next.camera() : HERO_FRAME, HOLD_DRIFT), t, hold, "none");
          t += hold;
        });

        // Last detail → back to the hero, which fades in across the second half.
        const last = shots.at(-1);
        if (last) {
          cardOut(last.panel, t - exit * 0.15, exit * 0.45);
          moveCamera(null, t, exit, "sine.inOut");
          if (shapeSet) tl.to(shapeSet, { autoAlpha: 0, duration: exit * 0.4, ease: "sine.in" }, t);
          tl.to(fades, { autoAlpha: 1, duration: exit * 0.55, ease: "sine.out" }, t + exit * 0.45);
          tl.to(dims, { opacity: 1, duration: exit * 0.55, ease: "sine.out" }, t + exit * 0.45);
          t += exit;
        }

        // Hero → the statement band wipes up and its letters rise. Once it has been
        // read, the tour ends: the pin lets go with the band filling the screen, and
        // the page scrolls on normally, the band up and away, Contact up beneath it.
        let doorStart = Infinity;
        if (hasDoor) {
          const { beat, rise, read } = DOOR_TIMING;
          t += beat;
          doorStart = t;
          tl.fromTo(door, { y: below }, { y: 0, duration: rise, ease: CAMERA_EASE }, t);
          if (letters.length) {
            tl.fromTo(
              letters,
              { y: letterDrop },
              { y: 0, duration: rise * 0.45, stagger: (rise * 0.65) / letters.length, ease: "power2.out" },
              t + rise * 0.25,
            );
          }
          t += rise + read;
        }

        // Contact's title and links rise in as the section scrolls into view.
        if (contactReveals.length && contactScreen) {
          gsap.fromTo(
            contactReveals,
            { y: 40, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
              scrollTrigger: { trigger: contactScreen, start: "top 70%", toggleActions: "play none none reverse" },
            },
          );
        }

        // Keep the nav's current item in step with the camera: each stop owns its
        // hold plus half of the moves on either side.
        let activeId = "";
        const navLinks = (id: string) => document.querySelectorAll<HTMLAnchorElement>(`header a[href="#${id}"]`);
        let settleTimer = 0;
        const avatarLayer = hero.querySelector<HTMLElement>('[data-hero="avatar"] [data-camera]');
        const zoomNow = () => (avatarLayer ? Number(gsap.getProperty(avatarLayer, "scale")) || 1 : 1);
        let paintedZoom = 1;
        let repaintFrame = 0;
        const markMoving = () => {
          const root = document.documentElement;
          const zoom = zoomNow();
          if (!root.classList.contains(MOVING_CLASS)) {
            if (!repaintFrame) {
              root.classList.add(MOVING_CLASS);
              paintedZoom = zoom;
            }
          } else if (zoom > paintedZoom * REPAINT_ZOOM_STEP || zoom < paintedZoom / REPAINT_ZOOM_STEP) {
            // One frame un-promoted = one fresh paint at this zoom, then promote again.
            root.classList.remove(MOVING_CLASS);
            paintedZoom = zoom;
            repaintFrame = requestAnimationFrame(() => {
              repaintFrame = 0;
              root.classList.add(MOVING_CLASS);
            });
          }
          window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(() => {
            cancelAnimationFrame(repaintFrame);
            repaintFrame = 0;
            root.classList.remove(MOVING_CLASS);
          }, MOVING_SETTLE_MS);
        };

        tl.eventCallback("onUpdate", () => {
          markMoving();
          const now = tl.time();
          const current =
            now >= doorStart
              ? "contact"
              : holds.find((h, i) => {
              const before = i === 0 ? enter / 2 : pans[i]! / 2;
              const after = i === holds.length - 1 ? exit / 2 : pans[i + 1]! / 2;
              return now >= h.start - before && now <= h.end + after;
            })?.id ?? "";
          if (current === activeId) return;
          if (activeId) navLinks(activeId).forEach((a) => a.removeAttribute("aria-current"));
          if (current) navLinks(current).forEach((a) => a.setAttribute("aria-current", "true"));
          activeId = current;
          // The address follows the section on screen (clean "/" on the hero), so a
          // refresh or a shared link lands where the visitor was. replaceState, not
          // pushState: scrolling shouldn't fill the Back button with sections.
          history.replaceState(null, "", current ? `#${current}` : `${location.pathname}${location.search}`);
        });

        // #about etc. jump to the middle of that stop's hold instead of the static section.
        const scrollFor = (hold: Hold) => {
          const st = tl.scrollTrigger;
          if (!st) return 0;
          const mid = (hold.start + hold.end) / 2;
          return st.start + (mid / tl.duration()) * (st.end - st.start);
        };
        // Nav jumps fly the camera straight to the target instead of scrubbing
        // through every stop in between: snapshot what's on screen, jump the
        // scroll instantly, then tween from the snapshot to the new frame.
        const panels = shots.map((s) => s.panel).filter((p): p is HTMLElement => !!p);
        // Camera layers and cards move; the hero's fading pieces only change opacity
        // (some of them, like the stretched 200, carry their own CSS scale).
        const moving = [...layers, ...depthLayers, ...panels];
        const readMove = (el: HTMLElement) => ({
          x: gsap.getProperty(el, "x"),
          y: gsap.getProperty(el, "y"),
          scale: gsap.getProperty(el, "scale"),
          autoAlpha: gsap.getProperty(el, "opacity"),
        });
        // The corner shapes also turn.
        const readShape = (el: HTMLElement) => ({
          x: gsap.getProperty(el, "x"),
          y: gsap.getProperty(el, "y"),
          rotation: gsap.getProperty(el, "rotation"),
        });
        const readFade = (el: HTMLElement) => ({ autoAlpha: gsap.getProperty(el, "opacity") });
        const readDim = (el: HTMLElement) => ({ opacity: gsap.getProperty(el, "opacity") });
        const faders = shapeSet ? [...fades, shapeSet] : fades;
        let flight: gsap.core.Tween[] = [];
        const land = () => {
          flight.forEach((tween) => tween.kill());
          flight = [];
        };
        // Any manual scroll takes control back from a flight in progress.
        const interrupt = () => {
          if (!flight.length) return;
          land();
          ScrollTrigger.update();
        };
        // Render the timeline at the new scroll position right away. (With scrub: true
        // there is no catch-up tween; getTween() is then not a tween, so check first.)
        const settleScrub = () => {
          const tween = tl.scrollTrigger?.getTween();
          if (tween && typeof tween.progress === "function") tween.progress(1);
        };
        const FLIGHT = { duration: 1.4, ease: "power2.inOut", overwrite: false, onUpdate: markMoving } as const;
        const flyTo = (y: number) => {
          land();
          const movingBefore = moving.map(readMove);
          const shapesBefore = shapes.map(readShape);
          const fadesBefore = faders.map(readFade);
          const dimsBefore = dims.map(readDim);
          // Jump the scroll and let the timeline render the destination at once…
          scrollToY(y, { immediate: true });
          ScrollTrigger.update();
          settleScrub();
          // …then animate from what was on screen to that destination. Motion runs the
          // whole flight; fades are sequenced like the scroll version (what leaves fades
          // out early, what arrives fades in late), so nothing crossfades mid-flight.
          const fadeTiming = (from: number, to: number) =>
            to < from
              ? { duration: FLIGHT.duration * 0.4, ease: "power1.out" }
              : { duration: FLIGHT.duration * 0.5, delay: FLIGHT.duration * 0.5, ease: "power1.in" };
          const opacityOf = (v: gsap.TweenVars) => Number(v.autoAlpha ?? v.opacity ?? 0);
          const fade = (el: HTMLElement, from: gsap.TweenVars, to: gsap.TweenVars) =>
            gsap.fromTo(el, from, { ...to, ...fadeTiming(opacityOf(from), opacityOf(to)), overwrite: false });
          flight = [
            ...moving.map((el, i) => {
              const { autoAlpha: _from, ...move } = movingBefore[i]!;
              const { autoAlpha: _to, ...dest } = readMove(el);
              return gsap.fromTo(el, move, { ...dest, ...FLIGHT });
            }),
            ...moving.map((el, i) => fade(el, { autoAlpha: movingBefore[i]!.autoAlpha }, { autoAlpha: readMove(el).autoAlpha })),
            ...shapes.map((el, i) => gsap.fromTo(el, shapesBefore[i]!, { ...readShape(el), ...FLIGHT })),
            ...faders.map((el, i) => fade(el, fadesBefore[i]!, readFade(el))),
            ...dims.map((el, i) => fade(el, dimsBefore[i]!, readDim(el))),
          ];
        };
        /**
         * "Camera settles" jump, for moves into or out of the camera tour (Contact, the
         * footer, the band): the screen fades to the page colour, the page jumps unseen,
         * then the destination arrives: the hero lands from a slight zoom, Contact rises
         * in, a tour stop simply fades in.
         */
        let jumping = false;
        const VEIL_IN = 0.25;
        const contactTop = () =>
          contactScreen ? contactScreen.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight;
        const veilJump = (y: number, arrive: "hero" | "contact" | "stop") => {
          if (!veil) return void scrollToY(y, { immediate: true });
          land();
          jumping = true;
          gsap.to(veil, {
            autoAlpha: 1,
            duration: VEIL_IN,
            ease: "power1.out",
            overwrite: true,
            onComplete: () => {
              scrollToY(y, { immediate: true });
              ScrollTrigger.update();
              settleScrub();
              const settle = arrive === "hero" ? 0.6 : 0.5;
              if (arrive === "hero") {
                gsap.fromTo(hero, { scale: 1.06, transformOrigin: "50% 45%" }, { scale: 1, duration: settle, ease: "power2.out", clearProps: "transform" });
              } else if (arrive === "contact" && contactScreen) {
                const card = contactScreen.firstElementChild;
                if (card) gsap.fromTo(card, { y: 24 }, { y: 0, duration: settle, ease: "power2.out", clearProps: "transform" });
              }
              gsap.to(veil, {
                autoAlpha: 0,
                duration: settle,
                ease: "power1.inOut",
                onComplete: () => {
                  jumping = false;
                },
              });
            },
          });
        };

        const onClick = (event: MouseEvent) => {
          const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
          if (!link) return;
          const id = link.getAttribute("href")?.slice(1) ?? "";
          const hold = holds.find((h) => h.id === id);
          if (id !== "top" && id !== "contact" && !hold) return;
          event.preventDefault();
          if (jumping) return;
          // Outside the camera part of the tour: the band, Contact or the footer.
          const st = tl.scrollTrigger;
          const outside = tl.time() >= doorStart || (st ? window.scrollY > st.end : false);
          if (id === "contact") veilJump(contactTop(), "contact");
          else if (outside) veilJump(hold ? scrollFor(hold) : 0, hold ? "stop" : "hero");
          else flyTo(hold ? scrollFor(hold) : 0);
          history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
        };
        document.addEventListener("click", onClick);
        window.addEventListener("wheel", interrupt, { passive: true });
        window.addEventListener("touchstart", interrupt, { passive: true });
        window.addEventListener("keydown", interrupt);

        // Arriving on /#about: land on that stop once the layout is measured.
        // (Again after the next refresh, in case the intro loader is still holding the page.)
        const initial = holds.find((h) => `#${h.id}` === location.hash);
        if (initial) {
          const jump = () => scrollToY(scrollFor(initial), { immediate: true });
          // The browser's own #anchor jump (to the static section) can land after ours; win the race.
          history.scrollRestoration = "manual";
          requestAnimationFrame(jump);
          window.setTimeout(jump, 150);
          window.addEventListener("load", jump, { once: true });
          ScrollTrigger.addEventListener("refresh", function jumpOnce() {
            jump();
            ScrollTrigger.removeEventListener("refresh", jumpOnce);
          });
        }

        return () => {
          land();
          document.removeEventListener("click", onClick);
          window.removeEventListener("wheel", interrupt);
          window.removeEventListener("touchstart", interrupt);
          window.removeEventListener("keydown", interrupt);
          window.clearTimeout(settleTimer);
          cancelAnimationFrame(repaintFrame);
          document.documentElement.classList.remove(MOTION_CLASS, MOVING_CLASS);
        };
      },
    );

    return () => mm.revert();
  });

  return null;
}
