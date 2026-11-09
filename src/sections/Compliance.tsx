import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Check, ShieldAlert, ShieldCheck } from 'lucide-react';
import { content } from '../data/content';
import { photos } from '../data/photos';
import { Reveal, Section, SectionHeading } from '../components/Reveal';
import Photo from '../components/Photo';
import { burst } from '../lib/fx';
import { sfx } from '../lib/audio';
import { foundEgg, setSaved, useSaved } from '../lib/store';

const c = content.compliance;

export default function Compliance() {
  const { checks } = useSaved();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -30% 0px' });

  // easter egg 5: a fake system notification the first time this notice is read
  useEffect(() => {
    if (!seen) return;
    const t = window.setTimeout(() => foundEgg('restart', 'system', c.egg5.title, c.egg5.body), 2500);
    return () => window.clearTimeout(t);
  }, [seen]);

  const total = c.items.length;
  const done = checks.length;
  const score = Math.round((done / total) * 100);
  const full = done === total;

  const toggle = (id: string) => {
    sfx.click();
    const next = checks.includes(id) ? checks.filter((x) => x !== id) : [...checks, id];
    setSaved({ checks: next });
    if (next.length === total) {
      sfx.chime();
      burst(undefined, undefined, 120);
    }
  };

  return (
    <Section id="compliance" index={9} narrow>
      <div ref={ref}>
        <SectionHeading kicker={c.kicker} title={c.title} />

        <Reveal>
          <div className="card relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-gold/20 bg-gold/5 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative grid h-3 w-3 place-items-center" aria-hidden>
                  {!full && <span className="absolute h-3 w-3 animate-ping rounded-full bg-alert/60" />}
                  <span className={`h-2.5 w-2.5 rounded-full ${full ? 'bg-gold' : 'bg-alert'}`} />
                </span>
                <p className="text-[0.68rem] uppercase tracking-[0.25em] text-champagne">{full ? 'Compliant' : 'Non-compliant'}</p>
              </div>
              {full ? <ShieldCheck className="text-gold" size={20} /> : <ShieldAlert className="text-alert" size={20} />}
            </div>

            <Photo src={photos.funny} alt="The Founder, mid-compliance review" hint="public/images/funny.jpg" parallax className="aspect-[16/9] w-full" />

            <div className="p-5 sm:p-8">
              <p className="mb-6 text-ivory/85">{c.intro}</p>
              <ol className="flex flex-col gap-3">
                {c.items.map((it, i) => {
                  const on = checks.includes(it.id);
                  return (
                    <li key={it.id}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        onClick={() => toggle(it.id)}
                        className={`flex w-full gap-4 rounded-xl border p-4 text-left transition-colors duration-300 ${on ? 'border-gold bg-gold/10' : 'border-gold/20 hover:border-gold/50'}`}
                      >
                        <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border ${on ? 'border-gold bg-gold text-midnight' : 'border-gold/40'}`}>
                          <AnimatePresence>
                            {on && (
                              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                                <Check size={18} strokeWidth={3} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        <span>
                          <span className={`block font-serif text-lg ${on ? 'text-champagne line-through decoration-gold/60' : 'text-ivory'}`}>
                            {i + 1}. {it.title}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-mute">{it.text}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-8 border-t border-gold/20 pt-6">
                <div className="flex items-end justify-between">
                  <p className="kicker">{c.scoreLabel}</p>
                  <p className="font-serif text-4xl text-champagne" aria-live="polite">
                    {score}%
                  </p>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-charcoal ring-1 ring-gold/20" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label={c.scoreLabel}>
                  <motion.div animate={{ width: `${score}%` }} transition={{ type: 'spring', stiffness: 80, damping: 16 }} className={`h-full rounded-full ${full ? 'bg-gradient-to-r from-gold to-champagne' : 'bg-gradient-to-r from-alert to-gold'}`} />
                </div>
                <p className="mt-4 min-h-[3rem] font-display text-xl italic text-ivory/90" aria-live="polite">
                  {c.feedback[done]}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
