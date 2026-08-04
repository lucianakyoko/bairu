import { AudienceFooter } from './AudienceFooter';
import { AudienceGrid } from './AudienceGrid';
import { AudienceHeader } from './AudienceHeader';

export function Audience() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AudienceHeader />

        <AudienceGrid />

        <AudienceFooter />
      </div>
    </section>
  );
}
