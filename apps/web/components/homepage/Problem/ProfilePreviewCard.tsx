import { Icon } from '@/components/icons/Icon';
import { Check, Scissors } from 'lucide-react';

export function ProfilePreviewCard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
          <Icon icon={Check} className="text-outline" size={22} />
        </div>
        <h4 className="font-semibold text-text">
          Perfil profissional completo
        </h4>
      </div>

      <div className="w-full space-y-3">
        <div className="rounded-xl border border-primary/20 bg-surface p-4 shadow-md">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon icon={Scissors} className="text-outline" />
            </div>

            <div>
              <p className="font-semibold text-text">Maria Costura</p>

              <p className="text-xs uppercase tracking-wider text-text-muted">
                Costura e Reparos • Centro
              </p>

              <div className="mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined fill text-sm text-warning">
                  star
                </span>

                <span className="text-xs">4.9 (42 avaliações)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2 border-t border-border pt-3">
            <span className="rounded bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
              ABERTO AGORA
            </span>

            <span className="rounded bg-background px-2 py-1 text-[10px] font-bold text-text-muted">
              RUA DAS FLORES, 45
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
