import { AudienceFooter } from './AudienceFooter';
import { AudienceGrid } from './AudienceGrid';
import { AudienceHeader } from './AudienceHeader';

export function Audience() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="container mx-auto flex max-w-7xl flex-col gap-16 px-6">
        <AudienceHeader />

        <AudienceGrid />

        <AudienceFooter />
      </div>
    </section>
  );
}
