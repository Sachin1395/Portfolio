# Sachin A — portfolio

Live: https://portfolio-sachin-red.vercel.app

Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS v4 + GSAP + Lenis.

- `/` — the story: an illustrated avatar, and a scroll-driven camera tour from the
  hero to About (head), Work (phone), Stack (shoulders) and Experience (sneakers),
  then a statement band, Contact and the footer. Phones get the same sections as
  cards, each opening with a close-up of its detail.
- `/recruiter` — the Recruiter view: every project, role, skill and award on one
  notebook-style page.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

`npm run assets` re-exports the avatar images from the 4096 px source renders in
`../assets`, which are not part of this repo. The exported web images in
`public/images/avatar/` are committed, so building never needs the sources.

## Deploy

Vercel, with the Next.js preset (`vercel.json`) on Node 20.9 or newer. No
environment variables are needed. `site.url` in `src/content/site.ts` sets the
canonical address used by the share card, sitemap and robots file; change it if
the domain changes.

## Where things live

```
src/
  app/                  pages, layout + metadata, globals.css (tokens, ambient motion),
                        share image, favicon, robots, sitemap
  content/              ALL copy, links and image data; edit text here, not in components
    generated/          written by `npm run assets` (don't edit by hand)
  components/
    loader/             the 000 → 200 intro
    nav/                SiteNav, ThemeToggle, MobileMenu, HideOnFooter
    hero/               Hero, backdrop, Avatar (with blink), HD layer
    story/              StoryStage, StoryController, camera maths, StoryPanel, CloseUp
    about/ work/ stack/ experience/ contact/ footer/
    recruiter/          the notebook page's pieces
  lib/                  small pure helpers
scripts/
  prepare-assets.mjs    turns the source renders into web images
public/
  images/avatar/        web-ready avatar, blink patch, HD copies, phone close-ups
  resume.pdf            the résumé every Résumé button opens
```

## Conventions

- **Colours** only through tokens: `bg-bg`, `text-ink`, `text-muted`, `bg-card`,
  `border-border`, `text-line`, `bg-red`, `text-on-red`, `text-link`. Dark mode
  swaps the CSS variables, so components never need `dark:` colour classes.
- **Copy** only in `src/content/`.
- **Motion**: GSAP for choreography, CSS keyframes for ambient loops. Every
  animation stops under `prefers-reduced-motion`, and slow devices get a lighter
  mode (`lib/device.ts`).
- **Intro hand-off**: any element can join the loader's hand-off by adding
  `data-intro="number" | "avatar" | "chrome"`.

## The camera story

`components/story/` turns the hero into a scroll-driven camera tour (768 px and
up, motion allowed):

- `StoryStage` holds the hero and one panel per stop.
- `StoryController` pins the stage and scrubs one GSAP timeline as a single
  camera move: zoom in from the hero → card → pan to the next detail → … → back
  to the hero → the statement band. Timing lives in `STORY_TIMING` and
  `DOOR_TIMING` (`content/story.ts`). It also keeps the nav and the URL hash in
  sync with the current section.
- Stops stay in body order (head → phone → shoulders → sneakers), so every pan
  travels downward.
- `camera.ts` does the zoom maths. Layers marked `data-camera` move together;
  `data-camera-fade` fades out while zoomed in.
- On phones, with reduced motion, or before JS runs there is no pin: the panels
  are ordinary sections below the hero. The `story:` Tailwind variant styles the
  motion layout only.
