import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function CTAButton() {
  return (
    <Button
      size="lg"
      className="h-12 text-xs sm:text-base gap-2 w-full sm:w-auto sm:min-w-[280px]"
    >
      Criar meu perfil gratuitamente
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
