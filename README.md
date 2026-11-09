# The Road to 30

A corporate-style interactive birthday surprise: twelve left/right sections in a simple black and white palette, with a swipe card, a letter, a countdown, six easter eggs and an ice cream case that stays open.

Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion and Lucide icons. No backend. Design rules from the ui-ux-pro-max skill (accessibility, 44px touch targets, visible focus, reduced motion). Montserrat throughout, solid colours only (no gradients), and every corner radius is 7px.

## Install and run

Needs Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173. To try it on a phone on the same Wi-Fi: `npm run dev -- --host`.

## Build for production

```bash
npm run build     # type-checks, then outputs the site to dist/
npm run preview   # test the production build locally
```

## Replace the photos

1. Save your pictures into `public/images/` (only ones you have permission to use).
2. Use the file names listed in `public/images/README.txt`, or change the paths in `src/data/photos.ts`.

| File | Used in |
| --- | --- |
| `hero-cake.jpg` | Opening reveal (a birthday cake). His own photo is kept as `salman.webp`; set `photos.hero` to `'/images/salman.webp'` to use it |
| `bumble-logo-color.svg` | Swipe card (the Bumble logo in its own yellow and grey; `bumble-logo.svg` is the black and white version) |
| `firefox-technologies.png`, `firefox-publishers.png` | The two company logos |
| `business.jpg` | (no longer used: the report card now plays `clips.officeApplause`) |
| `funny.jpg` | Chotu DON |
| `compliance.jpg` | Compliance notice |
| `cat-1.jpg`, `cat-2.jpg` | Cat gallery. Add more paths to the `cats` array |
| `founder.jpg` | (no longer used: that section now shows the typing-chat animation) |
| `skeleton-cigarette-cake.webp` | Countdown (the cake photo you supplied) |

All pictures are CC0 / public domain stock photos you can swap for your own (sources in `public/images/CREDITS.txt`). A missing photo shows a "Photo coming soon" placeholder, never a broken image.


## Funny clips, cats and 21st.dev components

- **Clips** (`public/videos/`, listed in `src/data/photos.ts` as `clips`): short looping videos that act like GIFs (muted, play only while on screen, pause button, paused for reduced motion). Mixkit free licence, see `public/videos/CREDITS.txt`.
- **Cats:** the leadership section uses the 21st.dev Team Showcase (`src/components/ui/team-showcase.tsx`): six arch-topped cards, one per fluffy Persian cat (photos in `public/images/cats/`, CC0), each with a funny role and a speech bubble on hover or tap. Names, roles and quotes are in `content.ts` under `cats.team`. On phones the row swipes sideways.
- **From 21st.dev (adapted to this theme):** animated countdown (countdown), milestone timeline (the promise). Files are in `src/components/ui/`.
- **Hero:** a full-screen looping video (`clips.birthdayParty` in `src/data/photos.ts`) with the 21st.dev hero-designali layout: bordered title with plus corners, a typed agenda (edit `hero.agenda` in `content.ts`), a pointer light-trail on desktop, and the flip counter (`src/components/ui/flip-countdown.tsx`). There are no buttons: scrolling opens the site. Components: `src/components/ui/hero-designali.tsx`.
- **Page length:** short lines of copy are grouped into paragraphs automatically (`Lines` in `src/components/Reveal.tsx`, set `group={false}` for one line per paragraph). Section spacing lives in `Section` / `Split` there too. The cats recommendation uses the 21st.dev Expandable Text (`src/components/ui/expandable-text.tsx`).
- **Ticker bands** between sections use the Marquee component; edit the headlines in `content.ts` under `ticker`.

## The opening memo

Right under the hero, the memo uses the 21st.dev About Us layout (`src/components/ui/about-us-section.tsx`): three columns with a funny looping clip in the middle (a CEO asleep at his desk), and a closing banner. The words are in `src/data/content.ts` under `hero.memoUi`. The clip is `clips.asleepAtDesk` in `src/data/photos.ts`.

## Colours, font and corners

- Section colours are themes in `src/styles/index.css` (`theme-dark` black, `theme-light` white, `theme-beige` light grey, `theme-maroon` and `theme-indigo` dark grey; the names are left over from earlier palettes). Each section picks one with its `theme` prop. The brand hex values (`ink`, `maroon`, `beige`) are in `tailwind.config.js`.
- The 7px corner radius is set once in `tailwind.config.js` (`borderRadius`).
- The font is Montserrat, loaded in `index.html`.

## Customise the text

Everything written on the site is in `src/data/content.ts`. Each string in an array is one paragraph. The birthday date (`birthday`) also lives there, so the countdown follows it.

## Deploy

**Netlify (drag and drop):** run `npm run build`, then drag the `dist` folder onto https://app.netlify.com/drop.

**Netlify / Vercel from a repo:** build command `npm run build`, output directory `dist`. No extra configuration is needed.

## Interactions

- The hero is the opening screen; scroll down to open the file.
- Bumble card: drag right, or use the buttons. A left swipe bounces back with a joke.
- Timeline, company cards (hover or tap), the envelope letter, drama meter, appreciation badge, Chotu DON hotline, Cat CEO Approval Meter, compliance checklist and score, live countdown, final envelope, ORDER ICE CREAM and CASE CLOSED?.
- The countdown shows "THE BIG DAY HAS ARRIVED." once February 3, 2027 passes and never breaks.
- Six easter eggs: a hidden dot at the end of the timeline, a faint paw in the cats section, a tiny hidden button in the footer, a "CEO has been detected smiling" notification after the swipe, a "please restart human" notification in the compliance section, and DO NOT PRESS. The footer counts secrets found.
- Sound is off until the visitor presses the toggle in the top bar. It is synthesised in the browser, so there are no audio files.
- Progress (intro seen, swipe, checklist, secrets) is saved in localStorage. "Reset my progress" in the footer clears it.
- `prefers-reduced-motion` is respected.

## Structure

```text
src/
  App.tsx, main.tsx
  data/content.ts       all text
  data/photos.ts        all photo paths
  sections/             Hero, Bumble, Promise, Note, Overthinking, Appreciation,
                        Don, Cats, Compliance, Unsaid, Countdown, Final
  components/           Photo (safe placeholder), Reveal (Section, Split), Button,
                        FxCanvas, Header, Notifier, Art, Footer
  lib/                  store (localStorage), notifications, fx, audio
  styles/index.css
public/images/          your photos go here
```
