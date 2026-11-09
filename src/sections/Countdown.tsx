import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading, Split } from '../components/Reveal';
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
      <div className="card relative grid h-24 w-full place-items-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={text} initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="text-5xl font-extrabold tabular-nums sm:text-6xl">
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-accent">{label}</span>
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

  const text = (
    <>
      <SectionHeading kicker={c.kicker} title={c.title} date={c.date} />
      <Lines lines={c.intro} />
      <ul className="my-6 flex flex-col gap-3">
        {c.hopes.map((h, i) => (
          <motion.li key={h} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex gap-3 text-fg/90">
            <span aria-hidden className="mt-2.5 h-0.5 w-5 shrink-0 bg-accent" />
            {h}
          </motion.li>
        ))}
      </ul>
      <Lines lines={c.outro} lineClass="text-xl font-bold" gap="gap-1" />
    </>
  );

  const visual = (
    <div ref={ref} className="flex flex-col gap-8">
      <Reveal>
        {left ? (
          <div className="grid grid-cols-2 gap-4" role="timer" aria-label="Time until February 3, 2027">
            <Unit value={left.days} label="Days" />
            <Unit value={left.hours} label="Hours" />
            <Unit value={left.minutes} label="Minutes" />
            <Unit value={left.seconds} label="Seconds" />
          </div>
        ) : (
          <p className="text-center text-4xl font-extrabold uppercase">{c.arrived}</p>
        )}
      </Reveal>
      <Reveal>
        <Photo src={photos.birthday} alt="The Founder, nearly thirty" hint="public/images/birthday.jpg" parallax className="aspect-[16/10] w-full" />
      </Reveal>
      {/* easter egg 6 */}
      <div>
        <button type="button" onClick={() => foundEgg('donotpress', 'secret', c.egg6.title, c.egg6.body)} className="min-h-11 rounded border-2 border-accent px-5 text-[0.68rem] font-extrabold uppercase tracking-[0.28em] text-accent transition hover:bg-accent hover:text-onaccent">
          {c.doNotPress}
        </button>
      </div>
    </div>
  );

  return (
    <Section id="countdown" index={11} theme="maroon">
      <Split text={text} visual={visual} />
    </Section>
  );
}
