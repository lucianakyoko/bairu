import { Icon } from '@/components/icons/Icon';
import { StoreIcon } from 'lucide-react';

export function ProfileMockup() {
  return (
    <div className="relative rounded-2xl p-16 bg-primary/10 p-scale-24 border-primary/60">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Icon icon={StoreIcon} className="text-outline" size={22} />
          </div>

          <div className="space-y-1">
            <div className="h-4 w-32 rounded bg-primary/20" />
            <div className="h-3 w-48 rounded bg-primary/60" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 rounded-lg border border-outline-variant border-primary/40 bg-white" />
          <div className="h-16 rounded-lg border border-outline-variant border-primary/40 bg-white" />
          <div className="h-16 rounded-lg border border-outline-variant border-primary/40 bg-white" />
        </div>

        <div className="h-10 rounded-lg bg-primary" />
      </div>
    </div>
  );
}
