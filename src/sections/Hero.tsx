import { Plus } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { content } from '../data/content';
import { clips, photos } from '../data/photos';
import DateFlipCountdown from '@/components/ui/flip-countdown';
import AboutUsSection from '@/components/ui/about-us-section';
import { TrailCanvas, TypeWriter } from '@/components/ui/hero-designali';

const h = content.hero;
const bd = content.birthday;
const TARGET = new Date(bd.year, bd.monthIndex, bd.day, 0, 0, 0);

/**
 * Section 01 (hero-designali layout): looping video background, bordered title with plus corners,
 * live status line, typed agenda and the flip counter. No buttons: scrolling opens the site.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const words = h.title.split(' ');
  const last = words.pop();

  return (
    <div id="announcement" data-section>
      <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink px-5 pb-24 pt-24 text-center text-white sm:px-8">
        {/* video background (poster only for reduced motion) */}
        <video
          src={clips.birthdayParty}
          poster={photos.hero}
          autoPlay={!reduce}
          loop
          muted
          playsInline
          preload={reduce ? 'none' : 'auto'}
          aria-hidden
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        {/* flat dark overlay so the text stays readable */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink/70" />
        <TrailCanvas className="absolute inset-0 z-0 h-full w-full" />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
          <div className="mb-8 inline-flex items-center rounded border border-white/30 bg-ink/60 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-beige">{h.eyebrow}</div>

          <div className="relative w-full border border-white/40 bg-ink/45 px-5 py-10 backdrop-blur-sm sm:px-10 sm:py-12">
            <Plus strokeWidth={4} aria-hidden className="absolute -left-5 -top-5 h-10 w-10 text-beige" />
            <Plus strokeWidth={4} aria-hidden className="absolute -bottom-5 -left-5 h-10 w-10 text-beige" />
            <Plus strokeWidth={4} aria-hidden className="absolute -right-5 -top-5 h-10 w-10 text-beige" />
            <Plus strokeWidth={4} aria-hidden className="absolute -bottom-5 -right-5 h-10 w-10 text-beige" />
            <h1 className="text-5xl font-extrabold uppercase leading-[0.98] tracking-tight sm:text-7xl md:text-8xl">
              {words.join(' ')} <span className="text-beige">{last}</span>
            </h1>
            <div className="mt-5 flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3 items-center justify-center" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded bg-beige opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded bg-beige" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-beige">{h.status}</p>
            </div>
          </div>

          <h2 className="mt-8 text-xl font-semibold sm:text-2xl">{h.subtitle}</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
            {h.agendaLead}
            <span className="font-bold text-beige">
              <TypeWriter strings={h.agenda} />
            </span>
            .
          </p>

          <div className="mt-8">
            <DateFlipCountdown targetDate={TARGET} cardBgColor="#1C1C1C" textColor="#FFFFFF" />
          </div>
        </div>

        {/* scroll hint (not a button) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-white/70">
          <span>{h.scrollHint}</span>
          <svg width="14" height="18" viewBox="0 0 14 18" className="animate-bounce">
            <path d="M7 1 L7 17 M2 12 L7 17 L12 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      <section id="memo" className="themed theme-beige relative scroll-mt-14 overflow-hidden px-5 py-14 sm:px-8 md:py-20">
        <AboutUsSection ui={h.memoUi} />
      </section>
    </div>
  );
}
