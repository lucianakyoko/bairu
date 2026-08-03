import { Heart, type LucideIcon } from 'lucide-react';

import type { Brand } from '@/components/icons/BrandIcon';

export type DiscoveryChannel =
  | {
      type: 'brand';
      brand: Brand;
      title: string;
      description: string;
    }
  | {
      type: 'icon';
      icon: LucideIcon;
      title: string;
      description: string;
      color?: string;
    };

export const discoveryChannels: DiscoveryChannel[] = [
  {
    type: 'brand',
    brand: 'instagram',
    title: 'Instagram',
    description: 'Seus clientes acompanham você.',
  },
  {
    type: 'brand',
    brand: 'whatsapp',
    title: 'WhatsApp',
    description: 'Seus clientes falam com você.',
  },
  {
    type: 'brand',
    brand: 'facebook',
    title: 'Facebook',
    description: 'Seus clientes compartilham você.',
  },
  {
    type: 'icon',
    icon: Heart,
    title: 'Indicação',
    description: 'Seus clientes recomendam você.',
    color: 'var(--color-danger)',
  },
];
