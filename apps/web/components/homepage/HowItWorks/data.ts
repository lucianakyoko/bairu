export interface Step {
  number: number;
  title: string;
  description: string;
}

export const steps: Step[] = [
  {
    number: 1,
    title: 'Cadastre seu negócio',
    description:
      'Crie seu perfil gratuitamente em poucos minutos utilizando apenas as informações essenciais.',
  },
  {
    number: 2,
    title: 'Complete seu perfil',
    description:
      'Adicione endereço, horário de funcionamento, produtos, serviços, fotos e formas de contato.',
  },
  {
    number: 3,
    title: 'Comece a ser encontrado',
    description:
      'Seu negócio ficará disponível para pessoas que procuram exatamente o que você oferece.',
  },
];
