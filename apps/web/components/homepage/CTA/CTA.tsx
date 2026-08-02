import { CTAContent } from './CTAContent';
import { CTABackground } from './CTABackground';

export function CTA() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-24">
      <CTABackground />

      <div className="container relative z-10 mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-border bg-card px-8 py-16 shadow-sm md:px-16">
          <CTAContent />
        </div>
      </div>
    </section>
  );
}
