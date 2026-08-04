import { HeroActions } from '@/components/homepage/Hero/HeroActions';
import { HeroHeading } from '@/components/homepage/Hero/HeroHeading';
import { HeroPreview } from '@/components/homepage/Hero/HeroPreview';

export function Hero() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="space-y-8">
          <HeroHeading
            title="Seu negócio merece ser encontrado."
            description="Crie uma presença digital simples e facilite que novos clientes encontrem seu negócio quando realmente precisarem."
          />

          <HeroActions />
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}
