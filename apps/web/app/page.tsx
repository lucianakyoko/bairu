import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/homepage/Hero';
import { Problem } from '@/components/homepage/Problem/Problem';
import { Solution } from '@/components/homepage/Solution/Solution';
import { Benefits } from '@/components/homepage/Benefits/Benefits';
import { HowItWorks } from '@/components/homepage/HowItWorks/HowItWorks';
import { Audience } from '@/components/homepage/Audience/Audience';
import { Mission } from '@/components/homepage/Mission/Mission';
import { CTA } from '@/components/homepage/CTA/CTA';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Problem />
        <Solution />
        <Benefits />
        <HowItWorks />
        <Audience />
        <Mission />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
