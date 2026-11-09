import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// Animated Countdown (from 21st.dev, "Animated Countdown" by nexus-ui), adapted:
// project colour tokens, solid colours (no gradients), 7px corners.
// ─────────────────────────────────────────────────────────────

type UnitKey = 'days' | 'hours' | 'minutes' | 'seconds';
type TimeLeft = Record<UnitKey, number>;

export type AnimatedCountdownProps = {
  targetDate: Date | string | number;
  unitOrder?: UnitKey[];
  completionMessage?: string;
  onComplete?: () => void;
  className?: string;
  ariaLabel?: string;
};

const LABELS: Record<UnitKey, string> = { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' };

function getTimeLeft(target: number): TimeLeft {
  const total = Math.max(0, target - Date.now());
  const s = Math.floor(total / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

const pad = (v: number) => String(Math.max(0, v)).padStart(2, '0');

function Num({ value }: { value: string }) {
  const reduce = useReducedMotion() === true;
  return (
    <span className="relative inline-grid min-w-[2ch] place-items-center tabular-nums">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={reduce ? false : { y: 14, opacity: 0, filter: 'blur(4px)' }}
          animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={reduce ? { opacity: 0 } : { y: -14, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: reduce ? 0.05 : 0.25, ease: 'easeOut' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function AnimatedCountdown({
  targetDate,
  unitOrder = ['days', 'hours', 'minutes', 'seconds'],
  completionMessage = "We're live!",
  onComplete,
  className,
  ariaLabel = 'Countdown timer',
}: AnimatedCountdownProps) {
  const reduce = useReducedMotion() === true;
  const target = React.useMemo(() => (targetDate instanceof Date ? targetDate.getTime() : new Date(targetDate).getTime()), [targetDate]);
  const [left, setLeft] = React.useState<TimeLeft>(() => getTimeLeft(target));
  const done = left.days + left.hours + left.minutes + left.seconds === 0;
  const fired = React.useRef(false);

  React.useEffect(() => {
    const id = window.setInterval(() => setLeft(getTimeLeft(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  React.useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onComplete?.();
    }
  }, [done, onComplete]);

  return (
    <div role="timer" aria-label={ariaLabel} className={cn('flex w-full flex-col items-center', className)}>
      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {unitOrder.map((u, i) => (
          <motion.div
            key={u}
            initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: reduce ? 0 : i * 0.06, duration: 0.35, ease: 'easeOut' }}
            whileHover={reduce ? undefined : { y: -3 }}
            className="relative flex flex-col items-center justify-center overflow-hidden rounded border border-fg/20 bg-card px-3 py-5 text-center transition-colors hover:border-accent"
          >
            <span aria-hidden className="absolute inset-x-4 top-0 h-0.5 bg-accent" />
            <span className="text-4xl font-extrabold leading-none tracking-tight text-fg sm:text-5xl">
              <Num value={pad(left[u])} />
            </span>
            <span className="mt-3 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-accent">{LABELS[u]}</span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {done && completionMessage && (
          <motion.p initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 text-center text-3xl font-extrabold uppercase text-accent sm:text-4xl">
            {completionMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnimatedCountdown;
