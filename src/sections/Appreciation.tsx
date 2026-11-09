import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Hand } from 'lucide-react';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading } from '../components/Reveal';
import GoldButton from '../components/GoldButton';
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

  return (
    <Section id="appreciation" index={6}>
      <SectionHeading kicker={a.kicker} title={a.title} />

      <div className="grid items-start gap-12 md:grid-cols-5">
        <Reveal className="md:col-span-2 md:sticky md:top-24">
          <div className="card overflow-hidden">
            <Photo src={photos.business} alt="The Founder and CEO at work" hint="public/images/business.jpg" parallax className="aspect-[4/5] w-full" />
            <div className="border-t border-gold/20 p-6">
              <p className="kicker mb-4">Official report card</p>
              <ul className="flex flex-col gap-4">
                {a.metrics.map((m, i) => (
                  <li key={m.label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-ivory/85">{m.label}</span>
                      <span className="text-gold">{m.display}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-charcoal">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold-soft"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="md:col-span-3">
          <Lines lines={a.copy} lineClass="body-copy sm:text-lg" />

          <Reveal className="mt-12">
            <div className="flex flex-col items-start gap-8">
              <div className="flex gap-3 text-gold" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span key={i} animate={unlocked ? { y: [0, -10, 0], rotate: [0, -8, 8, 0] } : {}} transition={{ duration: 0.6, repeat: unlocked ? 5 : 0, delay: i * 0.08 }}>
                    <Hand size={22} />
                  </motion.span>
                ))}
              </div>
              <GoldButton onClick={unlock}>{a.button}</GoldButton>
              <AnimatePresence>
                {unlocked && (
                  <motion.div
                    ref={badgeRef}
                    initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                    className="flex items-center gap-4 rounded-2xl border border-gold bg-gradient-to-br from-gold/20 to-transparent p-5 shadow-[0_0_50px_rgba(198,165,107,0.25)]"
                    role="status"
                  >
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-b from-gold-soft to-gold text-midnight">
                      <Award size={28} />
                    </span>
                    <div>
                      <p className="kicker">{a.badgeTitle}</p>
                      <p className="mt-1 font-serif text-lg text-champagne">{a.badge}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
