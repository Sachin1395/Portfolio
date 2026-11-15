import type { CameraShot } from "@/content/story";

type Point = { x: number; y: number };

/** Minimum space kept between a framed detail and the left edge of the screen. */
const EDGE_MARGIN = 24;

/** Layout offset of `el` inside `ancestor`, ignoring CSS transforms (uses offsetLeft/Top). */
export function offsetWithin(el: HTMLElement, ancestor: HTMLElement): Point {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/**
 * One camera move for the whole scene: scale everything by `scale` and move
 * the focus point to the shot's destination. Every layer gets the same visual
 * result, whatever its own position, via its own translate (transform-origin 0 0).
 */
export function cameraFor({
  stage,
  avatar,
  focus,
  shot,
  panel,
}: {
  stage: HTMLElement;
  avatar: HTMLElement;
  focus: Point & { halfWidth: number };
  shot: CameraShot;
  /** The stop's card; used when the shot keeps a fixed gap to it. */
  panel?: HTMLElement | null;
}) {
  const avatarAt = offsetWithin(avatar, stage);
  const focusPoint: Point = {
    x: avatarAt.x + focus.x * avatar.offsetWidth,
    y: avatarAt.y + focus.y * avatar.offsetHeight,
  };
  let scale = (stage.offsetHeight * shot.zoom) / avatar.offsetHeight;
  let destX = shot.x * stage.offsetWidth;
  if (shot.panelGap !== undefined && panel) {
    // The card only moves vertically, so its edges are stable even mid-animation.
    const stageBox = stage.getBoundingClientRect();
    const box = panel.getBoundingClientRect();
    const panelLeft = box.left - stageBox.left;
    const panelRight = box.right - stageBox.left;
    // Card on the right → detail to its left; card on the left → detail to its right.
    const cardOnRight = panelLeft + box.width / 2 > stage.offsetWidth / 2;
    // On narrower screens, zoom less so the whole detail fits between the edge and the card.
    if (shot.fitDetail !== false) {
      const room = cardOnRight
        ? panelLeft - shot.panelGap - EDGE_MARGIN
        : stage.offsetWidth - panelRight - shot.panelGap - EDGE_MARGIN;
      scale = Math.min(scale, room / (2 * focus.halfWidth * avatar.offsetWidth));
    }
    const halfDetail = scale * focus.halfWidth * avatar.offsetWidth;
    destX = cardOnRight ? panelLeft - shot.panelGap - halfDetail : panelRight + shot.panelGap + halfDetail;
  }
  const dest: Point = { x: destX, y: shot.y * stage.offsetHeight };
  if (shot.minTop !== undefined) {
    // Where the avatar's top edge lands with this framing; push the shot down if it's under the nav.
    const top = dest.y - scale * (focusPoint.y - avatarAt.y);
    if (top < shot.minTop) dest.y += shot.minTop - top;
  }
  // Scene-wide mapping: p' = scale * p + shift
  const shift: Point = { x: dest.x - scale * focusPoint.x, y: dest.y - scale * focusPoint.y };
  /** Translate for a layer whose untransformed top-left sits at `origin` in stage space. */
  const layerTranslate = (layer: HTMLElement) => {
    const origin = offsetWithin(layer, stage);
    return { x: shift.x + (scale - 1) * origin.x, y: shift.y + (scale - 1) * origin.y };
  };

  /**
   * The same move, only `amount` (0–1) of the way: a far-away layer that zooms
   * and drifts less than the avatar, for depth. (Blends the mapping with "no move".)
   */
  const depthFor = (layer: HTMLElement, amount: number) => {
    const s = 1 + (scale - 1) * amount;
    const origin = offsetWithin(layer, stage);
    return { scale: s, x: amount * shift.x + (s - 1) * origin.x, y: amount * shift.y + (s - 1) * origin.y };
  };

  return { scale, layerTranslate, depthFor };
}

export type CameraFrame = ReturnType<typeof cameraFor>;

/** The hero shot: no zoom, no move. */
export const HERO_FRAME: CameraFrame = {
  scale: 1,
  layerTranslate: () => ({ x: 0, y: 0 }),
  depthFor: () => ({ scale: 1, x: 0, y: 0 }),
};

/**
 * A frame `amount` (0–1) of the way from `a` to `b`, interpolating the same
 * x / y / scale values the pan tween animates, so it lies exactly on the pan's path.
 */
export function blendFrames(a: CameraFrame, b: CameraFrame, amount: number): CameraFrame {
  const mix = (p: number, q: number) => p + (q - p) * amount;
  return {
    scale: mix(a.scale, b.scale),
    layerTranslate: (layer) => {
      const p = a.layerTranslate(layer), q = b.layerTranslate(layer);
      return { x: mix(p.x, q.x), y: mix(p.y, q.y) };
    },
    depthFor: (layer, depth) => {
      const p = a.depthFor(layer, depth), q = b.depthFor(layer, depth);
      return { scale: mix(p.scale, q.scale), x: mix(p.x, q.x), y: mix(p.y, q.y) };
    },
  };
}
