import { Hero } from "@/components/hero/Hero";
import { StoryController } from "./StoryController";

/**
 * The scrolling story: the hero is the camera's wide shot, and each stop's
 * panel appears while the camera is zoomed on its detail.
 *
 * Without the motion layer (reduced motion, or before JavaScript runs) this is
 * simply the hero followed by the panels as normal sections.
 */
export function StoryStage({ children }: { children: React.ReactNode }) {
  return (
    <div data-story-stage className="relative bg-bg">
      <Hero />
      <div data-story-panels className="story:pointer-events-none story:absolute story:inset-0">
        {children}
      </div>
      <StoryController />
    </div>
  );
}
