import Nav from '@/components/ui/Nav';
import StickyBar from '@/components/ui/StickyBar';
import Reveal from '@/components/ui/Reveal';
import Hero from './Hero';
import QualifySection from './QualifySection';
import Clients from './Clients';
import HowItWorks from './HowItWorks';
import Team from './Team';
import Shift from './Shift';
import Testimonials from './Testimonials';
import Closing from './Closing';
import Footer from './Footer';
import type { Offer } from '@/lib/offers';

/** One landing page, any offer. Design is shared; copy, questions and gates come from lib/offers/<slug>. */
export default function OfferPage({ offer }: { offer: Offer }) {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero offer={offer} />
        <QualifySection offer={offer} />
        <Clients />
        <HowItWorks offer={offer} />
        <Team offer={offer} />
        <Shift offer={offer} />
        <Testimonials />
        <Closing offer={offer} />
      </main>
      <StickyBar note={offer.stickyNote} />
      <Footer />
      <Reveal />
    </>
  );
}
