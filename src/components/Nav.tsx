import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { content } from '../data/content';
import { scrollToId } from '../lib/fx';

/** Scroll progress bar, a quiet section counter and a dot navigator. */
export default function Nav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = content.sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(content.sections.findIndex((s) => s.id === e.target.id));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = content.sections[Math.max(active, 0)];

  return (
    <>
      <motion.div aria-hidden className="fixed left-0 top-0 z-[65] h-[2px] w-full origin-left bg-gradient-to-r from-gold-deep via-gold to-champagne" style={{ scaleX }} />
      <div className="pointer-events-none fixed left-4 top-4 z-[64] max-w-[55vw] sm:left-6 sm:top-5">
        <p className="truncate text-[0.62rem] uppercase tracking-[0.3em] text-mute">
          <span className="text-gold">{String(active + 1).padStart(2, '0')}</span> · {current.label}
        </p>
      </div>
      <nav aria-label="Sections" className="fixed right-4 top-1/2 z-[64] hidden -translate-y-1/2 flex-col gap-1 md:flex">
        {content.sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to ${s.label}`}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => scrollToId(s.id)}
            className="group grid h-6 w-6 place-items-center"
          >
            <span className={`block rounded-full transition-all duration-300 ${i === active ? 'h-2.5 w-2.5 bg-gold shadow-[0_0_10px_#C6A56B]' : 'h-1.5 w-1.5 bg-dim group-hover:bg-gold-soft'}`} />
          </button>
        ))}
      </nav>
    </>
  );
}
