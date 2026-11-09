import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// Team Showcase (from 21st.dev, "Team Showcase"), adapted for the cat leadership team:
// - the arch-topped cards are kept (that is the design); each picture is shown whole
//   (the original cropped it into a fixed box)
// - theme colours are plain hex values from the site palette (no gradients)
// - the title and the demo button are optional (this site already has a heading and a section
//   button would have nothing to do)
// - each card is focusable and shows a speech bubble with a funny quote on hover / focus
// - on small screens the row scrolls sideways with snap instead of overlapping
// ─────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  imageSrc: string;
  alt?: string;
  /** natural size of the picture, so it can be shown whole and no space jumps when it loads */
  width?: number;
  height?: number;
  /** card colour, e.g. '#E5E5E5' */
  themeColor: string;
  /** text colour on that card, e.g. '#0B0B0B' */
  textColor?: string;
  quote?: string;
}

interface TeamShowcaseProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: string;
  description?: string;
  members: TeamMember[];
}

const TeamShowcase = React.forwardRef<HTMLElement, TeamShowcaseProps>(({ title, description, members, className, ...props }, ref) => {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState<number | null>(null);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.18 } } };
  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 12 } },
  };

  return (
    <section ref={ref} className={cn('w-full', className)} {...props}>
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        {(title || description) && (
          <div className="mb-3 max-w-xl">
            {title && <h3 className="mb-3 text-3xl font-extrabold uppercase tracking-tight md:text-4xl">{title}</h3>}
            {description && <p className="text-mute">{description}</p>}
          </div>
        )}

        <motion.ul
          className="flex w-full snap-x snap-mandatory items-end gap-3 overflow-x-auto px-2 pb-2 pt-10 md:justify-center md:gap-3 md:overflow-visible"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {members.map((m, i) => {
            const open = active === i;
            return (
              <motion.li
                key={m.name}
                className="relative w-[170px] shrink-0 snap-center md:w-[calc((100%-3.75rem)/6)] md:max-w-[190px]"
                variants={cardVariants}
                whileHover={reduce ? undefined : { y: -10, scale: 1.05, zIndex: 40 }}
                style={{ zIndex: open ? 40 : members.length - i }}
              >
                <div
                  tabIndex={0}
                  role="group"
                  aria-label={`${m.name}, ${m.role}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(open ? null : i)}
                  className="relative flex cursor-pointer flex-col overflow-hidden text-center outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-accent"
                  style={{ backgroundColor: m.themeColor, color: m.textColor ?? '#0B0B0B', borderTopLeftRadius: 9999, borderTopRightRadius: 9999, borderBottomLeftRadius: 7, borderBottomRightRadius: 7 }}
                >
                  <div className="px-1.5 pb-3 pt-[4.75rem]">
                    <h4 className="text-[0.74rem] font-extrabold uppercase leading-tight tracking-tight md:text-[0.78rem]">{m.name}</h4>
                    <p className="mt-0.5 text-xs font-medium opacity-85 md:text-[0.8rem]">{m.role}</p>
                  </div>
                  {/* the whole picture, never cropped */}
                  <img src={m.imageSrc} alt={m.alt ?? m.name} width={m.width} height={m.height} draggable={false} className="block h-auto max-h-[175px] w-full object-contain" />
                </div>

                {/* speech bubble */}
                {m.quote && (
                  <motion.div
                    aria-hidden={!open}
                    initial={false}
                    animate={{ opacity: open ? 1 : 0, y: open ? 0 : 8, scale: open ? 1 : 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="pointer-events-none absolute -top-11 left-1/2 z-50 w-44 -translate-x-1/2 rounded bg-ink px-3 py-2 text-xs font-semibold leading-snug text-beige shadow-lg"
                  >
                    {m.quote}
                    <span aria-hidden className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-ink" />
                  </motion.div>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
});

TeamShowcase.displayName = 'TeamShowcase';

export { TeamShowcase };
export type { TeamMember, TeamShowcaseProps };
export default TeamShowcase;
