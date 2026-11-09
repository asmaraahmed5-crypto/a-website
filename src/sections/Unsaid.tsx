import { content } from '../data/content';
import { photos } from '../data/photos';
import { Reveal, Section, SectionHeading, Split } from '../components/Reveal';
import Photo from '../components/Photo';

const u = content.unsaid;

/** The quietest section: white space, lighter type, a single candid photograph. */
export default function Unsaid() {
  return (
    <Section id="unsaid" index={10} theme="light" className="md:py-32">
      <Split
        flip
        text={
          <>
            <SectionHeading kicker={u.kicker} title={u.title} />
            <div className="flex flex-col gap-6">
              {u.copy.map((l, i) => (
                <Reveal key={i} y={8}>
                  <p className="text-lg font-light leading-relaxed text-fg sm:text-xl">{l}</p>
                </Reveal>
              ))}
            </div>
          </>
        }
        visual={
          <Reveal y={10}>
            <Photo src={photos.founder} alt="A candid moment" hint="public/images/founder.jpg" parallax className="mx-auto aspect-[4/5] w-full max-w-md [filter:grayscale(0.35)]" />
          </Reveal>
        }
      />
    </Section>
  );
}
