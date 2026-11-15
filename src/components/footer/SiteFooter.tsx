import { footer } from "@/content/footer";
import { navItems, person, recruiterHref } from "@/content/site";
import { cn } from "@/lib/cn";
import { LocalTime } from "./LocalTime";

type FooterLink = { label: string; href: string };

const label = "text-xs font-bold tracking-[0.06em] text-muted uppercase";
/** Body size of the columns: a step smaller on tablets, where the columns are narrow. */
const big = "text-lg font-semibold tracking-[-0.01em] lg:text-[1.375rem]";

/**
 * The page's sign-off, after Contact. Contact holds the email and profiles, so the
 * footer is the map and the colophon: sections, local time, how it's built, a
 * rotating back-to-top badge and a full-width wordmark.
 * The story page and the Recruiter view each pass their own sections and side link.
 * `variant="notebook"` (Recruiter view): the same footer written into the notebook:
 * ruled paper, handwritten statement and links, the wordmark in the pixel face.
 * (That page loads the --font-hand and --font-pixel faces.)
 */
export function SiteFooter({
  sections = navItems,
  sideLink = { label: "Recruiter view", href: recruiterHref },
  variant = "default",
}: {
  sections?: readonly FooterLink[];
  sideLink?: FooterLink;
  variant?: "default" | "notebook";
} = {}) {
  const year = new Date().getFullYear();
  const nb = variant === "notebook";
  const hand = "font-[family-name:var(--font-hand)]";
  return (
    <footer className={nb ? "notebook-paper text-ink" : "bg-card text-ink"}>
      <div
        className={cn(
          "flex flex-col overflow-hidden px-6 pt-14 [container-type:inline-size] md:px-12",
          nb ? "mx-auto max-w-[1180px] border-t-2 border-ink md:px-10" : "rounded-b-[32px] border-b border-line bg-bg",
        )}
      >
        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-[1.15fr_1px_1fr_1fr] lg:gap-14">
          <div className="flex flex-col justify-between gap-10">
            <p className={nb ? `${hand} text-[1.875rem] leading-[1.1]` : "text-lg leading-tight font-bold tracking-[-0.02em] lg:text-[1.375rem]"}>
              {footer.statement.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            {/* Rotating badge: the lettering turns one way, the red square the other. */}
            <a
              href="#top"
              aria-label="Back to top"
              className="relative block size-32"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 128 128"
                className="footer-badge-ring absolute inset-0 size-full"
              >
                <defs>
                  <path
                    id="footer-badge-circle"
                    d="M64,64 m-49,0 a49,49 0 1,1 98,0 a49,49 0 1,1 -98,0"
                  />
                </defs>
                {/* textLength = the circle's circumference, so the phrase meets itself exactly with no overlap. */}
                <text fontSize="12.5" fontWeight="700" fill="currentColor">
                  <textPath
                    href="#footer-badge-circle"
                    textLength="306"
                    lengthAdjust="spacing"
                  >
                    {"BACK TO TOP · BACK TO TOP · "}
                  </textPath>
                </text>
              </svg>
              <span
                aria-hidden="true"
                className="footer-badge-core absolute top-[47px] left-[47px] block size-[34px] bg-red"
              />
            </a>
          </div>

          <div aria-hidden="true" className="hidden bg-line lg:block" />

          <div className="flex flex-col gap-3.5">
            <p className={label}>Sections</p>
            <nav aria-label="Footer">
              <ul className={nb ? `${hand} flex flex-col gap-1 text-[1.75rem] leading-tight` : `flex flex-col gap-1.5 ${big}`}>
                {sections.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="underline-offset-4 hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-col gap-3.5">
            <p className={label}>Local time</p>
            <p className={big}>
              <span className="whitespace-nowrap">
                <span
                  aria-hidden="true"
                  className="mr-2 lg:mr-2.5 inline-block size-[9px] translate-y-[-3px] rounded-full bg-red"
                />
                Chennai · <LocalTime /> IST
              </span>
            </p>
            <p className={`mt-5 ${label}`}>Built with</p>
            <p className={`leading-snug ${big}`}>
              {footer.builtWith.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <a
              href={sideLink.href}
              className={cn(
                "mt-2 self-start bg-ink px-4 py-2.5 text-xs font-bold tracking-[0.04em] text-bg uppercase hover:opacity-90",
                nb ? "font-mono font-medium" : "rounded-full",
              )}
            >
              {sideLink.label} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Sized to the panel (cqw = its content width) so the word spans edge to edge; cropped a little at the bottom. */}
        <p
          aria-label={person.name.split(" ")[0]}
          className={cn(
            "pt-8 leading-none whitespace-nowrap",
            nb
              ? "-mb-[0.14em] font-[family-name:var(--font-pixel)] text-[calc(100cqw/5.1)] tracking-[0.01em]"
              : "-mb-[0.13em] -ml-[0.035em] text-[calc(100cqw/3.38)] font-extrabold tracking-[-0.06em]",
          )}
        >
          <span aria-hidden="true">{footer.wordmark}</span>
        </p>
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 px-6 py-5 text-xs font-semibold tracking-[0.04em] md:flex-row md:items-center md:justify-between md:px-12",
          nb && "mx-auto max-w-[1180px] border-t border-line font-mono font-medium md:px-10",
        )}
      >
        <span>© {year} SACHIN A. ALL RIGHTS RESERVED.</span>
        <span className="whitespace-pre">{footer.bottomRight}</span>
      </div>
    </footer>
  );
}
