import { recruiterSections } from "@/content/recruiter";
import { ThemeToggle } from "@/components/nav/ThemeToggle";

const tab = "flex items-center px-3.5 no-underline hover:bg-ink/5 lg:px-4";

/** The notebook's tab bar: sticky, section tabs on the left, the way back and contact on the right. */
export function NotebookNav() {
  return (
    <header
      data-nav-bar
      className="sticky top-0 z-30 border-b border-line bg-paper font-mono text-[0.6875rem] font-medium tracking-[0.06em] print:hidden"
    >
      <div className="flex h-[52px] items-stretch justify-between gap-3 pr-3 lg:pr-[18px]">
        <nav aria-label="Sections" className="flex items-stretch overflow-x-auto [scrollbar-width:none]">
          <a href="#top" className="flex items-center bg-red px-4 text-on-red no-underline">
            <span aria-hidden="true">★&nbsp;</span>HOME
          </a>
          {recruiterSections
            .filter((item) => item.href !== "#contact")
            .map((item) => (
              <a key={item.href} href={item.href} className={`${tab} hidden md:flex`}>
                {item.label.toUpperCase()}
              </a>
            ))}
        </nav>
        <div className="flex items-center gap-2 lg:gap-2.5">
          <a href="/" className="hidden px-2 py-2 whitespace-nowrap no-underline hover:underline lg:block">
            <span aria-hidden="true">←&nbsp;</span>THE STORY
          </a>
          <ThemeToggle className="size-9" />
          <a href="#contact" className="border-[1.5px] border-ink px-3.5 py-2 whitespace-nowrap no-underline hover:bg-ink hover:text-bg">
            <span aria-hidden="true">♥&nbsp;</span>CONTACT
          </a>
        </div>
      </div>
    </header>
  );
}
