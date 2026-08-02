import { HowItWorksHeader } from './HowItWorksHeader';
import { StepsTimeline } from './StepsTimeline';

export function HowItWorks() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="container mx-auto flex max-w-7xl flex-col gap-16 px-6">
        <HowItWorksHeader />

        <StepsTimeline />
      </div>
    </section>
  );
}
