import { MissionContent } from './MissionContent';
import { MissionHighlight } from './MissionHighlight';

export function Mission() {
  return (
    <section className="border-b border-border bg-primary py-24 text-primary-foreground">
      <div className="container mx-auto flex max-w-4xl flex-col gap-16 px-6">
        <MissionContent />

        <MissionHighlight />
      </div>
    </section>
  );
}
