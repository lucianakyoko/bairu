import { discoveryChannels } from './data';
import { DiscoveryChannelCard } from './DiscoveryChannelCard';

export function DiscoveryChannels() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {discoveryChannels.map((channel) => (
        <DiscoveryChannelCard key={channel.title} channel={channel} />
      ))}
    </div>
  );
}
