import { Stagger } from '@/components/animation';
import { AudienceCard } from './AudienceCard';
import { audiences } from './data';
import { StaggerItem } from '@/components/animation/StaggerItem';

export function AudienceGrid() {
  return (
    <Stagger className="grid gap-6 md:grid-cols-3 mt-6">
      {audiences.map((audience) => (
        <StaggerItem key={audience.title}>
          <AudienceCard audience={audience} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
