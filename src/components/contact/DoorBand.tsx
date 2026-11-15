import { door } from "@/content/contact";

const statement = door.lines.join(" ");

/**
 * The red statement band. In the tour it wipes up over the hero, its letters
 * rise one by one, then it lifts away to reveal Contact (StoryController).
 * Without motion it is an ordinary full-width band above Contact.
 */
export function DoorBand() {
  return (
    <section
      data-story-door
      aria-label={statement}
      className="relative flex flex-col justify-center gap-1 overflow-hidden bg-red px-6 py-16 text-on-red md:px-12 md:py-24 story:pointer-events-auto story:absolute story:inset-0 story:z-20 story:py-0"
    >
      <p aria-hidden="true" className="mb-4 text-[0.8125rem] font-bold tracking-[0.08em] uppercase">
        {door.eyebrow}
      </p>
      <h2 aria-hidden="true" className="text-[clamp(40px,7.8vw,112px)] leading-[0.95] font-bold tracking-[-0.045em]">
        {door.lines.map((line) => (
          <span key={line} className="block">
            {/* One mask per word keeps lines from breaking mid-word; letters rise inside it. */}
            {line.split(" ").map((word, w) => (
              <span key={w} className="mr-[0.25em] inline-block overflow-hidden align-bottom last:mr-0">
                {[...word].map((ch, c) => (
                  <span key={c} data-door-letter className="inline-block">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </h2>
      <div aria-hidden="true" className="mt-10 flex overflow-hidden text-[clamp(15px,1.5vw,22px)] font-bold tracking-[0.02em] whitespace-nowrap">
        <div className="anim-marquee flex shrink-0 gap-10 pr-10">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>{statement} —</span>
          ))}
        </div>
        <div className="anim-marquee flex shrink-0 gap-10 pr-10">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>{statement} —</span>
          ))}
        </div>
      </div>
      {/* Scroll cue: the band holds for a beat, so say there is more below (Contact).
          Below lg it sits left of the fixed menu button. Decorative: the page scrolls on anyway. */}
      <span
        aria-hidden="true"
        className="absolute right-[76px] bottom-5 flex items-center gap-2.5 text-[0.75rem] font-bold tracking-[0.08em] lg:right-12 lg:bottom-8 lg:text-[0.8125rem]"
      >
        SCROLL
        <span className="flex size-8 items-center justify-center rounded-full border-[1.5px] border-current lg:size-9">
          <span className="anim-scroll-cue block">↓</span>
        </span>
      </span>
    </section>
  );
}
