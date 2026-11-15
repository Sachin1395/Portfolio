import { cn } from "@/lib/cn";

type Variant = "primary" | "inverse" | "outline" | "surface";
type Size = "sm" | "md" | "lg";

// Hover: filled pills dim a touch; outline pills fill with ink; surface pills
// (the nav) firm up their border. Colour only, so it's motion-safe.
const variants: Record<Variant, string> = {
  primary: "bg-red text-on-red hover:opacity-90",
  inverse: "bg-ink text-bg hover:opacity-90",
  outline: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-bg",
  surface: "border border-border bg-card text-ink hover:border-ink",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.8125rem]",
  md: "px-4 py-2.5 text-sm",
  lg: "px-7 py-4 text-base",
};

const arrows = { next: "→", external: "↗" } as const;

type PillLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> & {
  variant?: Variant;
  size?: Size;
  /** Trailing arrow: "next" for in-page moves; "external" also opens a new tab. */
  arrow?: keyof typeof arrows;
};

/** The pill-shaped link used for every call to action and nav item. */
export function PillLink({ variant = "surface", size = "md", arrow, className, children, ...props }: PillLinkProps) {
  const external = arrow === "external";
  return (
    <a
      {...props}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className={cn(
        "pill-link inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap no-underline",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
      {arrow && (
        <>
          &nbsp;
          <span aria-hidden="true" data-arrow={arrow} className="pill-arrow">
            {arrows[arrow]}
          </span>
        </>
      )}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
