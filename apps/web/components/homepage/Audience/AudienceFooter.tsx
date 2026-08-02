import { Info } from 'lucide-react';

export function AudienceFooter() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-muted/30 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Info className="h-5 w-5 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">
            Seu trabalho também faz parte da comunidade.
          </h3>

          <p className="text-sm leading-7 text-muted-foreground">
            Se você oferece produtos ou serviços que ajudam pessoas de São
            Miguel Arcanjo, o Bairu foi pensado para você.
          </p>
        </div>
      </div>
    </div>
  );
}
