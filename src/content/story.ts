/**
 * The camera tour. Each stop zooms onto one detail of the avatar and shows its panel.
 * Add a stop here (and its panel in StoryStage) to extend the tour.
 */

/** Where the camera puts the focus point, as fractions of the stage, and how far it zooms. */
export type CameraShot = {
  /** Destination of the focus point, 0–1 across the stage. */
  x: number;
  /** Destination of the focus point, 0–1 down the stage. */
  y: number;
  /** Avatar height after zooming, in stage heights (1 = avatar as tall as the screen). */
  zoom: number;
  /**
   * If set, ignore `x` and park the detail this many px beside the stop's card
   * (left of a right-hand card, right of a left-hand one), so the gap stays the
   * same at every screen width.
   */
  panelGap?: number;
  /**
   * With `panelGap`: shrink the zoom on narrow screens so the whole detail fits
   * beside the card (default). Turn off when the detail may tuck under the card.
   */
  fitDetail?: boolean;
  /**
   * Keep the top of the avatar at least this many px below the top of the stage
   * (clear of the nav). If the shot would put it higher, the camera moves down.
   * For close-ups of the head, whose hair would otherwise run under the nav on short screens.
   */
  minTop?: number;
};

export type StoryStop = {
  /** Also the in-page anchor (#about) and the nav link it lights up. */
  id: string;
  /**
   * Point on the avatar to frame, as fractions of the avatar image (0–1), and
   * half the detail's width (fraction of the avatar's width) for `panelGap`.
   */
  focus: { x: number; y: number; halfWidth: number };
  /** The camera's framing (tablet and desktop; phones have no tour, see CloseUp). */
  shot: CameraShot;
};

export const storyStops: readonly StoryStop[] = [
  {
    id: "about",
    focus: { x: 0.5, y: 0.15, halfWidth: 0.37 },
    shot: { x: 0.27, y: 0.46, zoom: 3, panelGap: 88, minTop: 80 },
  },
  {
    id: "work",
    // The phone and the hands holding it.
    // halfWidth covers the phone only; hands and sweater may tuck under the card.
    focus: { x: 0.52, y: 0.4, halfWidth: 0.13 },
    shot: { x: 0.27, y: 0.52, zoom: 3.9, panelGap: 64, fitDetail: false },
  },
  {
    id: "stack",
    // The knit below the hands. Card on the left, so the camera swings the detail right.
    focus: { x: 0.5, y: 0.5, halfWidth: 0.44 },
    shot: { x: 0.7, y: 0.5, zoom: 3.2, panelGap: 56, fitDetail: false },
  },
  {
    id: "experience",
    // The sneakers. Card back on the right, so the camera swings the detail left.
    focus: { x: 0.5, y: 0.93, halfWidth: 0.42 },
    shot: { x: 0.27, y: 0.6, zoom: 2, panelGap: 88 },
  },
];

/**
 * Scroll lengths, in viewport heights. The tour is one continuous camera move:
 * zoom in from the hero (enter), hold each stop's card (hold), pan straight to
 * the next stop (pan), and pull back out to the hero after the last one (exit).
 * Stops must stay in body order, top to bottom, so every pan travels downward.
 */
export const STORY_TIMING = { enter: 1.4, hold: 0.9, exit: 1.4 } as const;

/**
 * After the tour (viewport heights): a beat on the hero, the statement band
 * rising over it, and time to read it. Then the tour lets go and the page
 * scrolls on normally: the band moves up and Contact comes up beneath it.
 */
export const DOOR_TIMING = { beat: 0.4, rise: 1, read: 0.6 } as const;

/**
 * Scroll length of the pan between two stops: longer travel gets more scroll,
 * so the camera moves at a similar, calm speed (≈0.75 for a nudge, ≈1.8 for the longest trip).
 */
export function panLength(from: StoryStop, to: StoryStop): number {
  // Distance along the avatar, plus the swing across the screen when the card changes sides.
  const travel =
    Math.abs(to.focus.y - from.focus.y) +
    0.3 * Math.abs(to.focus.x - from.focus.x) +
    0.6 * Math.abs(to.shot.x - from.shot.x);
  return Math.min(1.8, Math.max(0.75, 0.55 + travel * 1.7));
}
