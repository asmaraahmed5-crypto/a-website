import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { content } from '../data/content';

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, y = 22, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Join consecutive short lines into paragraphs so long copy does not become a tall stack of one-liners. */
export function groupLines(lines: string[], budget = 200): string[] {
  const out: string[] = [];
  let cur = '';
  for (const l of lines) {
    if (!cur) cur = l;
    else if ((cur + ' ' + l).length <= budget) cur += ' ' + l;
    else {
      out.push(cur);
      cur = l;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/** Paragraphs that slide up one by one as they enter the screen. Short lines are grouped (set group={false} to keep one per line). */
export function Lines({
  lines,
  className = '',
  lineClass = 'body-copy',
  gap = 'gap-4',
  group = true,
  budget = 200,
}: {
  lines: string[];
  className?: string;
  lineClass?: string;
  gap?: string;
  group?: boolean;
  budget?: number;
}) {
  const items = group ? groupLines(lines, budget) : lines;
  return (
    <div className={`flex flex-col ${gap} ${className}`}>
      {items.map((l, i) => (
        <Reveal key={i} y={14}>
          <p className={lineClass}>{l}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function SectionHeading({ kicker, title, date }: { kicker: string; title: string; date?: string }) {
  return (
    <header className="mb-6">
      <Reveal>
        <p className="kicker mb-3">{kicker}</p>
        <h2 className="text-3xl font-extrabold uppercase leading-[1.12] tracking-tight sm:text-4xl">{title}</h2>
        <span aria-hidden className="mt-5 block h-1 w-16 bg-accent" />
        {date && <p className="mt-4 text-xl font-semibold tracking-[0.2em] text-accent">{date}</p>}
      </Reveal>
    </header>
  );
}

export type Theme = 'dark' | 'light' | 'beige' | 'maroon' | 'indigo';

/** A full-width band with its own colour theme and a corporate index row on top. */
export function Section({ id, index, theme, children, className = '' }: { id: string; index: number; theme: Theme; children: ReactNode; className?: string }) {
  const label = content.sections[index - 1]?.label ?? '';
  return (
    <section id={id} data-section className={`themed theme-${theme} relative overflow-x-clip px-5 py-12 sm:px-8 md:py-16 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-center justify-between border-b border-fg/20 pb-3 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-mute">
          <span>{String(index).padStart(2, '0')} / 12</span>
          <span>{label}</span>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Two columns. Text sits left, visual right; flip swaps them on desktop. Stacks on mobile (text first). */
export function Split({ text, visual, flip = false, sticky = true }: { text: ReactNode; visual: ReactNode; flip?: boolean; sticky?: boolean }) {
  return (
    <div className="grid items-start gap-12 md:grid-cols-2 md:gap-12">
      <div className={flip ? 'md:order-2' : ''}>{text}</div>
      <div className={`${flip ? 'md:order-1' : ''} ${sticky ? 'md:sticky md:top-24' : ''}`}>{visual}</div>
    </div>
  );
}
