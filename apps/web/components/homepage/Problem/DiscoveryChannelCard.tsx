import { BrandIcon } from '@/components/icons/BrandIcon';

import type { DiscoveryChannel } from './data';

interface DiscoveryChannelCardProps {
  channel: DiscoveryChannel;
}

export function DiscoveryChannelCard({ channel }: DiscoveryChannelCardProps) {
  return (
    <article className="glass-card flex flex-col items-center gap-3 rounded-xl border border-outline-variant p-6 text-center">
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
