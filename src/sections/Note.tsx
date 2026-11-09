import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { content } from '../data/content';
import { Section, SectionHeading, Split } from '../components/Reveal';
import Button from '../components/Button';
import { Envelope } from '../components/Art';
import { burstFrom } from '../lib/fx';
import { sfx } from '../lib/audio';

const n = content.note;

/** The letter opens in a popup (modal) after the envelope is clicked, and writes itself line by line. */
export default function Note() {
  const [open, setOpen] = useState(false); // envelope flap
  const [popup, setPopup] = useState(false); // letter dialog
  const [opened, setOpened] = useState(false); // has been read at least once
  const [round, setRound] = useState(0); // restarts the handwriting animation
  const closeRef = useRef<HTMLButtonElement>(null);
  const envRef = useRef<HTMLButtonElement>(null);

  const openLetter = (el: HTMLElement | null, again = false) => {
    sfx.open();
    if (!again) {
      burstFrom(el, 70);
      setOpen(true);
      window.setTimeout(() => {
        setRound((r) => r + 1);
        setPopup(true);
      }, 700);
    } else {
      setRound((r) => r + 1);
      setPopup(true);
    }
  };

  const close = () => {
    setPopup(false);
    setOpened(true);
    window.setTimeout(() => envRef.current?.focus(), 50);
  };

  // popup behaviour: Esc closes, page scroll is locked, focus moves into the dialog
  useEffect(() => {
    if (!popup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [popup]);

  const text = (
    <>
      <SectionHeading kicker={n.kicker} title={n.title} />
      <p className="body-copy mb-8">
        {opened ? 'The letter has been delivered. Read it again whenever you like.' : open ? 'Opening…' : 'A private letter is waiting inside. Open the envelope to read it.'}
      </p>
      {opened && <Button onClick={() => openLetter(null, true)}>Read the letter again</Button>}
    </>
  );

  const visual = (
    <div className="flex flex-col items-center">
      <button ref={envRef} type="button" aria-label="Open the envelope" aria-haspopup="dialog" aria-expanded={popup} onClick={(e) => !open && openLetter(e.currentTarget)} disabled={open && !opened} className="h-56 w-80 max-w-full transition-transform hover:-translate-y-1 disabled:cursor-default disabled:hover:translate-y-0 sm:h-64 sm:w-96">
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

      <AnimatePresence>
        {popup && (
          <motion.div
            key="letter-popup"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="A little note from the creative department"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="themed theme-light relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded border-2 border-ink p-6 sm:p-10"
            >
              <button ref={closeRef} type="button" aria-label="Close letter" onClick={close} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded text-ink hover:bg-ink hover:text-white">
                <X size={20} />
              </button>
              <p className="kicker pr-12">{n.title}</p>
              <span aria-hidden className="mb-6 mt-3 block h-1 w-16 bg-accent" />
              <div key={round} className="flex flex-col gap-4">
                {n.letter.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.2 }}
                    animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                    transition={{ duration: Math.min(1.2, 0.35 + line.length / 90), delay: 0.2 + i * 0.7, ease: 'easeOut' }}
                    className="text-base font-medium italic leading-relaxed sm:text-lg"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
              <div className="mt-8">
                <Button onClick={close}>Close letter</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
