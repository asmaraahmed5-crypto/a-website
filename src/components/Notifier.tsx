import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, Sparkles, X } from 'lucide-react';
import { dismiss, useNotes } from '../lib/notifications';

/** Fake company / system notifications and easter-egg messages. */
export default function Notifier() {
  const notes = useNotes();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:right-5 sm:items-end" aria-live="polite">
      <AnimatePresence>
        {notes.map((n) => (
          <motion.div
            key={n.id}
            role="status"
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded border-l-4 border-beige bg-ink p-4 text-white shadow-xl"
          >
            <span className="mt-0.5 text-beige">{n.kind === 'secret' ? <Sparkles size={18} /> : <BellRing size={18} />}</span>
            <div className="flex-1">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-beige">{n.title}</p>
              <p className="mt-1 text-sm leading-snug text-white">{n.body}</p>
            </div>
            <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(n.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded text-white/70 hover:text-white">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
