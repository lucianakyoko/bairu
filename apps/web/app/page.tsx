import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/homepage/Hero';
import { Problem } from '@/components/homepage/Problem/Problem';
import { Solution } from '@/components/homepage/Solution/Solution';
import { Benefits } from '@/components/homepage/Benefits';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { Audience } from '@/components/homepage/Audience';
import { Mission } from '@/components/homepage/Mission';
import { CTA } from '@/components/homepage/CTA';
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
