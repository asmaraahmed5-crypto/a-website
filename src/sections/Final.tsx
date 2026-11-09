import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '../data/content';
import { Lines, Reveal, Section, SectionHeading, Split } from '../components/Reveal';
import Button from '../components/Button';
import { Envelope, IceCream } from '../components/Art';
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
    window.setTimeout(() => burstFrom(el, 90), 1200);
    window.setTimeout(() => setStage('open'), 2000);
  };

  const order = () => {
    setOrdered(true);
    sfx.chime();
    window.setTimeout(() => burstFrom(orderRef.current, 90), 200);
  };

  const text = (
    <>
      <SectionHeading kicker={f.kicker} title={f.title} />
      {stage !== 'open' && (
        <p className="body-copy" aria-live="polite">
          {stage === 'opening' ? 'The envelope is opening…' : 'One envelope remains. Open it to see the final instruction.'}
        </p>
      )}
      {stage === 'open' && (
        <>
          <Lines lines={f.letter} lineClass="text-lg font-medium leading-relaxed text-fg sm:text-xl" gap="gap-5" />

          <Reveal y={30} className="mt-16">
            <h3 className="text-3xl font-extrabold uppercase leading-[1.1] tracking-tight text-accent sm:text-5xl">{f.headline}</h3>
          </Reveal>

          <Lines lines={f.reveal} className="mt-8" />

          <Reveal className="mt-12" y={40}>
            <div className="flex flex-col items-start gap-7" ref={orderRef}>
              <motion.div animate={ordered ? { y: [0, -18, 0], rotate: [0, -6, 6, 0] } : { y: [0, -5, 0] }} transition={ordered ? { duration: 0.8, repeat: 3 } : { duration: 3, repeat: Infinity }}>
                <IceCream size={ordered ? 150 : 120} />
              </motion.div>

              {!ordered ? (
                <Button onClick={order}>{f.order}</Button>
              ) : (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card w-full p-6" role="alert">
                    <p className="stamp mb-4 inline-block -rotate-2 text-accent">{f.orderReply[0]}</p>
                    <div className="flex flex-col gap-2">
                      {f.orderReply.slice(1).map((l) => (
                        <p key={l}>{l}</p>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

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
          </Reveal>
        </>
      )}
    </>
  );

  const visual = (
    <div className="flex flex-col items-center">
      <motion.button
        type="button"
        aria-label={f.envelopeHint}
        disabled={stage !== 'closed'}
        onClick={(e) => open(e.currentTarget)}
        animate={stage === 'opening' ? { scale: [1, 1.05, 1.05], rotate: [0, -1.5, 1.5, -1, 0] } : { y: [0, -6, 0] }}
        transition={stage === 'opening' ? { duration: 1.6 } : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        className="h-56 w-80 max-w-full disabled:cursor-default sm:h-64 sm:w-96"
      >
        <Envelope open={stage !== 'closed'} seal="?" />
      </motion.button>
      {stage === 'closed' && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-mute">{f.envelopeHint}</p>}
    </div>
  );

  return (
    <Section id="final" index={12} theme="dark" className="md:pb-40">
      <Split flip text={text} visual={visual} />
    </Section>
  );
}
