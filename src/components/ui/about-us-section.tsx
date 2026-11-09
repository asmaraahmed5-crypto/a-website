import { useRef } from 'react';
import { ArrowDown, Zap } from 'lucide-react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { content } from '@/data/content';
import { clips } from '@/data/photos';
import LoopClip from '@/components/LoopClip';

// ─────────────────────────────────────────────────────────────
// About Us section (from 21st.dev, "About Us Section"), adapted for the opening memo:
// project colour tokens, solid colours (no gradients or blur), 7px corners, no buttons that
// would do nothing (the picture button and the call-to-action became a caption and a banner),
// and a funny looping clip in the centre column instead of a house photo.
// ─────────────────────────────────────────────────────────────

type Ui = typeof content.hero.memoUi;

/** "Z z z" drifting up from the sleeping CEO. */
function Zzz() {
  const reduce = useReducedMotion();
  const letters = [
    { t: 'Z', size: 'text-2xl', delay: 0, x: 0 },
    { t: 'Z', size: 'text-3xl', delay: 0.9, x: 14 },
    { t: 'Z', size: 'text-4xl', delay: 1.8, x: 30 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute -right-3 top-6 z-20 w-16">
      {letters.map((l, i) => (
        <motion.span
          key={i}
          className={`absolute font-extrabold text-beige ${l.size}`}
          style={{ left: l.x, top: 40 }}
          initial={{ opacity: 0, y: 0 }}
          animate={reduce ? { opacity: 0.9 } : { opacity: [0, 1, 0], y: [0, -46, -92], rotate: [0, 8, -8] }}
          transition={{ duration: 2.7, repeat: Infinity, delay: l.delay, ease: 'easeOut' }}
        >
          {l.t}
        </motion.span>
      ))}
    </div>
  );
}

/** A door-hanger sign that swings on the clip frame. */
function DoNotDisturb() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className="absolute -left-4 top-14 z-20 origin-top"
      style={{ rotate: -8 }}
      animate={reduce ? undefined : { rotate: [-9, 7, -9] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className="absolute left-1/2 top-[-14px] h-4 w-0.5 -translate-x-1/2 bg-beige" />
      <span className="block rounded border-2 border-ink bg-beige px-3 py-1.5 text-center text-[0.6rem] font-extrabold uppercase leading-tight tracking-[0.14em] text-maroon shadow-lg">
        CEO on break
        <br />
        <span className="text-ink">Do not disturb</span>
      </span>
    </motion.div>
  );
}

/** Hand-drawn squiggle that draws itself under the title. */
function Squiggle() {
  return (
    <svg aria-hidden viewBox="0 0 240 16" className="h-4 w-60 max-w-full text-beige" fill="none">
      <motion.path
        d="M4 8 Q 24 -2 44 8 T 84 8 T 124 8 T 164 8 T 204 8 T 236 8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, delay: 0.5, ease: 'easeInOut' }}
      />
    </svg>
  );
}

const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } } };
const itemVariants: Variants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } } };

export default function AboutUsSection({ ui }: { ui: Ui }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });


  const left = ui.items.filter((i) => i.side === 'left');
  const right = ui.items.filter((i) => i.side === 'right');

  return (
    <div ref={sectionRef} className="relative mx-auto w-full max-w-6xl">

      <motion.div className="relative z-10" initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={containerVariants}>
        <motion.div className="mb-6 flex flex-col items-center" variants={itemVariants}>
          <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">
            <motion.span aria-hidden animate={reduce ? undefined : { scale: [1, 1.35, 1], rotate: [0, -12, 12, 0] }} transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2 }}>
              <Zap className="h-4 w-4" />
            </motion.span>
            {ui.badge}
          </span>
          <h2 className="mb-4 text-center text-3xl font-extrabold uppercase tracking-tight sm:text-4xl md:text-5xl">{ui.title}</h2>
          <Squiggle />
        </motion.div>

        <motion.p className="mx-auto mb-14 max-w-2xl text-center text-lg text-fg/85" variants={itemVariants}>
          {ui.intro}
        </motion.p>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-5">
            {left.map((it, i) => (
              <ServiceItem key={it.title} {...it} index={i} direction="left" />
            ))}
          </div>

          {/* centre: the funny clip with an offset frame */}
          <div className="order-first mb-4 flex items-center justify-center md:order-none md:mb-0">
            <motion.div className="relative w-full max-w-xs" variants={itemVariants}>
              <motion.div whileHover={reduce ? undefined : { scale: 1.03, transition: { duration: 0.3 } }} className="relative">
                <LoopClip src={clips.asleepAtDesk} label={ui.clipLabel} caption={ui.clipCaption} aspect="aspect-[4/5]" tag="LIVE" className="shadow-xl" />
                <Zzz />
                <DoNotDisturb />
              </motion.div>
              <div aria-hidden className="absolute inset-0 -z-10 -m-3 rounded border-4 border-accent" />
              <motion.div aria-hidden className="absolute -top-10 left-1/2 h-3 w-3 -translate-x-1/2 rounded bg-accent" animate={reduce ? undefined : { y: [0, -10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div aria-hidden className="absolute -bottom-12 left-1/2 h-2 w-2 -translate-x-1/2 rounded bg-fg" animate={reduce ? undefined : { y: [0, 10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
            </motion.div>
          </div>

          <div className="space-y-5">
            {right.map((it, i) => (
              <ServiceItem key={it.title} {...it} index={i + 3} direction="right" />
            ))}
          </div>
        </div>

        {/* closing banner (no button: just keep scrolling) */}
        <motion.div
          className="mt-14 flex flex-col items-center justify-between gap-5 rounded bg-ink p-8 text-white md:flex-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex-1 text-center md:text-left">
            <h3 className="mb-1 text-2xl font-extrabold uppercase tracking-tight text-beige">{ui.closingTitle}</h3>
            <p className="text-white/85">{ui.closingText}</p>
          </div>
          <motion.span aria-hidden className="grid h-12 w-12 place-items-center rounded border border-beige text-beige" animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
            <ArrowDown size={22} />
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ServiceItem({ title, text, index, direction }: { title: string; text: string; index: number; direction: 'left' | 'right' }) {
  const reduce = useReducedMotion();
  const delay = (index % 3) * 0.2;
  return (
    <motion.div className="group flex flex-col rounded border border-fg/15 bg-card p-5 transition-colors duration-300 hover:border-accent" variants={itemVariants} transition={{ delay }} whileHover={reduce ? undefined : { y: -5, transition: { duration: 0.2 } }}>
      <motion.h3
        className="mb-2 text-xl font-extrabold transition-colors duration-300"
        initial={{ x: direction === 'left' ? -20 : 20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        {title}
      </motion.h3>
      <motion.p className="text-sm leading-relaxed text-fg/90" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: delay + 0.4 }}>
        {text}
      </motion.p>
    </motion.div>
  );
}
