import { useState } from 'react';
import { motion } from 'framer-motion';
import { content } from '../data/content';
import { Section, SectionHeading, Split } from '../components/Reveal';
import { Envelope } from '../components/Art';
import { burstFrom } from '../lib/fx';
import { sfx } from '../lib/audio';

const n = content.note;

/** Envelope you click open; the letter then writes itself line by line. */
export default function Note() {
  const [open, setOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const openIt = (el: HTMLElement) => {
    if (open) return;
    sfx.open();
    burstFrom(el, 70);
    setOpen(true);
    window.setTimeout(() => setShowLetter(true), 700);
  };

  const text = (
    <>
      <SectionHeading kicker={n.kicker} title={n.title} />
      {!showLetter ? (
        <p className="body-copy">{open ? 'Opening…' : 'A private letter is waiting inside. Open the envelope to read it.'}</p>
      ) : (
        <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="rounded border-2 border-ink bg-white p-6 text-ink sm:p-9">
          <div className="flex flex-col gap-4">
            {n.letter.map((line, i) => (
              <motion.p
                key={i}
                initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.2 }}
                animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                transition={{ duration: Math.min(1.4, 0.4 + line.length / 80), delay: 0.2 + i * 0.8, ease: 'easeOut' }}
                className="text-base font-medium italic leading-relaxed sm:text-lg"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.article>
      )}
    </>
  );

  const visual = (
    <div className="flex flex-col items-center">
      <button type="button" aria-label="Open the envelope" aria-expanded={open} onClick={(e) => openIt(e.currentTarget)} disabled={open} className="h-56 w-80 max-w-full transition-transform hover:-translate-y-1 disabled:cursor-default disabled:hover:translate-y-0 sm:h-64 sm:w-96">
        <motion.div animate={open ? { y: [0, -8, 0] } : { y: [0, -5, 0] }} transition={open ? { duration: 0.6 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} className="h-full w-full">
          <Envelope open={open} seal="30" />
        </motion.div>
      </button>
      {!open && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-mute">{n.envelopeHint}</p>}
    </div>
  );

  return (
    <Section id="note" index={4} theme="maroon">
      <Split flip text={text} visual={visual} />
    </Section>
  );
}
