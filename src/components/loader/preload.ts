/**
 * Waits for the given <img> elements (the hero's own, as rendered by next/image)
 * to load and decode, then for web fonts, reporting progress 0..1. Waiting on the
 * real elements, not new Image(url), means nothing is downloaded twice: the page's
 * optimized copy is the one the intro waits for.
 * Never rejects: a failed image still counts as "done" so the intro can't hang.
 */
export async function preloadAssets(
  images: readonly HTMLImageElement[],
  onProgress: (fraction: number) => void,
): Promise<void> {
  const total = images.length + 1; // +1 for fonts
  let done = 0;
  const tick = () => onProgress(++done / total);

  const imageJobs = images.map(async (img) => {
    try {
      // decode() on an element waits for its own load, whatever srcset it picked.
      if (!(img.complete && img.naturalWidth)) await img.decode();
    } catch {
      // Ignore: a broken image must not hold the intro.
    }
    tick();
  });

  const fontJob = (async () => {
    try {
      await document.fonts.ready;
    } catch {
      // Older browsers without the Font Loading API.
    }
    tick();
  })();

  await Promise.all([...imageJobs, fontJob]);
}
