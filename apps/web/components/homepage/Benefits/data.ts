import {
  Clock3,
  MessageCircle,
  Search,
  Store,
  type LucideIcon,
} from 'lucide-react';

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const benefits: Benefit[] = [
  {
    icon: Search,
    title: 'Seja encontrado',
    description:
      'Apareça para quem está procurando exatamente o que você oferece no seu bairro.',
  },
  {
    icon: Store,
    title: 'Mostre seus produtos',
    description:
      'Organize produtos e serviços em uma vitrine profissional e fácil de navegar.',
  },
  {
    icon: Clock3,
    title: 'Informações sempre atualizadas',
    description:
      'Horário de funcionamento, endereço e contatos sempre disponíveis.',
  },
  {
    icon: MessageCircle,
    title: 'Contato imediato',
    description:
      'Permita que novos clientes conversem com você pelo WhatsApp com apenas um clique.',
  },
];
