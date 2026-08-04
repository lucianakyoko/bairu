import { BrandIcon } from '@/components/icons/BrandIcon';

import type { DiscoveryChannel } from './data';

interface DiscoveryChannelCardProps {
  channel: DiscoveryChannel;
}

export function DiscoveryChannelCard({ channel }: DiscoveryChannelCardProps) {
  return (
    <article className="flex flex-col items-center gap-3 rounded-2xl border border-outline-variant border-secondary/10 p-6 text-center shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {channel.type === 'brand' ? (
        <BrandIcon brand={channel.brand} size={32} />
      ) : (
        <channel.icon
          size={32}
          style={{
            color: channel.color,
          }}
        />
      )}

      <div className="space-y-1">
        <p className="font-semibold">{channel.title}</p>

        <p className="text-sm text-on-surface-variant">{channel.description}</p>
      </div>
    </article>
  );
}
