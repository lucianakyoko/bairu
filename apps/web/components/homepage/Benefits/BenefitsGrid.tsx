import { benefits } from './data';
import { BenefitCard } from './BenefitCard';
import { Stagger } from '@/components/animation';
import { StaggerItem } from '@/components/animation/StaggerItem';

export function BenefitsGrid() {
  return (
    <Stagger className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {benefits.map((benefit) => (
        <StaggerItem key={benefit.title}>
          <BenefitCard benefit={benefit} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
