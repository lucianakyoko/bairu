import { BenefitsGrid } from './BenefitsGrid';
import { BenefitsHeader } from './BenefitsHeader';

export function Benefits() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="container mx-auto flex max-w-7xl flex-col gap-16 px-6">
        <BenefitsHeader />

        <BenefitsGrid />
      </div>
    </section>
  );
}
