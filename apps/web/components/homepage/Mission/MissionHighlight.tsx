import { HeartHandshake } from 'lucide-react';

export function MissionHighlight() {
  const cityName = 'São Miguel Arcanjo';
  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-primary-foreground/20 bg-primary-foreground/10 p-10 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/15">
          <HeartHandshake className="h-7 w-7" />
        </div>

        <blockquote className="text-3xl font-semibold leading-tight md:text-4xl">
          {cityName} cresce quando quem empreende aqui também cresce.
        </blockquote>
      </div>
    </div>
  );
}
