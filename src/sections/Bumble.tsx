import { useState } from 'react';
import { AnimatePresence, motion, useAnimationControls, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { Check, RotateCcw, X } from 'lucide-react';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Section, SectionHeading } from '../components/Reveal';
import GoldButton from '../components/GoldButton';
import Photo from '../components/Photo';
import { burst, scrollToId } from '../lib/fx';
import { sfx } from '../lib/audio';
import { foundEgg, setSaved, useSaved } from '../lib/store';

const b = content.bumble;

export default function Bumble() {
  const { swiped } = useSaved();
  const controls = useAnimationControls();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);

  const swipeRight = async () => {
    if (busy) return;
    setBusy(true);
    sfx.chime();
    await controls.start({ x: 640, rotate: 22, opacity: 0, transition: { duration: 0.55, ease: [0.5, 0, 0.9, 0.5] } });
    burst(undefined, undefined, 110);
    setSaved({ swiped: true });
    setBusy(false);
    window.setTimeout(() => foundEgg('smile', 'company', content.eggs.notification.title, content.eggs.notification.body), 1800);
  };

  const swipeLeft = async () => {
    if (busy) return;
    setBusy(true);
    setWrong(true);
    await controls.start({ x: -40, rotate: -6, transition: { duration: 0.18 } });
    await controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 14 } });
    setBusy(false);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 110 || info.velocity.x > 700) void swipeRight();
    else if (info.offset.x < -110) void swipeLeft();
    else void controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 22 } });
  };

  const reset = () => {
    x.set(0);
    controls.set({ x: 0, rotate: 0, opacity: 1 });
    setWrong(false);
    setSaved({ swiped: false });
  };

  return (
    <Section id="bumble" index={2}>
      <SectionHeading kicker={b.kicker} title={b.title} />
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div className="flex flex-col items-center gap-6">
          {!swiped ? (
            <>
              <div className="relative h-[480px] w-full max-w-[320px] touch-pan-y select-none">
                <div aria-hidden className="absolute inset-0 translate-y-3 scale-[0.94] rounded-[26px] border border-gold/20 bg-charcoal" />
                <motion.div
                  drag={busy ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.9}
                  onDragEnd={onDragEnd}
                  animate={controls}
                  style={{ x, rotate }}
                  className="absolute inset-0 cursor-grab overflow-hidden rounded-[26px] border border-gold/40 bg-charcoal shadow-[0_20px_60px_rgba(0,0,0,0.6)] active:cursor-grabbing"
                >
                  <Photo src={photos.bumble} alt="The Founder and CEO" hint="public/images/bumble.jpg" className="h-full w-full" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                  <motion.span style={{ opacity: likeOpacity }} className="stamp absolute left-5 top-6 -rotate-12 text-lg text-gold">
                    Right
                  </motion.span>
                  <motion.span style={{ opacity: nopeOpacity }} className="stamp absolute right-5 top-6 rotate-12 text-lg text-alert">
                    Nope
                  </motion.span>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
                    <p className="font-serif text-2xl text-ivory">{b.cardName}</p>
                    <p className="mt-1 text-sm text-champagne/80">{b.cardLine}</p>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center gap-6">
                <button type="button" aria-label="Swipe left" onClick={() => void swipeLeft()} disabled={busy} className="grid h-14 w-14 place-items-center rounded-full border border-mute/40 text-mute transition hover:border-alert hover:text-alert disabled:opacity-40">
                  <X size={24} />
                </button>
                <button type="button" aria-label="Swipe right" onClick={() => void swipeRight()} disabled={busy} className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-b from-gold-soft to-gold text-midnight shadow-[0_0_30px_rgba(198,165,107,0.35)] transition hover:scale-105 disabled:opacity-40">
                  <Check size={28} />
                </button>
              </div>
              <p className="text-center text-xs tracking-wide text-mute" aria-live="polite">
                {wrong ? b.wrongWay : b.hint}
              </p>
            </>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="card flex w-full max-w-[320px] flex-col items-center gap-6 p-10 text-center">
                <motion.span initial={{ scale: 2.2, rotate: -14, opacity: 0 }} animate={{ scale: 1, rotate: -6, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }} className="stamp text-xl text-gold">
                  Matched
                </motion.span>
                <p className="gold-text font-serif text-3xl font-semibold leading-tight">{b.success}</p>
                <GoldButton onClick={() => scrollToId('promise')}>{b.cont}</GoldButton>
                <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 text-xs uppercase tracking-[0.2em] text-mute hover:text-champagne">
                  <RotateCcw size={14} /> Swipe again
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div>
          <Lines lines={b.copy} />
        </div>
      </div>
    </Section>
  );
}
