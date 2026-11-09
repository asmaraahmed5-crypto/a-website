import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { content } from '../data/content';
import { Lines, Reveal, Section, SectionHeading, Split } from '../components/Reveal';
import AnimatedCountdown from '@/components/ui/animated-countdown';
import { burst } from '../lib/fx';
import { foundEgg } from '../lib/store';

const c = content.countdown;
const { year, monthIndex, day } = content.birthday;
const TARGET = new Date(year, monthIndex, day, 0, 0, 0);

export default function Countdown() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -25% 0px' });

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
        <AnimatedCountdown targetDate={TARGET} completionMessage={c.arrived} onComplete={() => burst(undefined, undefined, 160)} ariaLabel="Time until February 3, 2027" />
      </Reveal>
      <Reveal>
        <figure className="mx-auto w-full max-w-sm overflow-hidden rounded border border-fg/20 bg-ink">
          <img src="/images/skeleton-cigarette-cake.webp" alt={c.cakeAlt} width={736} height={736} loading="lazy" className="block h-auto w-full" />
          <figcaption className="bg-ink px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-beige">{c.clipCaption}</figcaption>
        </figure>
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
