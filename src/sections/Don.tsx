import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, PhoneOff } from 'lucide-react';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading, Split } from '../components/Reveal';
import Button from '../components/Button';
import Photo from '../components/Photo';
import { sfx } from '../lib/audio';

const d = content.don;

export default function Don() {
  const [calling, setCalling] = useState(false);
  const [reply, setReply] = useState<string | null>(null);

  const text = (
    <>
      <SectionHeading kicker={d.kicker} title={d.title} />
      <Lines lines={d.intro} lineClass="text-lg font-semibold" gap="gap-2" />
      <ul className="mb-10 mt-5 flex flex-col gap-3">
        {d.services.map((s, i) => (
          <motion.li key={s} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }} className="flex gap-3 text-fg/90">
            <span aria-hidden className="mt-2.5 h-0.5 w-5 shrink-0 bg-accent" />
            {s}
          </motion.li>
        ))}
      </ul>
      <Lines lines={d.copy} />

      <Reveal className="mt-10">
        {!calling ? (
          <Button
            onClick={() => {
              setCalling(true);
              setReply(null);
            }}
          >
            <Phone size={16} /> {d.hotline}
          </Button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card w-full p-6" role="dialog" aria-label={d.hotline}>
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
              <span className="h-2.5 w-2.5 animate-pulse rounded bg-accent" /> Line open
            </div>
            <div className="flex flex-col gap-2">
              {d.hotlineLines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              {d.options.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    sfx.click();
                    setReply(opt.reply);
                  }}
                  className="flex min-h-12 items-center gap-3 rounded border border-fg/25 px-4 text-left text-sm font-medium transition hover:border-accent hover:text-accent"
                >
                  <span className="grid h-7 w-7 place-items-center rounded bg-accent text-xs font-extrabold text-onaccent">{opt.key}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {reply && (
                <motion.p key={reply} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 border-l-4 border-accent pl-4 text-base font-semibold" aria-live="polite">
                  {reply}
                </motion.p>
              )}
            </AnimatePresence>
            <button type="button" onClick={() => setCalling(false)} className="mt-6 inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-mute hover:text-fg">
              <PhoneOff size={14} /> Hang up
            </button>
          </motion.div>
        )}
      </Reveal>
    </>
  );

  const visual = (
    <Reveal y={50}>
      <div className="relative mx-auto max-w-md">
        <motion.div initial={{ scale: 1.1, filter: 'grayscale(1)' }} whileInView={{ scale: 1, filter: 'grayscale(0)' }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
          <Photo src={photos.funny} alt="The Founder, looking suspiciously like a Don" hint="public/images/funny.jpg" className="aspect-[4/5] w-full" />
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 3, rotate: -28 }} whileInView={{ opacity: 1, scale: 1, rotate: -10 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 1 }} className="stamp absolute -bottom-5 -right-2 bg-beige px-6 py-2 text-4xl text-maroon sm:-right-6 sm:text-5xl">
          DON
        </motion.div>
      </div>
    </Reveal>
  );

  return (
    <Section id="don" index={7} theme="dark">
      <Split text={text} visual={visual} />
    </Section>
  );
}
