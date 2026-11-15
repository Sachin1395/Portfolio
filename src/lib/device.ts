/**
 * "Light mode" for genuinely weak devices: decided once per visit.
 * When it applies, <html> gets the `lite` class (globals.css switches off the
 * decorative loops: shapes, spinning ring, marquee). The camera tour still runs.
 *
 * Deliberately hard to trigger, so capable laptops never lose the motion:
 *  1. Hardware: only very little memory (≤ 2 GB, where the browser reports it).
 *     Core count alone is never used.
 *  2. Frame rate: measured only once the page has settled (a few seconds after
 *     load, tab visible), over two separate 1.5 s samples. Light mode only if
 *     BOTH stay under 30 fps. A slow moment during load no longer counts.
 *  3. Never in development: `npm run dev` is always slower than the real site.
 */

export const LITE_CLASS = "lite";
/** v2: answers stored by the old, over-eager check are ignored. */
const STORAGE_KEY = "device-lite-v2";
const MIN_FPS = 30;
const SAMPLE_MS = 1500;
const SETTLE_MS = 3000;
const BETWEEN_MS = 2000;

export function isLite() {
  return typeof document !== "undefined" && document.documentElement.classList.contains(LITE_CLASS);
}

function apply(lite: boolean) {
  document.documentElement.classList.toggle(LITE_CLASS, lite);
}

function remember(lite: boolean) {
  try {
    sessionStorage.setItem(STORAGE_KEY, lite ? "1" : "0");
    sessionStorage.removeItem("device-lite"); // the old key
  } catch {}
}

function veryLowMemory() {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return memory !== undefined && memory <= 2;
}

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

/** Frames per second over SAMPLE_MS, or null if the tab was hidden (no frames = no signal). */
function measureFps(): Promise<number | null> {
  return new Promise((resolve) => {
    if (document.visibilityState !== "visible") return resolve(null);
    let frames = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (document.visibilityState !== "visible") return resolve(null);
      frames++;
      if (now - start < SAMPLE_MS) requestAnimationFrame(tick);
      else resolve((frames * 1000) / (now - start));
    };
    requestAnimationFrame(tick);
  });
}

/** Runs once per visit; later pages reuse the stored answer. Resolves with the decision. */
export async function detectLite(): Promise<boolean> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      apply(stored === "1");
      return stored === "1";
    }
  } catch {}

  if (process.env.NODE_ENV !== "production") return false;
  if (veryLowMemory()) {
    apply(true);
    remember(true);
    return true;
  }

  await wait(SETTLE_MS);
  const first = await measureFps();
  if (first === null || first >= MIN_FPS) {
    if (first !== null) remember(false);
    return false;
  }
  await wait(BETWEEN_MS);
  const second = await measureFps();
  if (second === null) return false; // inconclusive: keep full motion, decide next visit
  const lite = second < MIN_FPS;
  apply(lite);
  remember(lite);
  return lite;
}
