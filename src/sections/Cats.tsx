import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading, Split } from '../components/Reveal';
import Button from '../components/Button';
import Photo from '../components/Photo';
import { CatSilhouette, Paw } from '../components/Art';
import { burstFrom } from '../lib/fx';
import { sfx } from '../lib/audio';
import { foundEgg } from '../lib/store';

const c = content.cats;

/** Paw prints that walk across the gallery as it scrolls into view. */
function PawTrail() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-6 flex justify-between px-2 text-accent">
      {Array.from({ length: 7 }, (_, i) => (
        <motion.span
          key={i}
          style={{ marginTop: i % 2 ? 18 : 0, rotate: '90deg' }}
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: [0, 0.9, 0.25], scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.2 + i * 0.3 }}
        >
          <Paw size={22} />
        </motion.span>
      ))}
    </div>
  );
}

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

  const visual = (
    <div className="flex flex-col gap-8">
      <div className="relative pt-6">
        <PawTrail />
        <div className="grid grid-cols-2 gap-4">
          {photos.cats.map((src, i) => (
            <Reveal key={src} delay={i * 0.1}>
              <motion.div whileHover={{ y: -4 }}>
                <Photo src={src} alt={`Cat ${i + 1}, a senior member of management`} hint={`public/images/cat-${i + 1}.jpg`} kind="cat" parallax className="aspect-square w-full" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal>
        <div className="card relative flex flex-col items-center gap-5 p-7 text-center">
          <CatSilhouette size={56} className="text-accent" />
          <h3 className="kicker">{c.meterTitle}</h3>
          <div className="h-3 w-full overflow-hidden rounded bg-fg/10" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={a?.score ?? 0} aria-label={c.meterTitle}>
            <motion.div animate={{ width: `${a?.score ?? 0}%` }} transition={{ type: 'spring', stiffness: 80, damping: 14 }} className="h-full bg-accent" />
          </div>
          <div className="flex min-h-[8rem] w-full flex-col items-center justify-center" aria-live="polite">
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
    </div>
  );

  const text = (
    <>
      <SectionHeading kicker={c.kicker} title={c.title} />
      <Lines lines={c.intro} />

      <Reveal className="mt-12">
        <div className="card overflow-hidden">
          <div className="border-b border-fg/15 bg-bg px-5 py-4">
            <h3 className="kicker">{c.reportTitle}</h3>
          </div>
          <div className="grid grid-cols-2 border-b border-fg/15 text-[0.68rem] font-bold uppercase tracking-[0.25em] text-accent">
            <span className="px-5 py-3">CEO</span>
            <span className="border-l border-fg/15 px-5 py-3">Cats</span>
          </div>
          {c.report.map((r) => (
            <div key={r.ceo} className="grid grid-cols-2 border-b border-fg/10 last:border-0">
              <p className="p-4 text-sm sm:px-5">{r.ceo}</p>
              <p className="border-l border-fg/10 p-4 text-sm font-semibold sm:px-5">{r.cats}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Lines lines={c.afterReport} className="mt-12" />

      <Reveal className="mt-12">
        <div className="rounded border-l-4 border-accent bg-card p-6 sm:p-8">
          <h3 className="kicker mb-5">{c.recTitle}</h3>
          <div className="flex flex-col gap-3">
            {c.rec.map((l, i) => (
              <p key={i} className={l === 'P.S.' ? 'font-extrabold text-accent' : 'body-copy'}>
                {l}
              </p>
            ))}
          </div>
        </div>
      </Reveal>

      {/* easter egg 2: a hidden paw */}
      <button type="button" aria-label="Hidden paw print" onClick={() => foundEgg('paw', 'secret', c.egg2.title, c.egg2.body)} className="mt-6 grid h-11 w-11 place-items-center text-fg/15 transition hover:scale-125 hover:text-accent">
        <Paw size={22} />
      </button>
    </>
  );

  return (
    <Section id="cats" index={8} theme="light">
      <Split flip sticky={false} text={text} visual={visual} />
    </Section>
  );
}
