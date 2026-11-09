import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { content } from '../data/content';
import { setSound } from '../lib/audio';
import { scrollToId } from '../lib/fx';

/** Fixed corporate top bar: brand, section counter, jump menu, sound toggle, scroll progress. */
export default function Header({ showNav }: { showNav: boolean }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const [active, setActive] = useState(0);
  const [sound, setSoundOn] = useState(false);

  useEffect(() => {
    if (!showNav) return;
    const els = content.sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(content.sections.findIndex((s) => s.id === e.target.id));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [showNav]);

  const current = content.sections[Math.max(active, 0)];

  return (
    <header className="fixed inset-x-0 top-0 z-[65] h-14 border-b border-white/15 bg-ink text-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <button type="button" onClick={() => window.scrollTo({ top: 0 })} className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em]">
          The Road to <span className="text-beige">30</span>
        </button>

        {showNav && (
          <div className="hidden items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/70 md:flex">
            <span className="text-beige">{String(active + 1).padStart(2, '0')}</span>
            <label className="sr-only" htmlFor="jump">
              Jump to section
            </label>
            <select
              id="jump"
              value={current.id}
              onChange={(e) => scrollToId(e.target.value)}
              className="max-w-[16rem] cursor-pointer rounded border border-white/25 bg-ink px-2 py-1.5 text-[0.68rem] uppercase tracking-[0.15em] text-white"
            >
              {content.sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          aria-pressed={sound}
          aria-label={sound ? 'Mute sound' : 'Turn on sound'}
          onClick={() => {
            const next = !sound;
            setSoundOn(next);
            setSound(next);
          }}
          className="flex h-10 items-center gap-2 rounded border border-white/25 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-beige"
        >
          {sound ? <Volume2 size={16} className="text-beige" /> : <VolumeX size={16} className="text-white/60" />}
          <span className="hidden sm:inline">{sound ? 'Sound on' : 'Sound off'}</span>
        </button>
      </div>
      <motion.div aria-hidden className="absolute inset-x-0 bottom-[-1px] h-[3px] origin-left bg-beige" style={{ scaleX }} />
    </header>
  );
}
