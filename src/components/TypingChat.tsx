import { SendHorizontal } from 'lucide-react';
import { TypeWriter } from '@/components/ui/hero-designali';

type Props = {
  /** accessible description of what the animation shows */
  label: string;
  /** funny caption under the phone */
  caption?: string;
  /** chat history shown above the draft */
  history: { from: 'me' | 'them'; text: string }[];
  /** drafts that are typed and deleted again and again */
  drafts: string[];
  contactName: string;
  className?: string;
};

/**
 * An original looping animation: a chat where a message is typed, deleted and retyped, never sent.
 * Black and white. The typing is skipped for reduced motion (the first draft is shown still).
 */
export default function TypingChat({ label, caption, history, drafts, contactName, className = '' }: Props) {
  return (
    <figure className={`overflow-hidden rounded border border-fg/20 bg-ink ${className}`}>
      <div role="img" aria-label={label} className="flex aspect-[4/5] w-full flex-col bg-[#1C1C1C] text-white">
        {/* header */}
        <div className="flex items-center gap-3 border-b border-white/15 px-4 py-3">
          <span className="grid h-10 w-10 place-items-center rounded bg-white text-xs font-extrabold text-ink">CEO</span>
          <div className="leading-tight">
            <p className="text-sm font-bold">{contactName}</p>
            <p className="flex items-center gap-1 text-xs text-white/70">
              typing
              <span className="inline-flex gap-0.5" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1 w-1 animate-bounce rounded bg-white/80" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            </p>
          </div>
        </div>

        {/* history */}
        <div className="flex flex-1 flex-col justify-end gap-3 px-4 py-4">
          {history.map((m, i) => (
            <div key={i} className={`max-w-[80%] rounded px-3 py-2 text-sm leading-snug ${m.from === 'me' ? 'self-end bg-white text-ink' : 'self-start bg-white/15 text-white'}`}>
              {m.text}
            </div>
          ))}
        </div>

        {/* draft (typed, deleted, retyped) */}
        <div className="flex items-center gap-2 border-t border-white/15 p-3">
          <div className="min-h-11 flex-1 rounded border border-white/25 bg-white/10 px-3 py-2.5 text-sm text-white">
            <TypeWriter strings={drafts} typeSpeed={70} backSpeed={28} hold={1100} />
          </div>
          <span aria-hidden className="grid h-11 w-11 place-items-center rounded bg-white/20 text-white/60">
            <SendHorizontal size={18} />
          </span>
        </div>
      </div>
      {caption && <figcaption className="bg-ink px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-beige">{caption}</figcaption>}
    </figure>
  );
}
