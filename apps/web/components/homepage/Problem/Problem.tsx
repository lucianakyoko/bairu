import { DiscoverySection } from './DiscoverySection';
import { ProblemHeader } from './ProblemHeader';
import { DiscoveryChannels } from './DiscoveryChannels';

export function Problem() {
  return (
    <section className="border-b border-border bg-surface py-16">
      <div className="container mx-auto space-y-12 px-6">
        <ProblemHeader />

        <DiscoveryChannels />

        <DiscoverySection />
      </div>
    </section>
  );
}
