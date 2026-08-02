import { CTAButton } from './CTAButton';

export function CTAContent() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <span className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Você chegou até aqui.
      </span>

      <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
        Seu negócio merece ser encontrado.
      </h2>

      <p className="mt-6 text-lg leading-8 text-muted-foreground">
        Crie seu perfil no Bairu e facilite que novos clientes encontrem seu
        negócio quando realmente precisarem de você.
      </p>

      <div className="mt-10">
        <CTAButton />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Leva menos de 5 minutos.
      </p>
    </div>
  );
}
