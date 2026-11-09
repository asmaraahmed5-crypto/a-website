import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** A list of paragraphs that slide up one by one as they enter the screen. */
export function Lines({
  lines,
  className = '',
  lineClass = 'body-copy',
  gap = 'gap-5',
}: {
  lines: string[];
  className?: string;
  lineClass?: string;
  gap?: string;
}) {
  return (
    <div className={`flex flex-col ${gap} ${className}`}>
      {lines.map((l, i) => (
        <Reveal key={i} y={18}>
          <p className={lineClass}>{l}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  date,
  align = 'center',
}: {
  kicker: string;
  title: string;
  date?: string;
  align?: 'center' | 'left';
}) {
  const a = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <header className={`mb-12 flex flex-col gap-4 ${a}`}>
      <Reveal>
        <p className="kicker">{kicker}</p>
      </Reveal>
      <motion.span
        aria-hidden
        className="block h-px w-24 origin-left bg-gradient-to-r from-gold to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
      />
      <Reveal delay={0.1}>
        <h2 className="gold-text font-serif text-[2rem] font-semibold leading-[1.12] tracking-wide sm:text-5xl md:text-6xl">{title}</h2>
      </Reveal>
      {date && (
        <Reveal delay={0.2}>
          <p className="font-display text-2xl italic tracking-[0.2em] text-champagne/80">{date}</p>
        </Reveal>
      )}
    </header>
  );
}

export function Section({
  id,
  index,
  children,
  className = '',
  narrow = false,
}: {
  id: string;
  index: number;
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <section id={id} data-section className={`relative scroll-mt-0 px-5 py-24 sm:px-8 md:py-36 ${className}`}>
      <span aria-hidden className="pointer-events-none absolute left-5 top-8 font-display text-sm tracking-[0.3em] text-gold/50 sm:left-8">
        {String(index).padStart(2, '0')} / 12
      </span>
      <div className={`mx-auto w-full ${narrow ? 'max-w-2xl' : 'max-w-5xl'}`}>{children}</div>
    </section>
  );
}
