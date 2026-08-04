import { BenefitsGrid } from './BenefitsGrid';
import { BenefitsHeader } from './BenefitsHeader';

export function Benefits() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BenefitsHeader />

        <BenefitsGrid />
      </div>
    </section>
  );
}
