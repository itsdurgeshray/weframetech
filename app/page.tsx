import Nav from '@/components/ui/Nav';
import StickyBar from '@/components/ui/StickyBar';
import Reveal from '@/components/ui/Reveal';
import Hero from '@/components/home/Hero';
import QualifySection from '@/components/home/QualifySection';
import Clients from '@/components/home/Clients';
import HowItWorks from '@/components/home/HowItWorks';
import Team from '@/components/home/Team';
import Testimonials from '@/components/home/Testimonials';
import Closing from '@/components/home/Closing';
import Footer from '@/components/home/Footer';
import './home.css';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <QualifySection />
        <Clients />
        <HowItWorks />
        <Team />
        <Testimonials />
        <Closing />
      </main>
      <StickyBar />
      <Footer />
      <Reveal />
    </>
  );
}
