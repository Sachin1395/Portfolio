import { stack } from "@/content/stack";
import { StoryPanel } from "@/components/story/StoryPanel";
import { StackRow } from "./StackRow";

/**
 * Stop 03: "What I'm knitted from" — the skills, on the left while the camera frames the sweater.
 * One aligned line per group (label column, then as many skills as fit, then "+n"),
 * separated by a dashed "stitch". The first skills in each group in content/stack.ts are the ones shown.
 */
export function StackPanel() {
  return (
    <StoryPanel id="stack" index={stack.index} eyebrow={stack.eyebrow} titleLines={stack.titleLines} size="dense" side="left">
      <div className="flex flex-col divide-y divide-dashed divide-line">
        {stack.groups.map((group) => (
          <StackRow key={group.name} name={group.name} items={group.items} />
        ))}
      </div>
    </StoryPanel>
  );
}
