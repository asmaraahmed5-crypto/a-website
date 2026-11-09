import { useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading, Split } from '../components/Reveal';
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
        className="group card block w-full overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1 hover:border-accent"
      >
        <Photo src={src} alt={name} hint={hint} kind="logo" parallax className="aspect-[16/9] w-full !rounded-none" />
        <div className="p-5">
          <p className="kicker">{tag}</p>
          <h3 className="mt-1 text-xl font-extrabold uppercase tracking-tight">{name}</h3>
          <motion.p
            initial={false}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden text-sm leading-relaxed text-fg/85 group-hover:!h-auto group-hover:!opacity-100"
          >
            <span className="block pt-3">{text}</span>
          </motion.p>
          <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-mute group-hover:hidden">{p.cardHint}</p>
        </div>
      </button>
    </Reveal>
  );
}

export default function PromiseSection() {
  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 80%', 'end 60%'] });
  const grow = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  const text = (
    <>
      <SectionHeading kicker={p.kicker} title={p.title} date={p.date} />
      <Lines lines={p.intro} lineClass="text-xl font-semibold leading-snug text-fg" gap="gap-3" />
      <div className="relative mt-12">
        <ol ref={timelineRef} className="relative flex flex-col gap-9 pl-9">
          <span aria-hidden className="absolute left-[7px] top-1 h-[calc(100%-0.5rem)] w-0.5 bg-fg/20" />
          <motion.span aria-hidden className="absolute left-[7px] top-1 h-[calc(100%-0.5rem)] w-0.5 origin-top bg-accent" style={{ scaleY: grow }} />
          {p.timeline.map((t) => (
            <li key={t.label} className="relative">
              <motion.span
                aria-hidden
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                className="absolute -left-9 top-1 h-4 w-4 rounded border-2 border-accent bg-bg"
              />
              <Reveal y={12}>
                <p className="text-base font-bold">{t.label}</p>
                <p className="mt-0.5 text-sm text-mute">{t.note}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        {/* easter egg 1: hidden at the end of the timeline */}
        <button type="button" aria-label="Hidden detail" onClick={() => foundEgg('timeline', 'secret', p.egg1.title, p.egg1.body)} className="absolute -bottom-8 left-0 grid h-11 w-11 place-items-center">
          <span className="block h-1.5 w-1.5 rounded bg-fg/30 transition hover:scale-150 hover:bg-accent" />
        </button>
      </div>
    </>
  );

  const visual = (
    <div className="flex flex-col gap-6">
      <CompanyCard {...p.companies[0]} src={photos.firefoxTechnologies} hint="public/images/firefox-technologies.jpg" />
      <CompanyCard {...p.companies[1]} src={photos.firefoxPublishers} hint="public/images/firefox-publishers.jpg" />
      <Lines lines={p.after} className="mt-10" lineClass="body-copy" />
    </div>
  );

  return (
    <Section id="promise" index={3} theme="beige">
      <Split text={text} visual={visual} sticky={false} />
    </Section>
  );
}
