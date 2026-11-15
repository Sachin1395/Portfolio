import { featuredProjects, moreProjectsCount, work } from "@/content/projects";
import { recruiterHref } from "@/content/site";
import { StoryPanel } from "@/components/story/StoryPanel";
import { ProjectCard } from "./ProjectCard";

/** Stop 02: the projects, shown while the camera is on the phone. */
export function WorkPanel() {
  return (
    <StoryPanel id="work" index={work.index} eyebrow={work.eyebrow} titleLines={work.titleLines} size="wide">
      <ul className="grid grid-cols-2 gap-2 md:gap-2.5">
        {featuredProjects.map((project) => (
          <li key={project.title} className="flex">
            <ProjectCard project={project} />
          </li>
        ))}
        <li className="flex">
          <a
            href={`${recruiterHref}#more-work`}
            className="more-tile relative flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-dashed border-ink px-3 py-2.5 text-center"
          >
            <span className="text-lg font-extrabold tracking-[-0.03em]">+{moreProjectsCount}</span>
            <span className="text-xs font-bold md:text-sm">
              more in Recruiter view&nbsp;
              <span aria-hidden="true" className="pill-arrow">
                →
              </span>
            </span>
          </a>
        </li>
      </ul>
    </StoryPanel>
  );
}
