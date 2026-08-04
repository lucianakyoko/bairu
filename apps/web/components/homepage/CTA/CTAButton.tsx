import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function CTAButton() {
  return (
    <Button size="lg" className="text-xs sm:text-sm gap-2 w-full md:w-[274]">
      Criar meu perfil gratuitamente
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
