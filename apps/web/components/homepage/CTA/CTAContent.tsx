import { CTAButton } from './CTAButton';

export function CTAContent() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <span className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-text-muted">
        Próximo passo.
      </span>

      <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
        Seu negócio merece ser encontrado.
      </h2>

      <p className="mt-6 text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
        Crie seu perfil no Bairu e facilite que novos clientes encontrem seu
        negócio quando realmente precisarem de você.
      </p>

      <div className="mt-10 w-full">
        <CTAButton />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Leva menos de 5 minutos e é gratuito.
      </p>
    </div>
  );
}
