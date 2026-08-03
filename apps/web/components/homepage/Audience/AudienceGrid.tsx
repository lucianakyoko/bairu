import { AudienceCard } from './AudienceCard';
import { audiences } from './data';

export function AudienceGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {audiences.map((audience) => (
        <AudienceCard key={audience.title} audience={audience} />
      ))}
    </div>
  );
}
