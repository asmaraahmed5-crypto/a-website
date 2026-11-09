import { useState } from 'react';
import { motion } from 'framer-motion';
import { content } from '../data/content';
import { Section, SectionHeading } from '../components/Reveal';
import { burstFrom } from '../lib/fx';
import { sfx } from '../lib/audio';

const n = content.note;

/** Gold envelope you click open; the letter then "writes itself" line by line. */
export default function Note() {
  const [open, setOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const openIt = (el: HTMLElement) => {
    if (open) return;
    sfx.open();
    burstFrom(el, 70);
    setOpen(true);
    window.setTimeout(() => setShowLetter(true), 900);
  };

  return (
    <Section id="note" index={4} narrow>
      <SectionHeading kicker={n.kicker} title={n.title} />

      <div className="flex flex-col items-center">
        <button
          type="button"
          aria-label="Open the envelope"
          aria-expanded={open}
          onClick={(e) => openIt(e.currentTarget)}
          disabled={open}
          className="relative h-48 w-72 [perspective:900px] disabled:cursor-default sm:h-56 sm:w-80"
        >
          <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#d9bd86] to-[#a8843f] shadow-[0_20px_60px_rgba(0,0,0,0.7)]" />
          <motion.div
            aria-hidden
            animate={open ? { y: -60, opacity: 0.0 } : { y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="absolute inset-x-4 bottom-4 top-4 rounded-sm bg-ivory"
          />
          <svg aria-hidden viewBox="0 0 320 224" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <path d="M0 224 L160 110 L320 224 Z" fill="#c9a35d" />
            <path d="M0 0 L0 224 L160 110 Z M320 0 L320 224 L160 110 Z" fill="#b8924d" />
          </svg>
          <motion.div
            aria-hidden
            animate={{ rotateX: open ? 180 : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top', transformStyle: 'preserve-3d' }}
            className="absolute inset-x-0 top-0 h-1/2"
          >
            <svg viewBox="0 0 320 112" className="h-full w-full" preserveAspectRatio="none">
              <path d="M0 0 L320 0 L160 112 Z" fill="#e0c690" stroke="#8F7440" strokeWidth="1" />
            </svg>
          </motion.div>
          <motion.span
            animate={{ opacity: open ? 0 : 1, scale: open ? 0.6 : 1 }}
            className="absolute left-1/2 top-[48%] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-midnight font-serif text-lg text-gold shadow-lg ring-2 ring-gold/60"
          >
            30
          </motion.span>
        </button>
        {!open && <p className="mt-6 text-xs uppercase tracking-[0.25em] text-mute">{n.envelopeHint}</p>}
      </div>

      {showLetter && (
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mx-auto mt-16 rounded-2xl border border-gold/30 bg-[linear-gradient(170deg,#1c1812,#12100c)] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:p-12"
        >
          <div className="flex flex-col gap-4">
            {n.letter.map((line, i) => (
              <motion.p
                key={i}
                initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.2 }}
                animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                transition={{ duration: Math.min(1.6, 0.5 + line.length / 70), delay: 0.3 + i * 0.9, ease: 'easeOut' }}
                className="font-hand text-[1.55rem] leading-snug text-champagne sm:text-[1.8rem]"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.article>
      )}
    </Section>
  );
}
