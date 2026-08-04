import { Icon } from '@/components/icons/Icon';
import { Verified } from 'lucide-react';

export function BairuMessage() {
  return (
    <div className="space-y-6 rounded-2xl border border-primary/40 bg-surface p-8 shadow-xl">
      <div className="space-y-3 text-center">
        <h3 className="text-2xl font-semibold text-primary">
          O Bairu reúne todas as informações do seu negócio em um único perfil
          profissional.
        </h3>

        <p className="leading-7 text-text-muted">
          Seu endereço, horário de funcionamento, formas de contato, produtos,
          serviços e redes sociais organizados em um único lugar, prontos para
          serem encontrados quando alguém precisar de você.
        </p>
      </div>

      <div className="rounded-xl bg-background p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <Icon icon={Verified} className="text-outline" />

          <p className="text-center text-sm font-semibold text-primary">
            O Bairu complementa sua presença digital. Ele não substitui suas
            redes sociais.
          </p>
        </div>
      </div>
    </div>
  );
}
