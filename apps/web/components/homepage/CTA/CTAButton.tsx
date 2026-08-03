import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function CTAButton() {
  return (
    <Button size="lg" className="gap-2 px-8">
      Criar meu perfil gratuitamente
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
