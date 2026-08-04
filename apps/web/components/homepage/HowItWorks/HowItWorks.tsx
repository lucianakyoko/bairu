import { HowItWorksHeader } from './HowItWorksHeader';
import { StepsTimeline } from './StepsTimeline';

export function HowItWorks() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HowItWorksHeader />

        <StepsTimeline />
      </div>
    </section>
  );
}
