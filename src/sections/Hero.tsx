import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, SectionHeading, Split } from '../components/Reveal';
import Button from '../components/Button';
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
    burst(undefined, window.innerHeight * 0.6, 90);
    setSaved({ begun: true });
    window.setTimeout(() => scrollToId('memo'), 350);
  };

  return (
    <div id="announcement" data-section>
      <section className="themed theme-dark flex min-h-[100svh] items-center px-5 pb-16 pt-28 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <AnimatePresence mode="wait">
            {!ready ? (
              <motion.div key="loader" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="mx-auto flex max-w-md flex-col gap-5" role="status">
                <p className="text-base font-medium text-white/85 sm:text-lg">{h.loading}</p>
                <div className="h-1 w-full overflow-hidden rounded bg-white/15" aria-hidden>
                  <div className="h-full bg-beige" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs font-semibold tracking-[0.3em] text-beige">{Math.round(progress)}%</p>
              </motion.div>
            ) : (
              <motion.div key="reveal" className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
                <div className="flex flex-col gap-6">
                  <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="kicker !text-base">
                    {h.eyebrow}
                  </motion.p>
                  <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-5xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                    {h.title}
                  </motion.h1>
                  <motion.span aria-hidden initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 1.1 }} className="block h-1 w-24 origin-left bg-maroon" />
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.3 }} className="text-lg font-medium text-white/85 sm:text-xl">
                    {h.subtitle}
                  </motion.p>
                  {!begun && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: 0.7 }}>
                      <Button onClick={begin}>{h.cta}</Button>
                    </motion.div>
                  )}
                </div>
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <Photo src={photos.hero} alt="The Founder and CEO" hint="public/images/hero.jpg" parallax className="aspect-[4/5] w-full" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {begun && (
        <section id="memo" className="themed theme-beige scroll-mt-14 px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <Split
              sticky
              text={<SectionHeading kicker="Opening memo" title="From the creative department" />}
              visual={<Lines lines={h.memo} lineClass="text-lg font-medium leading-relaxed text-fg sm:text-xl" gap="gap-5" />}
            />
          </div>
        </section>
      )}
    </div>
  );
}
