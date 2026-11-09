# The Road to 30

A luxury-noir, cinematic, interactive birthday surprise: twelve sections, a swipe card, a letter, a countdown, six easter eggs and an ice cream case that stays open.

Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion and Lucide icons. No backend. Design system chosen with the ui-ux-pro-max skill (accessibility, 44px touch targets, visible focus, reduced motion), using the requested black and antique-gold palette.

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
| `hero.jpg` | Opening screen |
| `bumble.jpg` | Swipe card |
| `firefox-technologies.jpg`, `firefox-publishers.jpg` | The two company cards (logo or photo) |
| `business.jpg` | CEO Appreciation Report |
| `funny.jpg` | Chotu DON and the compliance notice |
| `cat-1.jpg`, `cat-2.jpg` | Cat gallery. Add more paths to the `cats` array |
| `founder.jpg` | "The Things I Cannot Say Directly" |
| `birthday.jpg` | Countdown |

A missing photo shows an elegant "Photo coming soon" placeholder, never a broken image.

## Customise the text

Everything written on the site is in `src/data/content.ts`. Each string in an array is one paragraph. The birthday date (`birthday`) also lives there, so the countdown follows it.

## Deploy

**Netlify (drag and drop):** run `npm run build`, then drag the `dist` folder onto https://app.netlify.com/drop.

**Netlify / Vercel from a repo:** build command `npm run build`, output directory `dist`. No extra configuration is needed.

## Interactions

- Loading animation, then **Begin the Investigation** reveals the rest and the navigation.
- Bumble card: drag right, or use the buttons. A left swipe bounces back with a joke.
- Timeline, company cards (hover or tap), the envelope letter, drama meter, appreciation badge, Chotu DON hotline, Cat CEO Approval Meter, compliance checklist and score, live countdown, golden envelope, ORDER ICE CREAM and CASE CLOSED?.
- The countdown shows "THE BIG DAY HAS ARRIVED." once February 3, 2027 passes and never breaks.
- Six easter eggs: a hidden dot at the end of the timeline, a faint paw in the cats section, a tiny gold button in the footer, a "CEO has been detected smiling" notification after the swipe, a "please restart human" notification in the compliance section, and DO NOT PRESS. The footer counts secrets found.
- Sound is off until the visitor presses the toggle (top right). It is synthesised in the browser, so there are no audio files.
- Progress (intro seen, swipe, checklist, secrets) is saved in localStorage. "Replay the intro" in the footer clears it.
- `prefers-reduced-motion` is respected. The cursor ring only appears on devices with a mouse.

## Structure

```text
src/
  App.tsx, main.tsx
  data/content.ts       all text
  data/photos.ts        all photo paths
  sections/             Hero, Bumble, Promise, Note, Overthinking, Appreciation,
                        Don, Cats, Compliance, Unsaid, Countdown, Final
  components/           Photo (safe placeholder), Reveal, GoldButton, Nav, FxCanvas,
                        CursorGlow, Notifier, SoundToggle, Art, Footer
  lib/                  store (localStorage), notifications, fx, audio
  styles/index.css
public/images/          your photos go here
```
