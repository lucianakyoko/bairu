import { Button } from '@/components/ui/button';

export function HeroActions() {
  return (
    <div className="flex flex-wrap gap-4 w-full">
      <Button className="w-full sm:w-auto" size="lg">
        Cadastrar meu negócio
      </Button>

      <Button className="w-full sm:w-auto" variant="outline" size="lg">
        Encontrar negócios
      </Button>
    </div>
  );
}
