import { useState } from 'react';
import { AnimatePresence, motion, useAnimationControls, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { Check, RotateCcw, X } from 'lucide-react';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Section, SectionHeading, Split } from '../components/Reveal';
import Button from '../components/Button';
import Photo from '../components/Photo';
import { burst, scrollToId } from '../lib/fx';
import { sfx } from '../lib/audio';
import { foundEgg, setSaved, useSaved } from '../lib/store';

const b = content.bumble;

export default function Bumble() {
  const { swiped } = useSaved();
  const controls = useAnimationControls();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);

  const swipeRight = async () => {
    if (busy) return;
    setBusy(true);
    sfx.chime();
    await controls.start({ x: 640, rotate: 20, opacity: 0, transition: { duration: 0.5, ease: [0.5, 0, 0.9, 0.5] } });
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
    await controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 16 } });
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

  const visual = !swiped ? (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-[480px] w-full max-w-[320px] touch-pan-y select-none">
        <div aria-hidden className="absolute inset-0 translate-y-3 scale-[0.95] rounded border border-fg/20 bg-card" />
        <motion.div
          drag={busy ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.9}
          onDragEnd={onDragEnd}
          animate={controls}
          style={{ x, rotate }}
          className="absolute inset-0 cursor-grab overflow-hidden rounded border-2 border-ink bg-ink shadow-xl active:cursor-grabbing"
        >
          <Photo src={photos.bumble} alt="The Founder and CEO" hint="public/images/bumble.jpg" className="h-full w-full !rounded-none" />
          <motion.span style={{ opacity: likeOpacity }} className="stamp absolute left-4 top-5 -rotate-6 bg-white text-lg text-maroon">
            Right
          </motion.span>
          <motion.span style={{ opacity: nopeOpacity }} className="stamp absolute right-4 top-5 rotate-6 bg-ink text-lg text-white">
            Nope
          </motion.span>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-ink p-5 text-white">
            <p className="text-lg font-bold">{b.cardName}</p>
            <p className="mt-0.5 text-sm text-white/75">{b.cardLine}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-6">
        <button type="button" aria-label="Swipe left" onClick={() => void swipeLeft()} disabled={busy} className="grid h-14 w-14 place-items-center rounded border-2 border-fg/40 text-fg transition hover:border-accent hover:text-accent disabled:opacity-40">
          <X size={24} />
        </button>
        <button type="button" aria-label="Swipe right" onClick={() => void swipeRight()} disabled={busy} className="grid h-16 w-16 place-items-center rounded bg-accent text-onaccent transition hover:opacity-85 disabled:opacity-40">
          <Check size={28} />
        </button>
      </div>
      <p className="text-center text-xs font-medium text-mute" aria-live="polite">
        {wrong ? b.wrongWay : b.hint}
      </p>
    </div>
  ) : (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="card mx-auto flex w-full max-w-[360px] flex-col items-center gap-6 p-10 text-center">
        <motion.span initial={{ scale: 2, rotate: -12, opacity: 0 }} animate={{ scale: 1, rotate: -5, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }} className="stamp text-xl text-accent">
          Matched
        </motion.span>
        <p className="text-2xl font-extrabold uppercase leading-tight">{b.success}</p>
        <Button onClick={() => scrollToId('promise')}>{b.cont}</Button>
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-mute hover:text-fg">
          <RotateCcw size={14} /> Swipe again
        </button>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <Section id="bumble" index={2} theme="light">
      <Split
        flip
        text={
          <>
            <SectionHeading kicker={b.kicker} title={b.title} />
            <Lines lines={b.copy} />
          </>
        }
        visual={visual}
      />
    </Section>
  );
}
