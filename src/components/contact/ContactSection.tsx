import Image from "next/image";
import { contact } from "@/content/contact";
import { avatarWave } from "@/content/assets";
import { links, person } from "@/content/site";
import { PillLink } from "@/components/ui/PillLink";

/**
 * Contact: a normal section after the tour (the band scrolls away and this comes up
 * beneath it). Email is the main action; no phone number. The top padding keeps the
 * card clear of the fixed nav when a link jumps here.
 */

export function ContactSection() {
  return (
    <section
      id="contact"
      data-story-contact
      aria-labelledby="contact-title"
      className="bg-bg px-4 pt-6 pb-10 md:px-8 md:pt-[88px] md:pb-12 lg:px-12"
    >
      <div className="relative flex w-full flex-col overflow-hidden rounded-[28px] border border-border bg-card md:min-h-[min(520px,calc(100svh-112px))] md:flex-row md:items-center md:gap-10 lg:gap-12">
        {/*
          The rings and the avatar share one anchor: the rings' centre. The avatar's
          feet sit on the outer ring (r = 250px), whatever the card's height.
        */}
        {/* --ring: the outer ring's radius, capped by height so short screens keep his feet inside the card. */}
        <div className="pointer-events-none absolute top-[55%] left-[16%] hidden size-0 [--ring:min(250px,29svh)] md:block">
          <svg
            aria-hidden="true"
            className="absolute top-[calc(var(--ring)*-1.04)] left-[calc(var(--ring)*-1.04)] size-[calc(var(--ring)*2.08)] text-line"
            viewBox="0 0 520 520"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="260" cy="260" r="250" />
            <circle cx="260" cy="260" r="170" strokeDasharray="2 6" className="text-ring-strong" />
          </svg>
          <Image
            src={avatarWave.src}
            alt={avatarWave.alt}
            width={avatarWave.width}
            height={avatarWave.height}
            sizes="(min-width: 1024px) 260px, 200px"
            className="absolute bottom-[calc(var(--ring)*-0.992)] left-1/2 h-[calc(var(--ring)*2.08)] w-auto max-w-none -translate-x-1/2"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 size-28 rounded-tl-full bg-red md:size-36 min-[1400px]:size-[200px]"
        />

        {/* Keeps the text clear of the avatar. */}
        <div aria-hidden="true" className="hidden shrink-0 md:block md:w-[30%] lg:w-[32%]" />

        <div className="relative flex flex-col gap-5 p-6 md:py-12 md:pr-12 md:pl-0 lg:gap-6">
          <p className="text-[0.8125rem] font-bold tracking-[0.08em] text-link uppercase">
            {contact.index} — {contact.eyebrow}
          </p>
          <h2
            id="contact-title"
            data-contact-reveal
            className="text-[clamp(40px,min(6.6vw,12svh),96px)] leading-[0.9] font-extrabold tracking-[-0.045em]"
          >
            {contact.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div data-contact-reveal className="flex flex-col gap-4">
            <PillLink href={`mailto:${person.email}`} variant="primary" size="lg" arrow="next" className="self-start">
              {person.email}
            </PillLink>
            <ul className="flex flex-wrap gap-2" aria-label="Elsewhere">
              <li>
                <PillLink href={links.linkedin} variant="outline" arrow="external">LinkedIn</PillLink>
              </li>
              <li>
                <PillLink href={links.github} variant="outline" arrow="external">GitHub</PillLink>
              </li>
              <li>
                <PillLink href={links.leetcode} variant="outline" arrow="external">LeetCode</PillLink>
              </li>
              <li>
                <PillLink href={links.resume} variant="outline" arrow="external">Résumé</PillLink>
              </li>
            </ul>
            <p className="text-[0.9375rem] font-medium text-muted">
              {contact.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
