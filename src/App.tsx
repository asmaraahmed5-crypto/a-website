import { MotionConfig } from 'framer-motion';
import CursorGlow from './components/CursorGlow';
import Footer from './components/Footer';
import FxCanvas from './components/FxCanvas';
import Nav from './components/Nav';
import Notifier from './components/Notifier';
import SoundToggle from './components/SoundToggle';
import Hero from './sections/Hero';
import Bumble from './sections/Bumble';
import PromiseSection from './sections/Promise';
import Note from './sections/Note';
import Overthinking from './sections/Overthinking';
import Appreciation from './sections/Appreciation';
import Don from './sections/Don';
import Cats from './sections/Cats';
import Compliance from './sections/Compliance';
import Unsaid from './sections/Unsaid';
import Countdown from './sections/Countdown';
import Final from './sections/Final';
import { useSaved } from './lib/store';

export default function App() {
  const { begun } = useSaved();
  return (
    <MotionConfig reducedMotion="user">
      <FxCanvas ambient={begun} />
      <CursorGlow />
      <SoundToggle />
      <Notifier />
      {begun && <Nav />}
      <main>
        <Hero />
        {begun && (
          <>
            <Bumble />
            <PromiseSection />
            <Note />
            <Overthinking />
            <Appreciation />
            <Don />
            <Cats />
            <Compliance />
            <Unsaid />
            <Countdown />
            <Final />
          </>
        )}
      </main>
      {begun && <Footer />}
    </MotionConfig>
  );
}
