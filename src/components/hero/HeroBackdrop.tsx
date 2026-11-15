import { meshPath } from "@/lib/mesh";

const desktopMesh = meshPath({
  width: 1440,
  height: 260,
  rows: [12, 30, 54, 84, 120, 162, 210, 260],
  wave: 12,
  columnGap: 90,
});

/**
 * Everything decorative behind the avatar: construction rings, the giant
 * "200", the wireframe floor and the drifting red shapes. Hidden from
 * assistive tech; all motion stops for reduced-motion users (globals.css).
 *
 * Story camera hooks (StoryController):
 *  - data-camera:       zooms fully with the avatar (rings, hero shapes)
 *  - data-camera-depth: zooms only part of the way, like a far wall (200, floor)
 *  - data-camera-dim:   dims while zoomed in, stays visible
 *  - data-camera-fade:  fades out while zoomed in
 *  - data-story-shapes: fixed to the screen; shows only during the tour
 */
export function HeroBackdrop() {
  return (
    <div data-parallax="back" aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div data-camera className="absolute inset-0">
        <svg
          className="absolute inset-0 size-full overflow-visible text-line"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="currentColor"
        >
          <circle className="text-ring" cx="720" cy="440" r="470" />
          <circle className="anim-spin text-ring-strong" cx="720" cy="440" r="330" strokeDasharray="2 6" />
          <line x1="0" y1="440" x2="1440" y2="440" />
        </svg>
      </div>

      <div data-camera-depth className="absolute inset-0">
        <div
          data-intro="number"
          className="absolute inset-0 flex items-center justify-center"
        >
          {/*
            The fade into the background is a gradient fill on the text itself, not a
            mask: a mask has to be recomposited on every zoom frame, a fill doesn't.
          */}
          <span
            data-camera-dim
            className="-mx-[0.1em] -my-[0.15em] block bg-[linear-gradient(to_bottom,var(--num)_35%,transparent_100%)] bg-clip-text px-[0.1em] py-[0.15em] text-transparent scale-x-110 scale-y-[2.2] text-[min(48vw,30svh)] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap md:scale-x-115 md:scale-y-130 md:text-[min(41.5vw,62svh)]"
          >
            200
          </span>
        </div>

        <div
          data-camera-dim
          className="absolute inset-x-0 bottom-0 h-[120px] md:h-[200px] xl:h-[260px]"
        >
          {/* Fades in from the top with a gradient stroke (cheaper to zoom than a CSS mask). */}
          <svg className="size-full text-line" viewBox="0 0 1440 260" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="floor-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="130">
                <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                <stop offset="1" stopColor="currentColor" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path d={desktopMesh} stroke="url(#floor-fade)" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      {/* Shapes sit in % of the hero so they keep clear of the avatar at every size. */}
      <div data-camera className="absolute inset-0">
        <div data-camera-fade>
          <span className="anim-shape-a absolute top-24 left-6 size-[18px] bg-red md:top-[17%] md:left-[10%] md:size-[30px] xl:size-[34px]" />
          <span className="anim-shape-b absolute top-[19%] right-[12%] hidden size-11 border-[6px] border-ink xl:block tall:right-auto tall:top-[77%] tall:left-[19.5%] tall:block tall:size-[30px] tall:border-[5px]" />
          <span className="anim-shape-c absolute top-[58%] right-[5%] hidden size-3.5 bg-red xl:block" />
        </div>
      </div>

      {/*
        The same three shapes for the tour, pinned to the screen corners instead of
        the scene. Invisible until the camera leaves the hero; the outer span takes
        the controller's drift, the inner one keeps its CSS wobble.
      */}
      <div data-story-shapes className="invisible absolute inset-0 hidden opacity-0 md:block">
        <span data-story-shape className="absolute top-[16%] left-[4%]">
          <span className="anim-shape-a block size-[22px] bg-red lg:size-[28px]" />
        </span>
        <span data-story-shape className="absolute right-[3.5%] bottom-[12%]">
          <span className="anim-shape-b block size-9 border-[5px] border-ink lg:size-10" />
        </span>
        <span data-story-shape className="absolute bottom-[18%] left-[5%]">
          <span className="anim-shape-c block size-3 bg-red lg:size-3.5" />
        </span>
      </div>
    </div>
  );
}
