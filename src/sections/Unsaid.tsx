import { content } from '../data/content';
import { photos } from '../data/photos';
import { Reveal, Section, SectionHeading } from '../components/Reveal';
import Photo from '../components/Photo';

const u = content.unsaid;

/** The quietest section: more space, softer light, almost no gold. */
export default function Unsaid() {
  return (
    <Section id="unsaid" index={10} narrow className="bg-gradient-to-b from-transparent via-[#0e0d0b] to-transparent py-32 md:py-48">
      <SectionHeading kicker={u.kicker} title={u.title} />
      <Reveal y={10}>
        <Photo src={photos.founder} alt="A candid moment" hint="public/images/founder.jpg" parallax className="mx-auto mb-20 aspect-[4/5] w-full max-w-xs rounded-[3rem_3rem_1rem_1rem] opacity-90 [filter:saturate(0.8)_brightness(0.95)] sm:max-w-sm" />
      </Reveal>
      <div className="flex flex-col gap-7 text-center">
        {u.copy.map((l, i) => (
          <Reveal key={i} y={8} delay={0.05}>
            <p className="font-display text-[1.45rem] leading-snug text-ivory/80 sm:text-2xl">{l}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
