import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/content/about";
import { avatar, avatarWave } from "@/content/assets";
import { contact } from "@/content/contact";
import { experience } from "@/content/experience";
import { featuredProjects } from "@/content/projects";
import { languages, moreProjects, notebook, recognition, recruiterSections } from "@/content/recruiter";
import { links, person } from "@/content/site";
import { stack } from "@/content/stack";
import { cn } from "@/lib/cn";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { SmoothAnchors } from "@/components/recruiter/SmoothAnchors";
import { NotebookNav } from "@/components/recruiter/notebook/NotebookNav";
import { MonoLinks, NoteHeading, Tape } from "@/components/recruiter/notebook/bits";
import { fontHand, fontPixel, hand, pixel } from "@/components/recruiter/notebook/fonts";

export const metadata: Metadata = {
  title: `Recruiter view — ${person.name}`,
  description: "Every project, role, skill and award, on one notebook page.",
};

const total = featuredProjects.length + moreProjects.length;
const mono = "font-mono text-[0.6875rem] font-medium tracking-[0.08em] uppercase";

/** Folder colours for the featured projects, in order. */
const folders = [
  "bg-ink text-bg",
  "bg-red text-on-red",
  "bg-num text-ink",
  "bg-card text-ink border border-line",
  "bg-ink text-bg",
];
const tabFolders = ["bg-ink text-bg", "bg-red text-on-red", "bg-num text-ink", "bg-card text-ink", "bg-ink text-bg"];
const tilts = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1", "rotate-2", "-rotate-[1.5deg]", "rotate-1"];

/** Stack rows: each group gets its own tag style. */
const stackRows = [
  { name: stack.groups[0]!.name, items: stack.groups[0]!.items, tag: "bg-red text-on-red border-red" },
  { name: stack.groups[1]!.name, items: stack.groups[1]!.items, tag: "bg-ink text-bg border-ink" },
  { name: stack.groups[2]!.name, items: stack.groups[2]!.items, tag: "bg-card text-ink border-ink" },
  { name: stack.groups[3]!.name, items: stack.groups[3]!.items, tag: "bg-num text-ink border-num" },
  { name: stack.groups[4]!.name, items: stack.groups[4]!.items, tag: "bg-card text-ink border-line" },
  { name: "Languages", items: languages, tag: "bg-ink text-bg border-ink" },
];

