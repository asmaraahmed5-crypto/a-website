import { RotateCcw } from 'lucide-react';
import { content } from '../data/content';
import { EGG_COUNT, foundEgg, resetSaved, useSaved } from '../lib/store';

export default function Footer() {
  const { eggs } = useSaved();
  return (
    <footer className="relative border-t border-gold/15 px-5 py-14 text-center">
      <p className="font-display text-lg italic text-mute">{content.footer.line}</p>
      <p className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-dim">
        Secrets found · <span className="text-gold">{eggs.length}</span> / {EGG_COUNT}
      </p>
      <button
        type="button"
        onClick={() => {
          resetSaved();
          window.scrollTo({ top: 0 });
          window.location.reload();
        }}
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-xs uppercase tracking-[0.2em] text-mute hover:text-champagne"
      >
        <RotateCcw size={14} /> {content.footer.replay}
      </button>
      {/* easter egg 3: tiny gold button */}
      <button
        type="button"
        aria-label="Tiny gold button"
        onClick={() => foundEgg('footer', 'secret', content.eggs.footer.title, content.eggs.footer.body)}
        className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center"
      >
        <span className="block h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_10px_#C6A56B] transition hover:scale-150" />
      </button>
    </footer>
  );
}
