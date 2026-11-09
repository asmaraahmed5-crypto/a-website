import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal } from '../components/Reveal';
import GoldButton from '../components/GoldButton';
import Photo from '../components/Photo';
import { burst, scrollToId } from '../lib/fx';
import { sfx } from '../lib/audio';
import { setSaved, useSaved } from '../lib/store';

const h = content.hero;

/** Section 01: loading animation, title sequence, then the opening memo once the visitor begins. */
export default function Hero() {
  const { begun } = useSaved();
  const [progress, setProgress] = useState(begun ? 100 : 0);
  const ready = progress >= 100;

  useEffect(() => {
    if (begun) return;
    const start = performance.now();
    const total = 2600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / total) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [begun]);

  const begin = () => {
    sfx.open();
    burst(undefined, window.innerHeight * 0.7, 90);
    setSaved({ begun: true });
    window.setTimeout(() => scrollToId('memo'), 350);
  };

  return (
    <section id="announcement" data-section className="relative">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(198,165,107,0.12),transparent_60%)]" />

        <AnimatePresence mode="wait">
          {!ready ? (
            <motion.div key="loader" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="relative z-10 flex w-full max-w-md flex-col items-center gap-6" role="status">
              <p className="font-display text-lg italic text-champagne/80 sm:text-xl">{h.loading}</p>
              <div className="h-px w-full overflow-hidden bg-gold/20" aria-hidden>
                <div className="h-full bg-gradient-to-r from-gold-deep to-champagne" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[0.65rem] tracking-[0.35em] text-gold">{Math.round(progress)}%</p>
            </motion.div>
          ) : (
          <motion.div key="reveal" className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6">
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.42em' }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="gold-text font-display text-lg font-semibold sm:text-2xl"
            >
              {h.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="gold-text font-serif text-5xl font-bold leading-[1.02] tracking-wide sm:text-7xl md:text-8xl"
            >
              {h.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.6 }}
              className="font-display text-xl italic text-champagne/85 sm:text-2xl"
            >
              {h.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 2.0, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-4 w-full max-w-sm sm:max-w-md"
            >
              <Photo src={photos.hero} alt="The Founder and CEO" hint="public/images/hero.jpg" parallax className="aspect-[4/5] w-full rounded-[28px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_0_80px_rgba(0,0,0,0.65)]" />
            </motion.div>

            {!begun && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.0, duration: 0.9 }}>
                <GoldButton onClick={begin}>{h.cta}</GoldButton>
              </motion.div>
            )}
          </motion.div>
          )}
        </AnimatePresence>
      </div>

      {begun && (
        <div id="memo" className="scroll-mt-4 px-5 pb-28 pt-20 sm:px-8">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <p className="kicker mb-8 text-center">Opening Memo</p>
            </Reveal>
            <Lines lines={h.memo} lineClass="font-display text-[1.45rem] leading-snug text-ivory/90 sm:text-2xl" gap="gap-6" />
          </div>
        </div>
      )}
    </section>
  );
}
