import avatarManifest from "./generated/avatar.json";

/**
 * Paths and measurements for the character images. Everything here is written
 * by scripts/prepare-assets.mjs (npm run assets); file names carry a content
 * hash, so a re-export can never be mixed with a cached older image.
 */
const { wave, hd, closeUps: closeUpFiles, ...avatarFiles } = avatarManifest;

export const avatar = {
  alt: "Illustrated avatar of Sachin, in a black knit sweater and white joggers, looking at his phone",
  /**
   * Sharper copies for the camera's close-ups, loaded after the page settles.
   * HdLayer picks the smallest height that is sharp enough for the screen.
   */
  hd,
  ...avatarFiles,
} as const;

/** The waving pose, shown in Contact. */
export const avatarWave = {
  alt: "Sachin's avatar smiling and waving hello",
  ...wave,
} as const;


/**
 * Phones: the still close-up at the top of each story card (instead of the camera
 * tour). Crops come from scripts/prepare-assets.mjs, framed for a 358×240 window.
 * `floor` draws the rings as a flat floor under the sneakers instead of circles.
 */
export const closeUps = {
  about: {
    ...closeUpFiles.about,
    part: "Head",
    alt: "Close-up of Sachin's avatar: his head",
    floor: false,
  },
  work: {
    ...closeUpFiles.work,
    part: "Phone",
    alt: "Close-up of Sachin's avatar: the phone in his hands",
    floor: false,
  },
  stack: {
    ...closeUpFiles.stack,
    part: "Shoulders",
    alt: "Close-up of Sachin's avatar: the shoulder of his knit sweater",
    floor: false,
  },
  experience: {
    ...closeUpFiles.experience,
    part: "Sneakers",
    alt: "Close-up of Sachin's avatar: his white sneakers",
    floor: true,
  },
} as const;

export type CloseUpId = keyof typeof closeUps;