/** The Recruiter view, as a notebook: one plain, skimmable page with everything on it. */
export default function RecruiterPage() {
  return (
    <div className={cn(pixel.variable, hand.variable, "notebook-paper min-h-svh overflow-x-clip text-ink")}>
      {/* Back-to-top target (the sticky tab bar never counts as off-screen). */}
      <span id="top" aria-hidden="true" className="absolute top-0" />
      <SmoothAnchors />
      <NotebookNav />
      {/* The paper fills the screen; the writing keeps a comfortable column. */}
      <div className="mx-auto max-w-[1180px]">
        <main>
          {/* Hero */}
          <section aria-labelledby="name" className="relative flex flex-col items-center gap-3.5 px-6 pt-14 pb-16 text-center lg:pb-[72px]">
            <p className={cn(fontHand, "text-2xl")}>my name is</p>
            <div className="border-2 border-red bg-paper px-6 py-3 md:px-8">
              <h1 id="name" aria-label={person.name} className={cn(fontPixel, "text-[clamp(56px,9vw,104px)] leading-none tracking-[0.02em]")}>
                SACHIN
              </h1>
            </div>
            {/* Labels around the name: pinned around it on desktop, a row underneath on smaller screens. */}
            <ul className="flex flex-wrap justify-center gap-2.5 lg:contents">
              <li className="-rotate-[4deg] border border-line bg-card px-3 py-1.5 font-mono text-[0.6875rem] font-medium lg:absolute lg:top-[70px] lg:left-[22%]">
                {notebook.nameLabels[0]}
              </li>
              <li className="rotate-3 bg-ink px-3 py-1.5 font-mono text-[0.6875rem] font-medium text-bg lg:absolute lg:top-16 lg:right-[21%]">
                {notebook.nameLabels[1]}
              </li>
              <li className={cn(fontHand, "rotate-3 bg-red px-3 py-1 text-xl text-on-red lg:absolute lg:top-[226px] lg:left-[23%]")}>
                {notebook.nameLabels[2]}
              </li>
              <li className={cn(fontHand, "-rotate-3 border border-line bg-card px-3 py-1 text-xl lg:absolute lg:top-[226px] lg:right-[23%]")}>
                {notebook.nameLabels[3]}
              </li>
            </ul>
            <p className="mt-2.5 font-mono text-xs font-medium tracking-[0.06em] lg:mt-12">
              <span aria-hidden="true" className="text-red">
                ●{" "}
              </span>
              {notebook.openTo}
            </p>
            <p className="mt-2.5 max-w-[640px] text-[clamp(32px,3.6vw,44px)] leading-[1.08] font-extrabold tracking-[-0.035em]">
              {notebook.statement}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2.5">
              <a href={`mailto:${person.email}`} className={cn(mono, "flex items-center gap-2.5 bg-ink px-[18px] py-3 text-bg no-underline hover:opacity-90")}>
                <span aria-hidden="true" className="block size-3.5 bg-red" />
                EMAIL ME
              </a>
              <a href={links.resume} className={cn(mono, "border-[1.5px] border-ink px-[18px] py-3 no-underline hover:bg-ink hover:text-bg")}>
                RÉSUMÉ <span aria-hidden="true">↓</span>
              </a>
            </div>
          </section>

          <svg aria-hidden="true" viewBox="0 0 1180 40" preserveAspectRatio="none" className="block h-10 w-full text-ring-strong">
            <path d="M0,30 Q590,-10 1180,30" fill="none" stroke="currentColor" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* About */}
          <section aria-labelledby="about-title" className="relative flex flex-col items-center gap-5 px-6 pt-8 pb-14">
            <p className={cn(fontHand, "self-start text-[1.375rem] lg:ml-[60px]")}>{notebook.notes.about}</p>
            <h2 id="about-title" className="border-[1.5px] border-ink px-4 py-1.5 font-mono text-lg font-medium">
              what&apos;s up
            </h2>
            <p className={cn(fontHand, "max-w-[560px] text-center text-[1.8125rem] leading-[1.25]")}>{about.summary}</p>

            {/* Taped photos: either side of the text on desktop, a row on smaller screens. */}
            <div className="flex flex-wrap justify-center gap-8 lg:contents">
              <figure className="relative -rotate-[4deg] bg-white p-2.5 pb-7 shadow-[0_8px_22px_rgba(0,0,0,0.14)] lg:absolute lg:top-[110px] lg:left-[70px]">
                <Tape className="-top-2.5 left-[30px] -rotate-6" />
                <div className="relative h-[170px] w-[150px] overflow-hidden bg-[#e2e2dd]">
                  <Image src={avatar.src} alt="Sachin's illustrated avatar, head and shoulders" width={avatar.width} height={avatar.height} sizes="240px" className="absolute top-2 -left-[13px] w-[176px] max-w-none" />
                </div>
                <figcaption className={cn(fontHand, "mt-1.5 text-center text-[1.0625rem] text-[#111111]")}>{notebook.captions.head}</figcaption>
              </figure>
              <figure className="relative rotate-3 bg-white p-2.5 pb-7 shadow-[0_8px_22px_rgba(0,0,0,0.14)] lg:absolute lg:top-[70px] lg:right-[70px]">
                <Tape tone="ink" className="-top-2.5 right-[30px] rotate-[5deg]" />
                <div className="relative h-[150px] w-[170px] overflow-hidden bg-[#e2e2dd]">
                  <Image src={avatarWave.src} alt="Sachin's avatar waving hello" width={avatarWave.width} height={avatarWave.height} sizes="180px" className="absolute top-1 left-0 w-[170px] max-w-none" />
                </div>
                <figcaption className={cn(fontHand, "mt-1.5 text-center text-[1.0625rem] text-[#111111]")}>{notebook.captions.wave}</figcaption>
              </figure>
            </div>

            <ul aria-label="Top skills" className="flex max-w-[560px] flex-wrap justify-center gap-2.5">
              {notebook.tags.map((t, i) => (
                <li key={t} className={cn("px-4 py-2 font-bold", tilts[i], ["bg-red text-on-red", "bg-ink text-bg", "border-[1.5px] border-ink bg-card", "bg-num"][i])}>
                  {t}
                </li>
              ))}
            </ul>

            <dl className="mt-4 grid w-full max-w-[980px] gap-3.5 md:grid-cols-2 lg:grid-cols-4">
              {about.facts.map((f) => (
                <div key={f.label} className="relative border border-line bg-card px-4 pt-4 pb-4 pl-7 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                  <span aria-hidden="true" className="absolute inset-y-0 left-3.5 w-px bg-red/40" />
                  <dt className="mb-1.5 font-mono text-[0.65625rem] font-medium tracking-[0.08em] text-muted uppercase">{f.label}</dt>
                  <dd className="text-[0.9375rem] leading-snug font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Featured work: folder tabs */}
          <section id="work" aria-labelledby="work-title" className="flex scroll-mt-24 flex-col gap-6 px-6 pt-6 pb-10 md:px-8">
            <NoteHeading
              id="work-title"
              note={notebook.notes.work}
              title="featured work"
              aside={<span className="font-mono text-[0.6875rem] font-medium tracking-[0.06em] text-muted">{featuredProjects.length} OF {total} PROJECTS</span>}
            />
            <ol className="flex flex-col">
              {featuredProjects.map((p, i) => {
                const metric = notebook.metrics[p.title];
                return (
                  <li key={p.title} className={cn(i > 0 && "md:-mt-[18px]", "relative")} style={{ "--tab": `${i * 14}%` } as React.CSSProperties}>
                    <span
                      aria-hidden="true"
                      className={cn(mono, tabFolders[i % tabFolders.length], "inline-block px-[22px] py-[9px] [clip-path:polygon(0_0,88%_0,100%_100%,0_100%)] md:ml-[var(--tab)]")}
                    >
                      ✦ PROJECT {String(i + 1).padStart(2, "0")}
                    </span>
                    <article className={cn(folders[i % folders.length], "grid gap-8 px-7 py-7 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:px-9")}>
                      <div className="flex flex-col gap-3">
                        <p className={mono}>● {p.meta}</p>
                        <h3 className="text-[clamp(30px,3.4vw,40px)] leading-none font-extrabold tracking-[-0.04em]">{p.title}</h3>
                        <p className="text-[0.9375rem] leading-relaxed opacity-85">{p.proof}</p>
                        <p className="font-mono text-[0.71875rem] opacity-80">{p.fullTech.join(" · ")}</p>
                        <MonoLinks links={p.links} project={p.title} />
                      </div>
                      {metric && (
                        <div className="flex items-center justify-center">
                          <div className={cn("relative w-[230px] bg-card px-[22px] pt-[22px] pb-[26px] text-ink shadow-[0_10px_24px_rgba(0,0,0,0.18)]", i % 2 ? "rotate-2" : "-rotate-2")}>
                            <Tape className="-top-[11px] left-1/2 -ml-[35px] w-[70px]" />
                            <p className="text-[3.375rem] leading-none font-extrabold tracking-[-0.05em]">{metric.value}</p>
                            <p className={cn(fontHand, "mt-1.5 text-[1.3125rem] leading-tight")}>{metric.label}</p>
                          </div>
                        </div>
                      )}
                    </article>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* More work: index cards */}
          <section id="more-work" aria-labelledby="more-title" className="flex scroll-mt-24 flex-col gap-6 px-6 pt-6 pb-12 md:px-8">
            <NoteHeading id="more-title" title="more work" aside={<span className={cn(fontHand, "text-[1.375rem] text-muted")}>{notebook.notes.more}</span>} />
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {moreProjects.map((m) => (
                <li key={m.title} className="relative flex flex-col gap-2 border border-line bg-card py-[18px] pr-[18px] pl-[30px] shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                  <span aria-hidden="true" className="absolute inset-y-0 left-[18px] w-px bg-red/40" />
                  <h3 className="text-[1.0625rem] font-bold">{m.title}</h3>
                  <p className="text-[0.84375rem] leading-normal text-muted">{m.line}</p>
                  <p className="mt-auto font-mono text-[0.65625rem] font-medium tracking-[0.04em] uppercase">
                    {m.meta} · {m.tech}
                  </p>
                  <div className="text-link">
                    <MonoLinks links={m.links} project={m.title} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Experience */}
          <section id="experience" aria-labelledby="exp-title" className="flex scroll-mt-24 flex-col gap-6 px-6 pt-6 pb-12 md:px-8">
            <NoteHeading id="exp-title" note={notebook.notes.experience} title="experience" />
            <ol className="flex flex-col">
              {experience.roles.map((r) => (
                <li key={r.start} className="grid items-baseline gap-x-6 gap-y-1 border-b border-dashed border-ring py-[18px] md:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-[210px_minmax(0,1fr)_200px]">
                  <p className="font-mono text-xs font-medium tracking-[0.04em] text-link uppercase">
                    <time dateTime={r.start}>{r.dates}</time>
                  </p>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold">
                      {r.title} <span className="font-semibold text-muted">· {r.org}</span>
                    </h3>
                    <p className="text-[0.90625rem] leading-relaxed text-muted">{r.line}</p>
                  </div>
                  <p className={cn(fontHand, "hidden text-right text-[1.3125rem] lg:block")}>{notebook.roleNotes[r.start]}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Stack */}
          <section id="stack" aria-labelledby="stack-title" className="flex scroll-mt-24 flex-col gap-6 px-6 pt-6 pb-12 md:px-8">
            <NoteHeading id="stack-title" note={notebook.notes.stack} title="stack" />
            <dl className="flex flex-col gap-4">
              {stackRows.map((g) => (
                <div key={g.name} className="grid items-center gap-x-5 gap-y-2 md:grid-cols-[150px_minmax(0,1fr)]">
                  <dt className={cn(fontHand, "text-2xl")}>{g.name}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {g.items.map((k, i) => (
                        <li key={k} className={cn("border px-3 py-1.5 text-[0.84375rem] font-bold", g.tag, tilts[i % tilts.length])}>
                          {k}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Recognition: taped notes */}
          <section id="recognition" aria-labelledby="rec-title" className="flex scroll-mt-24 flex-col gap-7 px-6 pt-6 pb-14 md:px-8">
            <NoteHeading
              id="rec-title"
              title="recognition"
              aside={<span className="bg-ink px-2.5 py-1 font-mono text-[0.6875rem] font-medium text-bg">{recognition.leetcode.toUpperCase()}</span>}
            />
            <div className="grid items-start gap-7 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative -rotate-[1.5deg] bg-card p-6 shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
                <Tape className="-top-[11px] left-1/2 -ml-[35px] w-[70px]" />
                <h3 className={cn(fontHand, "mb-2.5 text-2xl")}>in print</h3>
                <p className="text-[0.90625rem] leading-relaxed">
                  <strong>{recognition.publication.title}</strong>, {recognition.publication.text} <em>{recognition.publication.book}</em>,{" "}
                  {recognition.publication.publisher}.
                </p>
              </div>
              <div className="relative rotate-[1.2deg] bg-red p-6 text-on-red shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
                <Tape tone="light" className="-top-[11px] left-1/2 -ml-[35px] w-[70px]" />
                <h3 className={cn(fontHand, "mb-2.5 text-2xl")}>awards</h3>
                <ul className="flex list-disc flex-col gap-1 pl-[18px] text-[0.90625rem] leading-relaxed">
                  {recognition.awards.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div className="relative -rotate-[0.8deg] bg-card p-6 shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
                <Tape tone="ink" className="-top-[11px] left-1/2 -ml-[35px] w-[70px]" />
                <h3 className={cn(fontHand, "mb-2.5 text-2xl")}>certificates</h3>
                <ul className="flex list-disc flex-col gap-1.5 pl-[18px] text-[0.875rem] leading-snug">
                  {recognition.certificates.map((c) => (
                    <li key={c.name}>
                      {"href" in c ? (
                        <a href={c.href} target="_blank" rel="noopener" className="underline underline-offset-4">
                          {c.name}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        c.name
                      )}{" "}
                      <span className="text-muted">— {c.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 px-6 pt-6 pb-16 md:px-8">
            <div className="flex flex-col items-start gap-10 bg-ink px-8 py-10 text-bg md:flex-row md:items-center md:px-12">
              <figure className="relative shrink-0 -rotate-3 bg-white p-2.5 pb-7">
                <Tape className="-top-2.5 left-10 -rotate-6 bg-red/50" />
                <div className="relative h-[200px] w-[170px] overflow-hidden bg-[#e2e2dd]">
                  <Image src={avatarWave.src} alt="" width={avatarWave.width} height={avatarWave.height} sizes="180px" className="absolute top-1 left-0 w-[170px] max-w-none" />
                </div>
                <figcaption className={cn(fontHand, "mt-1.5 text-center text-lg text-[#111111]")}>{notebook.captions.contact}</figcaption>
              </figure>
              <div className="flex flex-col gap-[18px]">
                <p className="font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-red">
                  <span aria-hidden="true">♥ </span>CONTACT
                </p>
                <h2 id="contact-title" className="text-[clamp(40px,4.4vw,56px)] leading-[0.95] font-extrabold tracking-[-0.045em]">
                  {contact.titleLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <a href={`mailto:${person.email}`} className={cn(mono, "self-start bg-red px-[22px] py-3.5 text-[0.8125rem] text-on-red no-underline hover:opacity-90")}>
                  {person.email} <span aria-hidden="true">→</span>
                </a>
                <ul aria-label="Elsewhere" className="flex flex-wrap gap-2">
                  {[
                    { label: "LinkedIn", href: links.linkedin, mark: "↗" },
                    { label: "GitHub", href: links.github, mark: "↗" },
                    { label: "LeetCode", href: links.leetcode, mark: "↗" },
                    { label: "Résumé", href: links.resume, mark: "↓" },
                  ].map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target={l.mark === "↗" ? "_blank" : undefined} rel={l.mark === "↗" ? "noopener" : undefined} className={cn(mono, "block border-[1.5px] border-bg px-3.5 py-2.5 no-underline hover:bg-bg hover:text-ink")}>
                        {l.label.toUpperCase()} <span aria-hidden="true">{l.mark}</span>
                        {l.mark === "↗" && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className={cn(fontHand, "text-[1.375rem] opacity-85")}>{contact.location}</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <SiteFooter variant="notebook" sections={recruiterSections} sideLink={{ label: "Back to the story", href: "/" }} />
    </div>
  );
}
