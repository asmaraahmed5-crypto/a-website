import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import { content } from '../data/content';
import { clips, photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading, Split, groupLines } from '../components/Reveal';
import Button from '../components/Button';
import LoopClip from '../components/LoopClip';
import { TeamShowcase } from '@/components/ui/team-showcase';
import { CatSilhouette, Paw } from '../components/Art';
import ExpandableText from '@/components/ui/expandable-text';
import { burstFrom } from '../lib/fx';
import { sfx } from '../lib/audio';
import { foundEgg } from '../lib/store';

const c = content.cats;

export default function Cats() {
  const [current, setCurrent] = useState<number | null>(null);
  const [stampKey, setStampKey] = useState(0);
  const stampRef = useRef<HTMLDivElement>(null);
  const a = current !== null ? c.approvals[current] : null;

  const request = () => {
    let next = Math.floor(Math.random() * c.approvals.length);
    if (next === current) next = (next + 1) % c.approvals.length;
    setCurrent(next);
    setStampKey((k) => k + 1);
    sfx.stamp();
    window.setTimeout(() => burstFrom(stampRef.current, 30), 350);
  };

  const members = c.team.map((m, i) => ({ name: m.name, role: m.role, quote: m.quote, alt: m.alt, width: m.width, height: m.height, imageSrc: photos.cats[i % photos.cats.length], themeColor: m.color, textColor: m.text }));

  const recBlock = (
    <Reveal>
      <div className="rounded border-l-4 border-accent bg-card p-6">
        <h3 className="kicker mb-4">{c.recTitle}</h3>
        <ExpandableText lines={4} moreLabel="Read the full recommendation" lessLabel="Show less" className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
          {groupLines(c.rec.slice(0, c.rec.indexOf('P.S.')), 170).map((l, i) => (
            <p key={i} className="body-copy">
              {l}
            </p>
          ))}
          <p className="body-copy">
            <span className="font-extrabold text-accent">P.S. </span>
            {c.rec.slice(c.rec.indexOf('P.S.') + 1).join(' ')}
          </p>
          </div>
        </ExpandableText>
      </div>
    </Reveal>
  );

  const visual = (
    <div className="flex flex-col gap-6">
      <Reveal>
        <LoopClip src={clips.catHat} label={c.clipLabel} caption={c.clipCaption} aspect="aspect-[16/10]" />
      </Reveal>

      <Reveal>
        <div className="card relative flex flex-col items-center gap-4 p-6 text-center">
          <CatSilhouette size={44} className="text-accent" />
          <h3 className="kicker">{c.meterTitle}</h3>
          <div className="h-3 w-full overflow-hidden rounded bg-fg/10" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={a?.score ?? 0} aria-label={c.meterTitle}>
            <motion.div animate={{ width: `${a?.score ?? 0}%` }} transition={{ type: 'spring', stiffness: 80, damping: 14 }} className="h-full bg-accent" />
          </div>
          <div className="flex min-h-[6.5rem] w-full flex-col items-center justify-center" aria-live="polite">
            <AnimatePresence mode="wait">
              {a ? (
                <motion.div key={stampKey} ref={stampRef} initial={{ opacity: 0, scale: 2, rotate: -16 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} transition={{ type: 'spring', stiffness: 220, damping: 15 }} className="flex flex-col items-center gap-3">
                  <span className="stamp flex items-center gap-2 text-sm text-accent">
                    <PawPrint size={18} /> {a.status}
                  </span>
                  <p className="text-base font-semibold">{a.message}</p>
                </motion.div>
              ) : (
                <p className="text-sm text-mute">The cats are awaiting your request.</p>
              )}
            </AnimatePresence>
          </div>
          <Button onClick={request}>{c.meterButton}</Button>
        </div>
      </Reveal>

      {recBlock}
    </div>
  );

  const text = (
    <>
      <Lines lines={c.intro} />

      <Reveal className="my-8">
        <div className="card overflow-hidden">
          <div className="border-b border-fg/15 bg-bg px-5 py-3">
            <h3 className="kicker">{c.reportTitle}</h3>
          </div>
          <div className="grid grid-cols-2 border-b border-fg/15 text-[0.68rem] font-bold uppercase tracking-[0.25em] text-accent">
            <span className="px-5 py-2">CEO</span>
            <span className="border-l border-fg/15 px-5 py-2">Cats</span>
          </div>
          {c.report.map((r) => (
            <div key={r.ceo} className="grid grid-cols-2 border-b border-fg/10 last:border-0">
              <p className="p-3 text-sm sm:px-5">{r.ceo}</p>
              <p className="border-l border-fg/10 p-3 text-sm font-semibold sm:px-5">{r.cats}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Lines lines={c.afterReport} />

      {/* easter egg 2: a hidden paw */}
      <button type="button" aria-label="Hidden paw print" onClick={() => foundEgg('paw', 'secret', c.egg2.title, c.egg2.body)} className="mt-4 grid h-11 w-11 place-items-center text-fg/15 transition hover:scale-125 hover:text-accent">
        <Paw size={22} />
      </button>
    </>
  );

  return (
    <Section id="cats" index={8} theme="light">
      <SectionHeading kicker={c.kicker} title={c.title} />

      <TeamShowcase description={c.galleryDescription} members={members} className="mb-8" />

      <Split flip sticky={false} text={text} visual={visual} />
    </Section>
  );
}
