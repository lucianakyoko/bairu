import { DiscoverySection } from './DiscoverySection';
import { ProblemHeader } from './ProblemHeader';
import { DiscoveryChannels } from './DiscoveryChannels';

export function Problem() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProblemHeader />

        <DiscoveryChannels />

        <DiscoverySection />
      </div>
    </section>
  );
}
