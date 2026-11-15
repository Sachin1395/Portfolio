import { links, person } from "@/content/site";
import { PillLink } from "@/components/ui/PillLink";
import { HeroBackdrop } from "./HeroBackdrop";
import { Avatar } from "./Avatar";
import { HeroParallax } from "./HeroParallax";

/**
 * Frame 1 of the story: the zoomed-out camera shot. Three layouts:
 *  - phone  (< md):  stacked — avatar, then text, then buttons
 *  - tablet (md–xl): split — avatar on the right (clear of the menu button
 *    below lg), text and buttons bottom-left. Upright tablets (`tall`) centre the
 *    text and buttons in the left column beside the torso, with a larger avatar.
 *  - desktop (xl+):  avatar centred, text bottom-left, buttons bottom-right
 * The hero is always exactly one window tall: sizes are % of the section, and
 * the big type is capped by height as well as width, so short laptop screens fit.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex h-svh min-h-[620px] flex-col overflow-hidden pt-20 md:block md:min-h-[480px] md:pt-0"
    >
      <HeroBackdrop />
      <HeroParallax />

      <div
        data-intro="avatar"
        data-hero="avatar"
        className="relative flex min-h-0 flex-1 justify-center md:absolute md:right-[84px] md:bottom-[4%] lg:right-[5vw] md:h-[84%] md:max-h-[800px] tall:right-[6.8vw] tall:bottom-[3.5%] tall:h-[88%] tall:max-h-none xl:right-0 xl:left-0 xl:bottom-[5%] xl:h-[calc(95%-80px)] xl:max-h-[820px]"
      >
        {/* Hover parallax moves this wrapper (hero only); the story camera moves the
            inner layer; the intro fades the outer one. Three layers, so none clash. */}
        <div data-parallax="front" className="h-full">
          <div data-camera className="relative h-full">
            <div
              aria-hidden="true"
              className="absolute inset-y-[4%] -inset-x-[70%] bg-[radial-gradient(closest-side,var(--glow),transparent)]"
            />
            <Avatar priority sizes="(min-width: 768px) 290px, 50vw" />
          </div>
        </div>
      </div>

      <div
        data-intro="chrome"
        data-hero="text"
        className="relative flex flex-col gap-3 px-4 pt-4 md:absolute md:bottom-[124px] md:left-8 md:max-w-[48vw] md:p-0 tall:bottom-[41%] tall:gap-3.5 lg:left-12 xl:bottom-[52px] xl:max-w-[min(560px,36vw)] xl:gap-3.5 short:gap-2 short:max-xl:bottom-[104px] short:xl:bottom-9"
      >
        <p data-camera-fade className="self-start rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold md:text-[0.8125rem]">
          <span className="text-red" aria-hidden="true">●</span> {person.tagline}
        </p>
        <h1
          data-camera-fade
          id="hero-title"
          aria-label={person.heroNameLines.join(" ")}
          className="text-[46px] leading-[0.92] font-extrabold tracking-[-0.045em] md:text-[clamp(48px,min(8vw,12svh),88px)] md:leading-[0.9] tall:text-[min(11vw,92px)] xl:text-[clamp(56px,min(6.4vw,12.5svh),104px)]"
        >
          {person.heroNameLines.map((line) => (
            <span key={line} aria-hidden="true" className="block">
              {line}
            </span>
          ))}
        </h1>
        <p data-camera-fade className="text-[0.9375rem] font-medium leading-snug md:text-[1.1875rem] xl:text-[1.3125rem]">
          {person.role}
        </p>
        <p data-camera-fade className="flex flex-col text-[0.8125rem] leading-snug font-medium text-muted md:text-[0.9375rem]">
          <span>{person.context}</span>
          <span>{person.proof}</span>
        </p>
      </div>

      <div
        data-intro="chrome"
        data-hero="actions"
        className="relative flex gap-2 px-4 pt-4 pr-20 pb-6 md:absolute md:bottom-[44px] md:left-8 md:p-0 tall:top-[calc(59%+28px)] tall:bottom-auto lg:left-12 xl:right-12 xl:bottom-[52px] xl:left-auto xl:flex-col xl:items-end xl:gap-[18px] short:md:bottom-8 short:xl:bottom-9 short:xl:gap-3"
      >
        <div data-camera-fade className="flex gap-2 md:gap-2.5">
          <PillLink href="#work" arrow="next" variant="primary" size="lg" className="max-md:px-5 max-md:py-3.5 max-md:text-[0.9375rem]">
            View work
          </PillLink>
          <PillLink href={links.resume} arrow="external" variant="outline" size="lg" className="max-md:px-5 max-md:py-3.5 max-md:text-[0.9375rem]">
            Résumé
          </PillLink>
        </div>
        <span data-camera-fade className="hidden text-[0.8125rem] font-bold tracking-[0.08em] text-muted xl:block">
          SCROLL ↓
        </span>
      </div>
    </section>
  );
}
