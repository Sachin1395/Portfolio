import { about } from "@/content/about";
import { StoryPanel } from "@/components/story/StoryPanel";

/** Stop 01: "What's in my head" — shown beside the camera's close-up of the head. */
export function AboutPanel() {
  return (
    <StoryPanel id="about" index={about.index} eyebrow={about.eyebrow} titleLines={about.titleLines}>
      <p className="text-[0.9375rem] leading-relaxed text-muted md:text-[1.0625rem]">{about.summary}</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 md:gap-4">
        {about.facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1">
            <dt className="text-xs font-bold tracking-[0.06em] text-muted uppercase">{fact.label}</dt>
            <dd className="text-sm leading-snug font-medium md:text-[0.9375rem]">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </StoryPanel>
  );
}
