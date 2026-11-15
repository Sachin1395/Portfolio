import { IntroLoader } from "@/components/loader/IntroLoader";
import { SiteNav } from "@/components/nav/SiteNav";
import { StoryStage } from "@/components/story/StoryStage";
import { AboutPanel } from "@/components/about/AboutPanel";
import { WorkPanel } from "@/components/work/WorkPanel";
import { StackPanel } from "@/components/stack/StackPanel";
import { ExperiencePanel } from "@/components/experience/ExperiencePanel";
import { DoorBand } from "@/components/contact/DoorBand";
import { ContactSection } from "@/components/contact/ContactSection";
import { SiteFooter } from "@/components/footer/SiteFooter";

/**
 * Home page. The story stage holds the hero and one panel per camera stop,
 * in the order listed in content/story.ts, then the statement band. When the band
 * fills the screen the tour lets go, and Contact and the footer scroll in as normal
 * sections. The veil covers the screen during "jump" transitions (StoryController).
 */
export default function HomePage() {
  return (
    <>
      <IntroLoader />
      <SiteNav />
      <main>
        <StoryStage>
          <AboutPanel />
          <WorkPanel />
          <StackPanel />
          <ExperiencePanel />
          <DoorBand />
        </StoryStage>
        <ContactSection />
      </main>
      <SiteFooter />
      <div data-jump-veil aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[29] bg-bg opacity-0" />
    </>
  );
}
