import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Building2, PawPrint, User } from 'lucide-react';

type Props = {
  src?: string;
  alt: string;
  /** file name shown to the creator (dev only) while the photo is missing */
  hint?: string;
  kind?: 'person' | 'cat' | 'logo';
  className?: string;
  parallax?: boolean;
  imgClassName?: string;
};

/** A photo that never shows a broken image: a missing file becomes a clean placeholder. */
export default function Photo({ src, alt, hint, kind = 'person', className = '', parallax = false, imgClassName = '' }: Props) {
  const [failed, setFailed] = useState(!src);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  const Icon = kind === 'cat' ? PawPrint : kind === 'logo' ? Building2 : User;

  return (
    <div ref={ref} className={`relative overflow-hidden rounded bg-card ${className}`}>
      {!failed && src ? (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
          style={parallax && !reduce ? { y, scale: 1.14 } : undefined}
        />
      ) : (
        <div role="img" aria-label={alt} className="flex h-full w-full flex-col items-center justify-center gap-3 bg-card p-4 text-center">
          <Icon className="h-10 w-10 text-accent" strokeWidth={1.4} aria-hidden />
          <span className="text-sm font-medium text-mute">Photo coming soon</span>
          {import.meta.env.DEV && hint && <span className="text-[10px] tracking-wider text-mute">{hint}</span>}
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 rounded ring-1 ring-inset ring-fg/15" />
    </div>
  );
}
