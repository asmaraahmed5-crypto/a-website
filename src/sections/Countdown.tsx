import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading } from '../components/Reveal';
import Photo from '../components/Photo';
import { burst } from '../lib/fx';
import { foundEgg } from '../lib/store';

const c = content.countdown;
const { year, monthIndex, day } = content.birthday;

function remaining() {
  const target = new Date(year, monthIndex, day, 0, 0, 0).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="card relative grid h-20 w-[4.4rem] place-items-center overflow-hidden sm:h-28 sm:w-28">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: '60%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-60%', opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="gold-text font-serif text-3xl font-semibold tabular-nums sm:text-6xl"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-mute">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const [left, setLeft] = useState(remaining);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -25% 0px' });

  useEffect(() => {
    const id = window.setInterval(() => setLeft(remaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (seen) burst(undefined, window.innerHeight * 0.4, 70);
  }, [seen]);

  return (
    <Section id="countdown" index={11}>
      <div ref={ref}>
        <SectionHeading kicker={c.kicker} title={c.title} date={c.date} />

        <Reveal>
          {left ? (
            <div className="flex justify-center gap-2.5 sm:gap-5" role="timer" aria-label="Time until February 3, 2027">
              <Unit value={left.days} label="Days" />
              <Unit value={left.hours} label="Hours" />
              <Unit value={left.minutes} label="Minutes" />
              <Unit value={left.seconds} label="Seconds" />
            </div>
          ) : (
            <p className="gold-text text-center font-serif text-4xl font-bold sm:text-6xl">{c.arrived}</p>
          )}
        </Reveal>

        <div className="mt-20 grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <Photo src={photos.birthday} alt="The Founder, nearly thirty" hint="public/images/birthday.jpg" parallax className="mx-auto aspect-[4/5] w-full max-w-sm rounded-[2rem]" />
          </Reveal>
          <div>
            <Lines lines={c.intro} lineClass="body-copy sm:text-lg" gap="gap-4" />
            <ul className="my-6 flex flex-col gap-3">
              {c.hopes.map((h, i) => (
                <motion.li key={h} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex gap-3 text-ivory/85">
                  <span aria-hidden className="mt-2.5 h-px w-5 shrink-0 bg-gold" />
                  {h}
                </motion.li>
              ))}
            </ul>
            <Lines lines={c.outro} lineClass="font-display text-2xl text-champagne" gap="gap-2" />
          </div>
        </div>

        {/* easter egg 6 */}
        <div className="mt-24 flex justify-center">
          <button
            type="button"
            onClick={() => foundEgg('donotpress', 'secret', c.egg6.title, c.egg6.body)}
            className="min-h-11 rounded border border-alert/50 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-alert/80 transition hover:bg-alert/10 hover:text-alert"
          >
            {c.doNotPress}
          </button>
        </div>
      </div>
    </Section>
  );
}
