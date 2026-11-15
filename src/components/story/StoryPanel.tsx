import { cn } from "@/lib/cn";
import { closeUps } from "@/content/assets";
import { CloseUp } from "./CloseUp";

type PanelSize = "default" | "wide" | "dense";
type PanelSide = "right" | "left";

const sides: Record<PanelSide, string> = {
  right: "md:story:right-8 lg:max-xl:story:right-12 xl:story:right-[9vw]",
  left: "md:story:left-8 lg:max-xl:story:left-12 xl:story:left-[9vw]",
};

const widths: Record<PanelSize, { static: string; motion: string; title: string }> = {
  default: {
    static: "md:max-w-2xl",
    motion: "md:story:w-[min(560px,46vw)]",
    title: "text-[30px] md:text-[clamp(36px,4.2vw,56px)] short:text-[clamp(30px,6.5svh,44px)]",
  },
  // For stops with a grid of items (Work): more room, a slightly smaller heading.
  wide: {
    static: "md:max-w-4xl",
    motion: "md:story:w-[min(780px,58vw)] md:story:gap-4",
    title: "text-[26px] md:text-[clamp(28px,3vw,42px)] short:text-[clamp(24px,5svh,32px)]",
  },
  // Default width, but lots of content (Stack): the smaller heading keeps it scroll-free.
  dense: {
    static: "md:max-w-2xl",
    motion: "md:story:w-[min(560px,46vw)] md:story:gap-4",
    title: "text-[26px] md:text-[clamp(28px,3vw,42px)] short:text-[clamp(24px,5svh,32px)]",
  },
};

/**
 * The card every story stop uses. Two layouts, switched by the `story-motion`
 * class the StoryController puts on <html>:
 *  - motion (tablet and up): floats beside the zoomed avatar
 *  - static (phones, reduced motion, no JS): an ordinary section below the hero.
 *    On phones it opens with a still close-up of the stop's detail (CloseUp).
 */
export function StoryPanel({
  id,
  index,
  eyebrow,
  titleLines,
  size = "default",
  side = "right",
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  titleLines: readonly string[];
  size?: PanelSize;
  /** Which side the card sits on (tablet and up); the camera frames the detail on the other. */
  side?: PanelSide;
  children: React.ReactNode;
}) {
  const headingId = `${id}-title`;
  const w = widths[size];
  return (
    <section
      id={id}
      data-story-panel={id}
      aria-labelledby={headingId}
      className={cn(
        // static: a normal section
        "mx-4 my-12 flex flex-col gap-5 rounded-[20px] border border-border bg-card p-6 shadow-[0_24px_60px_rgba(0,0,0,0.08)] md:mx-auto md:p-10",
        w.static,
        // motion, phone: bottom sheet
        // (extra bottom padding keeps the last lines clear of the menu button)
        "story:pointer-events-auto story:absolute story:inset-x-0 story:bottom-0 story:m-0 story:max-h-[70%] story:gap-3 story:overflow-y-auto story:rounded-b-none story:p-4 story:pb-20",
        // short phones (≤700px tall): let the sheet rise higher rather than scroll inside
        "max-md:[@media(max-height:700px)]:story:max-h-[90%] max-md:[@media(max-height:700px)]:story:pb-16",
        // motion, tablet + desktop: card at one side, vertically centred below the nav.
        // (Centred with margins, not translate: GSAP animates this element's transform.)
        "md:story:inset-x-auto md:story:top-[88px] md:story:bottom-6 md:story:my-auto md:story:h-fit md:story:max-h-[calc(100%-112px)] md:story:rounded-[20px] md:story:p-9 lg:story:p-10",
        // short windows (e.g. a laptop at 150% scaling): tighter padding and gaps, and a little more height
        "short:story:top-[76px] short:story:bottom-4 short:story:max-h-[calc(100%-92px)] short:story:gap-2.5 short:story:p-6 short:lg:story:p-7",
        sides[side],
        w.motion,
      )}
    >
      {id in closeUps && <CloseUp id={id as keyof typeof closeUps} index={index} />}
      <p className="text-[0.8125rem] font-bold tracking-[0.08em] text-link uppercase">
        {index} — {eyebrow}
      </p>
      <h2 id={headingId} className={cn("leading-[0.95] font-extrabold tracking-[-0.04em]", w.title)}>
        {titleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      {children}
    </section>
  );
}
