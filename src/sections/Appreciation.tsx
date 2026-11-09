import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Hand } from 'lucide-react';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading, Split } from '../components/Reveal';
import Button from '../components/Button';
import Photo from '../components/Photo';
import { burstFrom } from '../lib/fx';
import { sfx } from '../lib/audio';

const a = content.appreciation;

export default function Appreciation() {
  const [unlocked, setUnlocked] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const unlock = () => {
    if (unlocked) return;
    setUnlocked(true);
    sfx.chime();
    window.setTimeout(() => burstFrom(badgeRef.current, 120), 250);
  };

  const visual = (
    <Reveal>
      <div className="card overflow-hidden">
        <Photo src={photos.business} alt="The Founder and CEO at work" hint="public/images/business.jpg" parallax className="aspect-[4/5] w-full !rounded-none" />
        <div className="border-t border-fg/15 p-6">
          <p className="kicker mb-4">Official report card</p>
          <ul className="flex flex-col gap-4">
            {a.metrics.map((m, i) => (
              <li key={m.label}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{m.label}</span>
                  <span className="font-bold text-accent">{m.display}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded bg-fg/10">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.value}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }} className="h-full bg-accent" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );

  const text = (
    <>
      <SectionHeading kicker={a.kicker} title={a.title} />
      <Lines lines={a.copy} />
      <Reveal className="mt-10">
        <div className="flex flex-col items-start gap-6">
          <div className="flex gap-3 text-accent" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span key={i} animate={unlocked ? { y: [0, -10, 0], rotate: [0, -8, 8, 0] } : {}} transition={{ duration: 0.6, repeat: unlocked ? 5 : 0, delay: i * 0.08 }}>
                <Hand size={22} />
              </motion.span>
            ))}
          </div>
          <Button onClick={unlock}>{a.button}</Button>
          <AnimatePresence>
            {unlocked && (
              <motion.div ref={badgeRef} initial={{ opacity: 0, scale: 0.7, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }} className="flex items-center gap-4 rounded border-2 border-accent bg-card p-5" role="status">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded bg-accent text-onaccent">
                  <Award size={28} />
                </span>
                <div>
                  <p className="kicker">{a.badgeTitle}</p>
                  <p className="mt-1 text-base font-bold">{a.badge}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </>
  );

  return (
    <Section id="appreciation" index={6} theme="beige">
      <Split flip text={text} visual={visual} />
    </Section>
  );
}
