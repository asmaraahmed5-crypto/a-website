import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Gauge } from 'lucide-react';
import { content } from '../data/content';
import { Lines, Reveal, Section, SectionHeading, Split } from '../components/Reveal';
import Button from '../components/Button';
import { sfx } from '../lib/audio';

const o = content.overthinking;

export default function Overthinking() {
  const [level, setLevel] = useState(35);
  const [msg, setMsg] = useState(o.meterMessages[0]);
  const [idx, setIdx] = useState(0);
  const [scanning, setScanning] = useState(false);

  const run = () => {
    if (scanning) return;
    setScanning(true);
    window.setTimeout(() => {
      let next = Math.floor(Math.random() * o.meterMessages.length);
      if (next === idx) next = (next + 1) % o.meterMessages.length;
      setIdx(next);
      setMsg(o.meterMessages[next]);
      setLevel(55 + Math.floor(Math.random() * 46));
      setScanning(false);
      sfx.chime();
    }, 700);
  };

  const visual = (
    <Reveal>
      <div className="card relative p-5 sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-fg/15 pb-4">
          <p className="kicker">Internal dashboard</p>
          <motion.span
            initial={{ opacity: 0, scale: 2.2, rotate: -18 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.5 }}
            className="stamp bg-card text-[0.6rem] text-accent sm:text-xs"
          >
            {o.stamp}
          </motion.span>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3">
          {o.tiles.map((t) => (
            <div key={t.label} className="rounded border border-fg/15 bg-bg p-4">
              <AlertTriangle size={18} className="mb-3 animate-pulse text-accent" aria-hidden />
              <p className="text-2xl font-extrabold">{t.value}</p>
              <p className="mt-1 text-[0.7rem] leading-snug text-mute">{t.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
          <Gauge size={16} aria-hidden /> {o.meterLabel}
        </div>
        <div className="mt-3 h-4 overflow-hidden rounded bg-fg/10" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={level} aria-label={o.meterLabel}>
          <motion.div className="h-full bg-accent" animate={{ width: `${level}%` }} transition={{ type: 'spring', stiffness: 70, damping: 14 }} />
        </div>
        <div className="mt-2 flex justify-between text-[0.65rem] font-medium text-mute">
          <span>Calm</span>
          <span className="font-bold text-accent">{level}%</span>
          <span>Main character</span>
        </div>
        <div className="mt-6 min-h-[4rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={scanning ? 'scan' : msg} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="text-base font-semibold">
              {scanning ? 'Scanning the tabs…' : msg}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-4">
          <Button onClick={run} disabled={scanning}>
            {o.meterButton}
          </Button>
        </div>
      </div>
    </Reveal>
  );

  return (
    <Section id="overthinking" index={5} theme="light">
      <Split
        text={
          <>
            <SectionHeading kicker={o.kicker} title={o.title} />
            <Lines lines={o.copy} />
          </>
        }
        visual={visual}
      />
    </Section>
  );
}
