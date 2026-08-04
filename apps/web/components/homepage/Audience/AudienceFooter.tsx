import { Info } from 'lucide-react';

export function AudienceFooter() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-primary/20 mt-6 bg-primary/5 p-6">
      <div className="flex items-center md:items-start flex-col md:flex-row gap-4">
        <Info className="w-10 h-10 text-info" />

        <div className="space-y-2">
          <h3 className="font-semibold text-text text-center md:text-left">
            Seu trabalho também faz parte da comunidade.
          </h3>

          <p className="text-base leading-7 text-text-muted text-center md:text-left">
            Se você oferece produtos ou serviços que ajudam pessoas de São
            Miguel Arcanjo, o Bairu foi pensado para você.
          </p>
        </div>
      </div>
    </div>
  );
}
