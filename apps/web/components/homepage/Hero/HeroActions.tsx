import { Button } from '@/components/ui/button';

export function HeroActions() {
  return (
    <div className="flex flex-wrap gap-4 w-full">
      <Button className="w-full md:w-[274]" size="lg">
        Cadastrar meu negócio
      </Button>

      <Button className="w-full md:w-[274]" variant="outline" size="lg">
        Encontrar negócios
      </Button>
    </div>
  );
}
