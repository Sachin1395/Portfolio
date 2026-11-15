import type { Project } from "@/content/projects";

/**
 * One project as a compact row, so the Work card never needs to scroll:
 * short title, then role · date on one line, links on the right.
 * (Full descriptions belong to the Recruiter view.)
 * Phones: title over links, in a two-column grid.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-row flex w-full flex-col justify-between gap-2 rounded-[12px] border border-border bg-bg px-3 py-2.5 md:flex-row md:items-center md:gap-3 md:px-4 md:py-3">
      <div className="min-w-0">
        <h3
          title={project.title}
          aria-label={project.title}
          className="truncate text-[0.84375rem] leading-tight font-bold tracking-[-0.01em] md:text-[0.9375rem]"
        >
          {project.shortTitle}
        </h3>
        {/* Role · date; on hover (or focus) it cross-blurs to the tech used. */}
        <p className="project-swap mt-0.5 hidden text-xs font-medium text-muted md:grid">
          <span>{project.meta}</span>
          <span aria-hidden="true">{project.tech.join(" · ")}</span>
        </p>
        <p className="sr-only">Built with {project.tech.join(", ")}</p>
      </div>
      <ul className="flex shrink-0 gap-3">
        {project.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-6 items-center text-xs font-bold text-link underline underline-offset-2 hover:opacity-85"
            >
              {link.label}
              <span aria-hidden="true">&nbsp;↗</span>
              <span className="sr-only">: {project.title} (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
