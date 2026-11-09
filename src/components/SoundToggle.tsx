import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { setSound } from '../lib/audio';

/** Muted by default. Sound only starts after the visitor presses this button. */
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? 'Mute sound' : 'Turn on sound'}
      onClick={() => {
        const next = !on;
        setOn(next);
        setSound(next);
      }}
      className="fixed right-4 top-3 z-[66] flex h-11 items-center gap-2 rounded-full border border-gold/30 bg-midnight/70 px-4 text-[0.62rem] uppercase tracking-[0.25em] text-champagne backdrop-blur transition-colors hover:border-gold sm:right-6"
    >
      {on ? <Volume2 size={16} className="text-gold" /> : <VolumeX size={16} className="text-mute" />}
      <span className="hidden sm:inline">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
