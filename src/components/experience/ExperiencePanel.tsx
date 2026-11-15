import { experience } from "@/content/experience";
import { StoryPanel } from "@/components/story/StoryPanel";

/** Stop 04: "Where I've walked". A compact timeline, card on the right while the camera frames the sneakers. */
export function ExperiencePanel() {
  return (
    <StoryPanel
      id="experience"
      index={experience.index}
      eyebrow={experience.eyebrow}
      titleLines={experience.titleLines}
      size="dense"
    >
      <ol className="relative flex flex-col gap-3 roomy:gap-4">
        {/* The rail: a dashed "lace" joining the stops. */}
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] border-l-2 border-dashed border-line" />
        {experience.roles.map((role, i) => (
          <li key={role.start} className="relative pl-6">
            <span
              aria-hidden="true"
              className={
                "absolute top-[5px] left-0 size-3 rounded-full border-2 " +
                (i === 0 ? "border-red bg-red" : "border-ring-strong bg-card")
              }
            />
            <p className="font-mono text-[0.6875rem] font-medium tracking-[0.04em] text-muted uppercase">
              <time dateTime={role.start}>{role.dates}</time>
            </p>
            <h3 className="mt-0.5 text-[0.9375rem] leading-snug font-bold roomy:text-base">
              {role.title}
              <span className="font-semibold text-muted"> · {role.org}</span>
            </h3>
            {/* Phones in the tour keep only the latest role's line so the sheet never scrolls. */}
            <p className={"mt-0.5 text-[0.8125rem] leading-snug text-muted roomy:text-sm" + (i > 0 ? " max-md:story:hidden" : "")}>
              {role.line}
            </p>
          </li>
        ))}
      </ol>
    </StoryPanel>
  );
}
