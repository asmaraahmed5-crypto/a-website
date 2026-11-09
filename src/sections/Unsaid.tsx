import { content } from '../data/content';
import { Lines, Reveal, Section, SectionHeading, Split } from '../components/Reveal';
import TypingChat from '../components/TypingChat';

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
            <Lines lines={u.copy} budget={150} gap="gap-5" lineClass="text-lg font-light leading-relaxed text-fg" />
          </>
        }
        visual={
          <Reveal y={10}>
            <TypingChat contactName={u.chat.contactName} label={u.chat.label} caption={u.chat.caption} history={u.chat.history} drafts={u.chat.drafts} className="mx-auto w-full max-w-sm" />
          </Reveal>
        }
      />
    </Section>
  );
}
