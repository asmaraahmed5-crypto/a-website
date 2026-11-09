import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { content } from '../data/content';
import { Lines, Reveal, Section, SectionHeading, Split, groupLines } from '../components/Reveal';
import Button from '../components/Button';
import { Envelope, IceCream } from '../components/Art';
import LoopClip from '../components/LoopClip';
import { clips } from '../data/photos';
import { burst, burstFrom } from '../lib/fx';
import { sfx } from '../lib/audio';

const f = content.final;
const letterParagraphs = groupLines(f.letter, 230);
const revealDelay = 0.2 + letterParagraphs.length * 0.8 + 0.4;

/** The final letter opens in a popup (like the earlier note); the big reveal and the ice cream case follow on the page. */
export default function Final() {
  const [flap, setFlap] = useState(false); // envelope flap lifted
  const [popup, setPopup] = useState(false); // letter dialog
  const [read, setRead] = useState(false); // letter has been read once
  const [round, setRound] = useState(0); // restarts the handwriting animation
  const [ordered, setOrdered] = useState(false);
  const [closed, setClosed] = useState(false);
  const orderRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const envRef = useRef<HTMLButtonElement>(null);

  const openLetter = (el: HTMLElement | null, again = false) => {
    sfx.open();
    if (!again) {
      burstFrom(el, 90);
      setFlap(true);
      window.setTimeout(() => {
        setRound((r) => r + 1);
        setPopup(true);
      }, 900);
    } else {
      setRound((r) => r + 1);
      setPopup(true);
    }
  };

  const close = () => {
    setPopup(false);
    if (!read) {
      setRead(true);
      window.setTimeout(() => burst(undefined, window.innerHeight * 0.5, 120), 500);
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popup]);

  const order = () => {
    setOrdered(true);
    sfx.chime();
    window.setTimeout(() => burstFrom(orderRef.current, 90), 200);
  };

  const text = (
    <>
      <SectionHeading kicker={f.kicker} title={f.title} />
      <p className="body-copy" aria-live="polite">
        {flap && !read ? 'The envelope is opening…' : read ? 'The file is closed, for now. Tap the envelope to open it again.' : 'One envelope remains. Open it to read the final instruction.'}
      </p>
    </>
  );

  const visual = (
    <div className="flex flex-col items-center">
      <motion.button
        ref={envRef}
        type="button"
        aria-label={read ? 'Open the final letter again' : f.envelopeHint}
        aria-haspopup="dialog"
        aria-expanded={popup}
        disabled={flap && !read}
        onClick={(e) => (!flap ? openLetter(e.currentTarget) : openLetter(null, true))}
        animate={flap && !read ? { scale: [1, 1.05, 1.05], rotate: [0, -1.5, 1.5, -1, 0] } : { y: [0, -6, 0] }}
        transition={flap && !read ? { duration: 1.6 } : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        className="h-48 w-72 max-w-full disabled:cursor-default sm:h-56 sm:w-80"
      >
        <Envelope open={flap} seal="?" />
      </motion.button>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-mute">{read ? 'Tap to open again' : f.envelopeHint}</p>
    </div>
  );

  return (
    <Section id="final" index={12} theme="dark">
      <Split flip text={text} visual={visual} />

      <AnimatePresence>
        {popup && (
          <motion.div
            key="final-letter-popup"
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
              aria-label="The final investigation"
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
              <p className="kicker pr-12">{f.title}</p>
              <span aria-hidden className="mb-6 mt-3 block h-1 w-16 bg-accent" />
              <div key={round} className="flex flex-col">
                <div className="flex flex-col gap-4">
                  {letterParagraphs.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.2 }}
                      animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                      transition={{ duration: Math.min(1.4, 0.4 + line.length / 90), delay: 0.2 + i * 0.8, ease: 'easeOut' }}
                      className="text-base font-medium italic leading-relaxed sm:text-lg"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                {/* the big reveal, after the letter */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: revealDelay }} className="mt-10 border-t-2 border-fg pt-8">
                  <h3 className="text-2xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-3xl">{f.headline}</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {groupLines(f.reveal, 200).map((l, i) => (
                      <p key={i} className="body-copy">
                        {l}
                      </p>
                    ))}
                  </div>
                </motion.div>

                {/* the ice cream case */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: revealDelay + 1.2 }} className="mt-8">
                  <div ref={orderRef} className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-4">
                      <motion.div animate={ordered ? { y: [0, -14, 0], rotate: [0, -6, 6, 0] } : { y: [0, -4, 0] }} transition={ordered ? { duration: 0.8, repeat: 3 } : { duration: 3, repeat: Infinity }}>
                        <IceCream size={ordered ? 90 : 80} />
                      </motion.div>
                      {!ordered && <Button onClick={order}>{f.order}</Button>}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setClosed(true);
                          burst(undefined, undefined, 20);
                        }}
                        aria-live="polite"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span key={closed ? 'a' : 'b'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                            {closed ? f.closedReply : f.closed}
                          </motion.span>
                        </AnimatePresence>
                      </Button>
                    </div>
                    {ordered && (
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card w-full p-5" role="alert">
                        <p className="stamp mb-3 inline-block -rotate-2 text-accent">{f.orderReply[0]}</p>
                        <p className="body-copy">{f.orderReply.slice(1).join(' ')}</p>
                        <LoopClip src={clips.iceCream} label={f.iceClipLabel} caption={f.iceClipCaption} aspect="aspect-video" className="mt-4" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
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
