import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// Milestone Timeline (from 21st.dev, "Milestone Timeline Feature" by uiable), adapted:
// project colour tokens, solid colours, 7px corners. Alternates left and right on desktop.
// ─────────────────────────────────────────────────────────────

export type Milestone = { year: string; title: string; desc: string; emoji?: ReactNode };

const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

function Card({ m }: { m: Milestone }) {
  return (
    <div className="rounded border border-fg/20 bg-card p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent">
      <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.2em] text-accent">{m.year}</span>
      <h4 className="text-lg font-extrabold text-fg">{m.title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-mute">{m.desc}</p>
    </div>
  );
}

export default function MilestoneTimeline({ items, hiddenButton }: { items: Milestone[]; hiddenButton?: ReactNode }) {
  return (
    <motion.ol initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer} className="relative mx-auto max-w-3xl">
      <div aria-hidden className="absolute bottom-0 left-[15px] top-0 w-0.5 bg-fg/20 sm:left-1/2" />
      {items.map((m, idx) => (
        <motion.li key={m.title + idx} variants={popIn} className="group relative mb-6 flex flex-col items-start justify-between last:mb-0 sm:flex-row sm:items-center md:mb-8">
          <div aria-hidden className="absolute left-[10px] z-10 h-4 w-4 -translate-x-[6px] rounded border-4 border-bg bg-accent transition-transform duration-300 group-hover:scale-150 sm:left-1/2" />
          <div className={`w-full pl-8 text-left sm:w-[45%] sm:pl-0 sm:text-right ${idx % 2 !== 0 ? 'hidden sm:block sm:opacity-0 sm:pointer-events-none' : ''}`} aria-hidden={idx % 2 !== 0 ? true : undefined}>
            <Card m={m} />
          </div>
          <div className={`w-full pl-8 text-left sm:w-[45%] sm:pl-0 ${idx % 2 === 0 ? 'hidden sm:block sm:opacity-0 sm:pointer-events-none' : ''}`} aria-hidden={idx % 2 === 0 ? true : undefined}>
            <Card m={m} />
          </div>
        </motion.li>
      ))}
      {hiddenButton}
    </motion.ol>
  );
}
