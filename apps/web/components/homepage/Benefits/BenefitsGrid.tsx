import { benefits } from './data';
import { BenefitCard } from './BenefitCard';

export function BenefitsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {benefits.map((benefit) => (
        <BenefitCard key={benefit.title} benefit={benefit} />
      ))}
    </div>
  );
}
