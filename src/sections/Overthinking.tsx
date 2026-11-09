import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Gauge } from 'lucide-react';
import { content } from '../data/content';
import { Lines, Reveal, Section, SectionHeading } from '../components/Reveal';
import GoldButton from '../components/GoldButton';
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

  return (
    <Section id="overthinking" index={5}>
      <SectionHeading kicker={o.kicker} title={o.title} />

      <Reveal>
        <div className="card relative mb-20 overflow-hidden p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, scale: 2.4, rotate: -22 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -9 }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.5 }}
            className="stamp absolute right-4 top-4 z-10 bg-midnight/60 text-xs text-gold sm:right-8 sm:top-8 sm:text-base"
          >
            {o.stamp}
          </motion.div>

          <div className="mb-8 grid grid-cols-2 gap-3 pt-10 sm:grid-cols-4 sm:pt-4">
            {o.tiles.map((t) => (
              <div key={t.label} className="rounded-xl border border-gold/15 bg-midnight/50 p-4">
                <AlertTriangle size={18} className="mb-3 animate-pulse text-gold" aria-hidden />
                <p className="font-serif text-2xl text-champagne">{t.value}</p>
                <p className="mt-1 text-[0.7rem] leading-snug text-mute">{t.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold">
            <Gauge size={16} aria-hidden /> {o.meterLabel}
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-charcoal ring-1 ring-gold/20" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={level} aria-label={o.meterLabel}>
            <motion.div
              className={`h-full rounded-full ${level > 80 ? 'bg-gradient-to-r from-gold to-alert' : 'bg-gradient-to-r from-gold-deep to-gold-soft'}`}
              animate={{ width: `${level}%` }}
              transition={{ type: 'spring', stiffness: 70, damping: 14 }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[0.65rem] text-dim">
            <span>Calm</span>
            <span className="text-gold">{level}%</span>
            <span>Main character</span>
          </div>
          <div className="mt-6 min-h-[3.2rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p key={msg} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="font-display text-xl italic text-ivory/90">
                {scanning ? 'Scanning the tabs…' : msg}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="mt-4">
            <GoldButton variant="ghost" onClick={run} disabled={scanning}>
              {o.meterButton}
            </GoldButton>
          </div>
        </div>
      </Reveal>

      <Lines lines={o.copy} className="mx-auto max-w-2xl" lineClass="body-copy text-center sm:text-lg" />
    </Section>
  );
}
