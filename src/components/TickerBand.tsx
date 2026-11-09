import { Marquee } from '@/components/ui/marquee';
import type { CSSProperties } from 'react';

/** A news-ticker strip of silly headlines. The repeated copies are hidden from screen readers by Marquee. */
export default function TickerBand({ items, reverse = false, tone = 'maroon' }: { items: string[]; reverse?: boolean; tone?: 'maroon' | 'ink' }) {
  const bg = tone === 'maroon' ? 'bg-maroon text-beige' : 'bg-ink text-beige';
  return (
    <div className={`${bg} border-y border-white/15`} role="marquee" aria-label="Breaking news from the creative department">
      <Marquee reverse={reverse} className="py-3" style={{ '--duration': '38s', '--gap': '2.5rem' } as CSSProperties}>
        {items.map((t) => (
          <span key={t} className="flex shrink-0 items-center gap-10 whitespace-nowrap text-xs font-extrabold uppercase tracking-[0.22em]">
            {t}
            <span aria-hidden className="h-1.5 w-1.5 rounded bg-beige" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
