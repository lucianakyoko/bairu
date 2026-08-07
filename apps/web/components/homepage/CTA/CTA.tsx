import { CTAContent } from './CTAContent';
import { CTABackground } from './CTABackground';
import { FadeUp } from '@/components/animation';

export function CTA() {
  return (
    <FadeUp>
      <section className="relative overflow-hidden border-b border-border bg-background py-24">
        <CTABackground />

        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-surface px-8 py-16 shadow-sm md:px-16">
            <CTAContent />
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
