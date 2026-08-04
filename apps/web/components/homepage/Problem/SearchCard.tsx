import { Icon } from '@/components/icons/Icon';
import { CircleX, Search } from 'lucide-react';

export function SearchCard() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          O comportamento atual
        </p>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-2 md:p-4 shadow-md">
          <Icon icon={Search} className="text-outline text-secondary" />

          <span className="italic text-text-muted">
            &#34;costureira em São Miguel Arcanjo&#34;
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10">
            <Icon icon={CircleX} className="text-outline text-danger" />
          </div>
          <h4 className="font-semibold text-text">Seu negócio não apareceu.</h4>
        </div>

        <p className="text-sm text-text-muted">
          O cliente encontra informações espalhadas, desatualizadas ou
          simplesmente não encontra seu negócio.
        </p>
      </div>
    </div>
  );
}
