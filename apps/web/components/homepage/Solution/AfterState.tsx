import { CheckCircle2 } from 'lucide-react';

import { afterState } from './data';
import { Icon } from '@/components/icons/Icon';

export function AfterState() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          {afterState.title}
        </span>

        <p className="mt-2 text-on-surface-variant">{afterState.description}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-primary">
        <Icon icon={CheckCircle2} className="text-outline" size={22} />

        <span className="font-medium">Pronto para ser encontrado</span>
      </div>
    </div>
  );
}
