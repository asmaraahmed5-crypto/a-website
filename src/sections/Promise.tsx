import { useState } from 'react';
import { motion } from 'framer-motion';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading, Split } from '../components/Reveal';
import Photo from '../components/Photo';
import MilestoneTimeline from '@/components/ui/milestone-timeline';
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
        <Photo src={src} alt={`${name} logo`} hint={hint} kind="logo" className="aspect-[16/9] w-full !rounded-none" />
        <div className="p-5">
          <p className="kicker">{tag}</p>
          <h3 className="mt-1 text-xl font-extrabold uppercase tracking-tight">{name}</h3>
          <motion.p initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.35 }} className="overflow-hidden text-sm leading-relaxed text-fg/85 group-hover:!h-auto group-hover:!opacity-100">
            <span className="block pt-3">{text}</span>
          </motion.p>
          <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-mute group-hover:hidden">{p.cardHint}</p>
        </div>
      </button>
    </Reveal>
  );
}

export default function PromiseSection() {
  return (
    <Section id="promise" index={3} theme="beige">
      <Split
        text={
          <>
            <SectionHeading kicker={p.kicker} title={p.title} date={p.date} />
            <Lines lines={p.intro} lineClass="text-xl font-semibold leading-snug text-fg" gap="gap-3" />
          </>
        }
        visual={
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <CompanyCard {...p.companies[0]} src={photos.firefoxTechnologies} hint="public/images/firefox-technologies.png" />
            <CompanyCard {...p.companies[1]} src={photos.firefoxPublishers} hint="public/images/firefox-publishers.png" />
          </div>
        }
        sticky={false}
      />

      <div className="relative my-12">
        <MilestoneTimeline
          items={p.timeline.map((t) => ({ year: t.year, title: t.title, desc: t.note }))}
          hiddenButton={
            /* easter egg 1: hidden at the end of the timeline */
            <button type="button" aria-label="Hidden detail" onClick={() => foundEgg('timeline', 'secret', p.egg1.title, p.egg1.body)} className="absolute -bottom-10 left-[15px] grid h-11 w-11 -translate-x-1/2 place-items-center sm:left-1/2">
              <span className="block h-1.5 w-1.5 rounded bg-fg/30 transition hover:scale-150 hover:bg-accent" />
            </button>
          }
        />
      </div>

      <Lines lines={p.after} className="mx-auto max-w-2xl" lineClass="body-copy text-center sm:text-lg" />
    </Section>
  );
}
