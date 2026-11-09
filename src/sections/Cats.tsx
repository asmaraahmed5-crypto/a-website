import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading } from '../components/Reveal';
import GoldButton from '../components/GoldButton';
import Photo from '../components/Photo';
import { CatSilhouette, Paw } from '../components/Art';
import { burstFrom } from '../lib/fx';
import { sfx } from '../lib/audio';
import { foundEgg } from '../lib/store';

const c = content.cats;

/** Paw prints that walk diagonally across the section as it scrolls into view. */
function PawTrail() {
  const steps = Array.from({ length: 9 }, (_, i) => i);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-24 h-[420px] overflow-hidden text-gold">
      {steps.map((i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ left: `${6 + i * 10.5}%`, top: `${20 + (i % 2 ? 32 : 0) + Math.sin(i) * 12}%`, rotate: `${72 + (i % 2 ? 14 : -14)}deg` }}
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: [0, 0.55, 0.12], scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, delay: 0.3 + i * 0.35 }}
        >
          <Paw size={30} />
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

  return (
    <Section id="cats" index={8}>
      <PawTrail />
      <SectionHeading kicker={c.kicker} title={c.title} />

      <div className="mx-auto mb-16 grid max-w-3xl grid-cols-2 gap-4">
        {photos.cats.map((src, i) => (
          <Reveal key={src} delay={i * 0.1}>
            <motion.div whileHover={{ rotate: i % 2 ? 1.5 : -1.5, scale: 1.02 }} transition={{ type: 'spring', stiffness: 200 }}>
              <Photo src={src} alt={`Cat ${i + 1}, a senior member of management`} hint={`public/images/cat-${i + 1}.jpg`} kind="cat" parallax className="aspect-square w-full rounded-2xl" />
            </motion.div>
          </Reveal>
        ))}
      </div>

      <div className="relative mx-auto max-w-2xl">
        <CatSilhouette size={90} className="absolute -left-4 -top-16 hidden text-gold/15 sm:block" />
        <Lines lines={c.intro} lineClass="body-copy sm:text-lg" />
      </div>

      <Reveal className="mx-auto mt-16 max-w-3xl">
        <div className="card overflow-hidden">
          <div className="border-b border-gold/20 bg-gold/5 px-6 py-4 text-center">
            <h3 className="kicker !tracking-[0.2em]">{c.reportTitle}</h3>
          </div>
          <div className="grid grid-cols-2 border-b border-gold/15 text-center text-[0.65rem] uppercase tracking-[0.3em] text-gold">
            <span className="py-3">CEO</span>
            <span className="border-l border-gold/15 py-3">Cats</span>
          </div>
          {c.report.map((r, i) => (
            <motion.div key={r.ceo} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="grid grid-cols-2 border-b border-gold/10 last:border-0">
              <p className="p-4 text-sm text-ivory/85 sm:p-5">{r.ceo}</p>
              <p className="border-l border-gold/10 p-4 text-sm text-champagne sm:p-5">{r.cats}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <Lines lines={c.afterReport} className="mx-auto mt-16 max-w-2xl" lineClass="body-copy sm:text-lg" />

      <Reveal className="mx-auto mt-16 max-w-2xl">
        <div className="card p-7 sm:p-10">
          <h3 className="kicker mb-6 !tracking-[0.2em]">{c.recTitle}</h3>
          <div className="flex flex-col gap-4">
            {c.rec.map((l, i) => (
              <p key={i} className={`body-copy ${l === 'P.S.' ? 'font-serif text-gold' : ''}`}>
                {l}
              </p>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="mx-auto mt-16 max-w-md">
        <div className="card flex flex-col items-center gap-5 p-8 text-center">
          <h3 className="kicker">{c.meterTitle}</h3>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-charcoal ring-1 ring-gold/20" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={a?.score ?? 0} aria-label={c.meterTitle}>
            <motion.div animate={{ width: `${a?.score ?? 0}%` }} transition={{ type: 'spring', stiffness: 80, damping: 14 }} className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold-soft" />
          </div>
          <div className="relative flex min-h-[8.5rem] w-full flex-col items-center justify-center gap-3" aria-live="polite">
            <AnimatePresence mode="wait">
              {a ? (
                <motion.div key={stampKey} ref={stampRef} initial={{ opacity: 0, scale: 2.2, rotate: -18 }} animate={{ opacity: 1, scale: 1, rotate: -4 }} transition={{ type: 'spring', stiffness: 220, damping: 15 }} className="flex flex-col items-center gap-3">
                  <span className="stamp flex items-center gap-2 text-sm text-gold">
                    <PawPrint size={18} /> {a.status}
                  </span>
                  <p className="font-display text-xl italic text-ivory">{a.message}</p>
                </motion.div>
              ) : (
                <p className="text-sm text-mute">The cats are awaiting your request.</p>
              )}
            </AnimatePresence>
          </div>
          <GoldButton onClick={request}>{c.meterButton}</GoldButton>
        </div>
      </Reveal>

      {/* easter egg 2: a hidden paw */}
      <button
        type="button"
        aria-label="Hidden paw print"
        onClick={() => foundEgg('paw', 'secret', c.egg2.title, c.egg2.body)}
        className="absolute bottom-8 right-5 grid h-11 w-11 place-items-center text-gold/15 transition hover:scale-125 hover:text-gold sm:right-10"
      >
        <Paw size={22} />
      </button>
    </Section>
  );
}
