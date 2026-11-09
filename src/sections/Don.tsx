import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, PhoneOff } from 'lucide-react';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Lines, Reveal, Section, SectionHeading } from '../components/Reveal';
import GoldButton from '../components/GoldButton';
import Photo from '../components/Photo';
import { sfx } from '../lib/audio';

const d = content.don;

export default function Don() {
  const [calling, setCalling] = useState(false);
  const [reply, setReply] = useState<string | null>(null);

  return (
    <Section id="don" index={7} className="bg-[radial-gradient(ellipse_at_50%_0%,rgba(198,165,107,0.08),transparent_60%)]">
      <SectionHeading kicker={d.kicker} title={d.title} />

      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal y={60}>
          <div className="relative mx-auto max-w-sm">
            <motion.div initial={{ scale: 1.15, filter: 'grayscale(1) contrast(1.2)' }} whileInView={{ scale: 1, filter: 'grayscale(0.2) contrast(1.05)' }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
              <Photo src={photos.funny} alt="The Founder, looking suspiciously like a Don" hint="public/images/funny.jpg" className="aspect-[4/5] w-full rounded-2xl" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 3, rotate: -30 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 1.1 }}
              className="stamp absolute -bottom-5 -right-3 bg-midnight/80 px-5 py-2 font-serif text-4xl text-gold shadow-[0_0_40px_rgba(198,165,107,0.3)] sm:-right-8 sm:text-5xl"
            >
              DON
            </motion.div>
          </div>
        </Reveal>

        <div>
          <Lines lines={d.intro} lineClass="font-display text-2xl text-ivory/90" gap="gap-3" />
          <ul className="mb-10 mt-6 flex flex-col gap-3">
            {d.services.map((s, i) => (
              <motion.li key={s} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }} className="flex gap-3 text-ivory/85">
                <span aria-hidden className="mt-2.5 h-px w-5 shrink-0 bg-gold" />
                {s}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <Lines lines={d.copy} className="mx-auto mt-16 max-w-2xl" lineClass="body-copy text-center sm:text-lg" />

      <Reveal className="mt-14">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6">
          {!calling ? (
            <GoldButton
              onClick={() => {
                setCalling(true);
                setReply(null);
              }}
            >
              <Phone size={16} /> {d.hotline}
            </GoldButton>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="card w-full p-6 text-left" role="dialog" aria-label={d.hotline}>
                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-gold" /> Line open
                </div>
                <div className="flex flex-col gap-2 text-ivory/90">
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
                      className="flex min-h-12 items-center gap-3 rounded-xl border border-gold/25 px-4 text-left text-sm transition hover:border-gold hover:bg-gold/10"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-xs font-bold text-midnight">{opt.key}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {reply && (
                    <motion.p key={reply} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 border-l-2 border-gold pl-4 font-display text-xl italic text-champagne" aria-live="polite">
                      {reply}
                    </motion.p>
                  )}
                </AnimatePresence>
                <button type="button" onClick={() => setCalling(false)} className="mt-6 inline-flex min-h-11 items-center gap-2 text-xs uppercase tracking-[0.2em] text-mute hover:text-ivory">
                  <PhoneOff size={14} /> Hang up
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
