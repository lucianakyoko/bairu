import { Stagger } from '@/components/animation';
import { discoveryChannels } from './data';
import { DiscoveryChannelCard } from './DiscoveryChannelCard';
import { StaggerItem } from '@/components/animation/StaggerItem';

export function DiscoveryChannels() {
  return (
    <Stagger className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-4 mt-6">
      {discoveryChannels.map((channel) => (
        <StaggerItem key={channel.title}>
          <DiscoveryChannelCard channel={channel} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
