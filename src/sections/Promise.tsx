import { useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading } from '../components/Reveal';
import Photo from '../components/Photo';
import { foundEgg } from '../lib/store';
import { sfx } from '../lib/audio';

const p = content.promise;

function CompanyCard({ name, tag, text, src, hint }: { name: string; tag: string; text: string; src: string; hint: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          sfx.click();
          setOpen((o) => !o);
        }}
        className="group card relative block w-full overflow-hidden text-left transition-transform duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_25px_70px_rgba(198,165,107,0.15)]"
      >
        <Photo src={src} alt={name} hint={hint} kind="logo" parallax className="aspect-[4/3] w-full" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="kicker">{tag}</p>
          <h3 className="mt-1 font-serif text-2xl font-semibold text-ivory sm:text-3xl">{name}</h3>
          <motion.p
            initial={false}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden text-sm leading-relaxed text-champagne/90 group-hover:!h-auto group-hover:!opacity-100"
          >
            <span className="block pt-2">{text}</span>
          </motion.p>
          <p className="mt-3 text-[0.62rem] uppercase tracking-[0.25em] text-mute group-hover:opacity-0">{content.promise.cardHint}</p>
        </div>
      </button>
    </Reveal>
  );
}

export default function PromiseSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 80%', 'end 60%'] });
  const grow = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <Section id="promise" index={3}>
      <SectionHeading kicker={p.kicker} title={p.title} date={p.date} />
      <Lines lines={p.intro} className="mx-auto mb-20 max-w-xl text-center" lineClass="font-display text-2xl leading-snug text-ivory/90" />

      <div ref={timelineRef} className="relative mx-auto mb-24 max-w-3xl">
        <div aria-hidden className="absolute left-4 top-0 h-full w-px bg-gold/15 md:left-1/2" />
        <motion.div aria-hidden className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-gold to-champagne md:left-1/2" style={{ scaleY: grow }} />
        <ol className="flex flex-col gap-12">
          {p.timeline.map((t, i) => {
            const right = i % 2 === 0;
            return (
              <li key={t.label} className="relative pl-12 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                <motion.span
                  aria-hidden
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="absolute left-4 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-gold bg-midnight shadow-[0_0_14px_rgba(198,165,107,0.6)] md:left-1/2"
                />
                <Reveal className={right ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}>
                  <p className="font-serif text-xl text-champagne">{t.label}</p>
                  <p className="mt-1 text-sm text-mute">{t.note}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
        {/* easter egg 1: hidden at the end of the timeline */}
        <button
          type="button"
          aria-label="Hidden detail"
          onClick={() => foundEgg('timeline', 'secret', p.egg1.title, p.egg1.body)}
          className="absolute -bottom-9 left-4 grid h-11 w-11 -translate-x-1/2 place-items-center md:left-1/2"
        >
          <span className="block h-1.5 w-1.5 rounded-full bg-gold/30 transition hover:scale-150 hover:bg-gold" />
        </button>
      </div>

      <div className="mb-24 grid gap-6 md:grid-cols-2">
        <CompanyCard {...p.companies[0]} src={photos.firefoxTechnologies} hint="public/images/firefox-technologies.jpg" />
        <CompanyCard {...p.companies[1]} src={photos.firefoxPublishers} hint="public/images/firefox-publishers.jpg" />
      </div>

      <Lines lines={p.after} className="mx-auto max-w-2xl" lineClass="body-copy text-center sm:text-lg" />
    </Section>
  );
}
