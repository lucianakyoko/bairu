import { FadeUp } from '@/components/animation';
import { MissionContent } from './MissionContent';
import { MissionHighlight } from './MissionHighlight';

export function Mission() {
  return (
    <FadeUp>
      <section className="border-b border-border bg-primary py-24 text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          <MissionContent />

          <MissionHighlight />
        </div>
      </section>
    </FadeUp>
  );
}
