import { Icon } from '@/components/icons/Icon';
import { BairuMessage } from './BairuMessage';
import { ProfilePreviewCard } from './ProfilePreviewCard';
import { SearchCard } from './SearchCard';
import { Info } from 'lucide-react';

export function DiscoverySection() {
  return (
    <>
      <div className="py-8 text-center">
        <div className="flex flex-col md:flex-row items-center md:justify-center gap-4 rounded-full bg-background px-5 py-2.5">
          <Icon icon={Info} className="text-outline" />

          <p className="font-semibold">
            Mas quem ainda não conhece seu negócio procura em outro lugar.
          </p>
        </div>
      </div>

      <div className="grid gap-12 rounded-[32px] border border-border bg-background p-8 md:grid-cols-2 md:p-12">
        <div className="space-y-8">
          <SearchCard />
          <div className="border-t border-border pt-8">
            <ProfilePreviewCard />
          </div>
        </div>

        <BairuMessage />
      </div>
    </>
  );
}
