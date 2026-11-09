import { MotionConfig } from 'framer-motion';
import Footer from './components/Footer';
import FxCanvas from './components/FxCanvas';
import Header from './components/Header';
import Notifier from './components/Notifier';
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
      <FxCanvas />
      <Header showNav={begun} />
      <Notifier />
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
