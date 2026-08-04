import { BeforeAfterComparison } from './BeforeAfterComparison';
import { SolutionHeader } from './SolutionHeader';

export function Solution() {
  return (
    <section className="bg-background">
      <div className="mx-auto flex flex-col gap-16 border-none bg-background lg:px-16 py-12 md:py-16 lg:py-20">
        <SolutionHeader />

        <BeforeAfterComparison />
      </div>
    </section>
  );
}
