import { Caveat, Silkscreen } from "next/font/google";

/** The Recruiter view's notebook voice: a pixel face for the name, a hand for notes. Only this page loads them. */
export const pixel = Silkscreen({ subsets: ["latin"], weight: ["700"], variable: "--font-pixel", display: "swap" });
export const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-hand", display: "swap" });

/** Tailwind class names for the two faces (the variables are set on the page wrapper). */
export const fontPixel = "font-[family-name:var(--font-pixel)]";
export const fontHand = "font-[family-name:var(--font-hand)]";
