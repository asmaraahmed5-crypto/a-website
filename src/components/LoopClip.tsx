import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

type Props = {
  src: string;
  /** shown while the clip loads or if it fails */
  poster?: string;
  /** accessible description of what happens in the clip */
  label: string;
  /** funny caption shown on a solid bar under the clip */
  caption?: string;
  className?: string;
  /** tailwind aspect class, e.g. aspect-[4/5] */
  aspect?: string;
  /** small sticker in the corner */
  tag?: string;
};

/**
 * A short looping video that behaves like a GIF: muted, loops, plays only while visible.
 * Respects reduced motion (starts paused) and always has a pause / play button.
 */
export default function LoopClip({ src, poster, label, caption, className = '', aspect = 'aspect-video', tag = 'GIF' }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  // play only while on screen (saves battery) unless the visitor paused it
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce && !userPaused) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce, userPaused]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      void v.play().catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  return (
    <figure className={`group relative overflow-hidden rounded border border-fg/20 bg-ink ${className}`}>
      <div className={`relative w-full ${aspect}`}>
        {failed ? (
          <div role="img" aria-label={label} className="grid h-full w-full place-items-center bg-card p-4 text-center text-sm font-medium text-mute">
            {label}
          </div>
        ) : (
          <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={label}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="pointer-events-none absolute left-2 top-2 rounded bg-ink px-2 py-0.5 text-[0.62rem] font-extrabold tracking-[0.2em] text-beige">{tag}</span>
        {!failed && (
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause clip' : 'Play clip'}
            className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded bg-ink/80 text-white opacity-90 transition hover:bg-ink"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
        )}
      </div>
      {caption && <figcaption className="bg-ink px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-beige">{caption}</figcaption>}
    </figure>
  );
}
