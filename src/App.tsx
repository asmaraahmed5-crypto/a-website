import { MotionConfig } from 'framer-motion';
import Footer from './components/Footer';
import FxCanvas from './components/FxCanvas';
import Header from './components/Header';
import Notifier from './components/Notifier';
import TickerBand from './components/TickerBand';
import { content } from './data/content';
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

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <FxCanvas />
      <Header showNav />
      <Notifier />
      <main>
        <Hero />
        <TickerBand items={content.ticker.top} tone="ink" />
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
        <TickerBand items={content.ticker.bottom} reverse tone="ink" />
        <Final />
      </main>
      <Footer />
    </MotionConfig>
  );
}
