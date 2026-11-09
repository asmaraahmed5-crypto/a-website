import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '../data/content';
import { Lines, Reveal, Section, SectionHeading } from '../components/Reveal';
import GoldButton from '../components/GoldButton';
import { IceCream } from '../components/Art';
import { burst, burstFrom } from '../lib/fx';
import { sfx } from '../lib/audio';

const f = content.final;

export default function Final() {
  const [stage, setStage] = useState<'closed' | 'opening' | 'open'>('closed');
  const [ordered, setOrdered] = useState(false);
  const [closed, setClosed] = useState(false);
  const orderRef = useRef<HTMLDivElement>(null);

  const open = (el: HTMLElement) => {
    if (stage !== 'closed') return;
    setStage('opening');
    sfx.open();
    window.setTimeout(() => burstFrom(el, 90), 1400);
    window.setTimeout(() => setStage('open'), 2200);
  };

  const order = () => {
    setOrdered(true);
    sfx.chime();
    window.setTimeout(() => burstFrom(orderRef.current, 90), 200);
  };

  return (
    <Section id="final" index={12} narrow className="pb-40">
      <SectionHeading kicker={f.kicker} title={f.title} />

      {stage !== 'open' && (
        <div className="flex flex-col items-center">
          <motion.button
            type="button"
            aria-label={f.envelopeHint}
            disabled={stage !== 'closed'}
            onClick={(e) => open(e.currentTarget)}
            animate={stage === 'opening' ? { scale: [1, 1.06, 1.06], rotate: [0, -1.5, 1.5, -1, 0] } : { y: [0, -6, 0] }}
            transition={stage === 'opening' ? { duration: 1.6 } : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative h-52 w-80 [perspective:900px] disabled:cursor-default"
          >
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#f0d88f] via-[#d9b25f] to-[#9d7a32] shadow-[0_0_80px_rgba(198,165,107,0.35)]" />
            <svg aria-hidden viewBox="0 0 320 208" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <path d="M0 208 L160 100 L320 208 Z" fill="#c99f4c" />
              <path d="M0 0 L0 208 L160 100 Z M320 0 L320 208 L160 100 Z" fill="#b48a3d" />
            </svg>
            <motion.div aria-hidden animate={{ rotateX: stage === 'closed' ? 0 : 180 }} transition={{ duration: 1.4, delay: 0.3, ease: 'easeInOut' }} style={{ transformOrigin: 'top' }} className="absolute inset-x-0 top-0 h-1/2">
              <svg viewBox="0 0 320 104" className="h-full w-full" preserveAspectRatio="none">
                <path d="M0 0 L320 0 L160 104 Z" fill="#f0d88f" stroke="#8F7440" />
              </svg>
            </motion.div>
            <span className="absolute left-1/2 top-[49%] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-midnight font-serif text-gold ring-2 ring-gold/70">?</span>
          </motion.button>
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-mute" aria-live="polite">
            {stage === 'opening' ? 'The envelope is opening…' : f.envelopeHint}
          </p>
        </div>
      )}

      {stage === 'open' && (
        <>
          <Lines lines={f.letter} className="mx-auto" lineClass="font-display text-[1.4rem] leading-snug text-ivory/90 sm:text-2xl" gap="gap-6" />

          <div className="mt-32 text-center">
            <Reveal y={40}>
              <h3 className="gold-text font-serif text-4xl font-bold leading-[1.1] tracking-wide sm:text-6xl">{f.headline}</h3>
            </Reveal>
          </div>

          <Lines lines={f.reveal} className="mt-14 text-center" lineClass="body-copy sm:text-lg" />

          <Reveal className="mt-16" y={50}>
            <div className="flex flex-col items-center gap-8" ref={orderRef}>
              <motion.div animate={ordered ? { y: [0, -18, 0], rotate: [0, -6, 6, 0] } : { y: [0, -5, 0] }} transition={ordered ? { duration: 0.8, repeat: 3 } : { duration: 3, repeat: Infinity }}>
                <IceCream size={ordered ? 150 : 120} />
              </motion.div>

              {!ordered ? (
                <GoldButton onClick={order}>{f.order}</GoldButton>
              ) : (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="card w-full max-w-md p-7 text-center" role="alert">
                    <p className="stamp mx-auto mb-5 inline-block -rotate-3 text-gold">{f.orderReply[0]}</p>
                    <div className="flex flex-col gap-2 text-ivory/90">
                      {f.orderReply.slice(1).map((l) => (
                        <p key={l}>{l}</p>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              <GoldButton
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
              </GoldButton>
            </div>
          </Reveal>
        </>
      )}
    </Section>
  );
}
