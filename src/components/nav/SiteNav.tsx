import { navItems, person, recruiterHref } from "@/content/site";
import { PillLink } from "@/components/ui/PillLink";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

/**
 * Fixed top bar. Desktop: logo · centred section links · theme switch + Recruiter view.
 * Mobile: the same, with the section list in the bottom-right menu.
 */
export function SiteNav() {
  return (
    <>
      {/* Without the motion stage the page scrolls under the bar, so the bar gets a backdrop
        (on the bar itself, so it slides away with it at the footer);
        with it, the stage is pinned and the bar stays transparent over the art. */}
      <header
        data-intro="chrome"
        className="pointer-events-none fixed inset-x-0 top-0 z-30"
      >
        <div
          data-nav-bar
          className="pointer-events-auto bg-bg/85 backdrop-blur-md story:bg-transparent story:backdrop-blur-none grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-12 lg:py-5"
        >
          <a
            href="#top"
            className="justify-self-start text-[1.0625rem] font-extrabold tracking-[-0.02em] text-ink lg:text-xl"
          >
            {person.shortName}
          </a>

          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="flex gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <PillLink
                    href={item.href}
                    variant="surface"
                    size="md"
                    className="py-2 aria-[current=true]:border-ink aria-[current=true]:bg-ink aria-[current=true]:text-bg"
                  >
                    {item.label}
                  </PillLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5 justify-self-end">
            <ThemeToggle />
            {/* Résumé lives in the hero buttons (and the phone menu), so the nav keeps one action. */}
            <PillLink
              href={recruiterHref}
              arrow="next"
              variant="inverse"
              size="md"
              className="max-lg:py-3"
            >
              Recruiter view
            </PillLink>
          </div>
        </div>
      </header>
      {/* Outside the header: its backdrop-filter would make it the box the menu's
        `fixed` is measured from, pulling the button up into the bar. */}
      <div data-intro="chrome">
        <MobileMenu />
      </div>
    </>
  );
}
