import { Separator } from '@/components/ui/separator';
import { HeartHandshake } from 'lucide-react';

export function MissionHighlight() {
  const cityName = 'São Miguel Arcanjo';
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-10 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
          <HeartHandshake className="h-7 w-7" />
        </div>
        <Separator className="bg-primary-foreground/20" />
        <blockquote className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
          {cityName} cresce quando quem empreende aqui também cresce.
        </blockquote>
      </div>
    </div>
  );
}
