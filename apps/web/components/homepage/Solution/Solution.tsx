import { BeforeAfterComparison } from './BeforeAfterComparison';
import { SolutionHeader } from './SolutionHeader';

export function Solution() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-16">
        <SolutionHeader />

        <BeforeAfterComparison />
      </div>
    </section>
  );
}
