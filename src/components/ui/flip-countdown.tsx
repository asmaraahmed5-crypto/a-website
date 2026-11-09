import React, { useEffect, useMemo, useState } from 'react';

// ─────────────────────────────────────────────────────────────
// Flip Countdown (from 21st.dev, "FlipCountdown" by easemize / jahed).
// FlipUnit is the supplied split-flap digit; I corrected which half shows which digit mid-flip (the original showed old-top over new-bottom, which looked like a wrong number for half a second). The supplied FlipCountdown counts a
// single number, so DateFlipCountdown below builds days / hours / minutes / seconds out of the
// same digits, with a label under each group. Card styles live in src/styles/index.css.
// ─────────────────────────────────────────────────────────────

// A simple utility for conditional class names
const cn = (...inputs: (string | undefined | null | boolean)[]) => inputs.filter(Boolean).join(' ');

// Internal component for a single digit.
const FlipUnit = ({ digit, cardStyle }: { digit: string; cardStyle: React.CSSProperties }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [previousDigit, setPreviousDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setPreviousDigit(currentDigit);
      setCurrentDigit(digit);
      setIsFlipping(true);
    }
  }, [digit, currentDigit]);

  const handleAnimationEnd = () => {
    setIsFlipping(false);
    setPreviousDigit(digit);
  };

  return (
    <div className="flip-unit" style={cardStyle}>
      {/* new digit waits behind the flipper on top; the old bottom stays until the flipper lands */}
      <div className="flip-card flip-card__bottom">{isFlipping ? previousDigit : currentDigit}</div>
      <div className="flip-card flip-card__top">{currentDigit}</div>
      <div className={cn('flipper', isFlipping && 'is-flipping')} onAnimationEnd={handleAnimationEnd}>
        <div className="flip-card flipper__top">{previousDigit}</div>
        <div className="flip-card flipper__bottom">{currentDigit}</div>
      </div>
    </div>
  );
};

/** One row of flipping digits for a number, zero-padded to `digits`. */
export function FlipNumber({ value, digits, cardBgColor, textColor, className }: { value: number; digits: number; cardBgColor?: string; textColor?: string; className?: string }) {
  const cardStyle = { '--flip-card-bg': cardBgColor, '--flip-card-text': textColor } as React.CSSProperties;
  const text = String(Math.max(0, value)).padStart(digits, '0');
  return (
    <div className={cn('flip-countdown-container', className)} aria-hidden>
      {text.split('').map((d, i) => (
        <FlipUnit key={i} digit={d} cardStyle={cardStyle} />
      ))}
    </div>
  );
}

type Left = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function calc(target: number): Left {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const s = Math.floor(diff / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60, done: false };
}

/** Flip-style days / hours / minutes / seconds counter with a label under each group. */
export function DateFlipCountdown({
  targetDate,
  className,
  cardBgColor,
  textColor,
  labelClassName,
  doneMessage = 'The big day has arrived',
}: {
  targetDate: Date | string | number;
  className?: string;
  cardBgColor?: string;
  textColor?: string;
  labelClassName?: string;
  doneMessage?: string;
}) {
  const target = useMemo(() => (targetDate instanceof Date ? targetDate.getTime() : new Date(targetDate).getTime()), [targetDate]);
  const [left, setLeft] = useState(() => calc(target));
  useEffect(() => {
    const id = window.setInterval(() => setLeft(calc(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const groups: [string, number, number][] = [
    ['Days', left.days, left.days > 99 ? 3 : 2],
    ['Hours', left.hours, 2],
    ['Minutes', left.minutes, 2],
    ['Seconds', left.seconds, 2],
  ];

  if (left.done) {
    return (
      <p role="timer" className={cn('text-lg font-extrabold uppercase tracking-[0.12em] text-beige', className)}>
        {doneMessage}
      </p>
    );
  }

  return (
    <div role="timer" aria-label={`${left.days} days, ${left.hours} hours, ${left.minutes} minutes and ${left.seconds} seconds until the big day`} className={cn('flex items-start gap-2 sm:gap-4 md:gap-5', className)}>
      {groups.map(([label, value, digits], i) => (
        <React.Fragment key={label}>
          {i > 0 && (
            <span aria-hidden className="flip-colon">
              :
            </span>
          )}
          <div className="flex flex-col items-center gap-2">
            <FlipNumber value={value} digits={digits} cardBgColor={cardBgColor} textColor={textColor} />
            <span className={cn('text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/85 sm:text-xs sm:tracking-[0.22em] md:text-sm', labelClassName)}>{label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default DateFlipCountdown;
