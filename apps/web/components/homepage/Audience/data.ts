import {
  BriefcaseBusiness,
  Store,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export interface Audience {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const audiences: Audience[] = [
  {
    icon: Store,
    title: 'Pequenos comércios',
    description:
      'Mercados, padarias, farmácias, pet shops, lojas e estabelecimentos locais.',
  },
  {
    icon: Wrench,
    title: 'Prestadores de serviço',
    description:
      'Eletricistas, encanadores, diaristas, costureiras, mecânicos e profissionais técnicos.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Profissionais autônomos',
    description:
      'Psicólogos, arquitetos, professores particulares, fotógrafos, consultores e outros profissionais independentes.',
  },
];
