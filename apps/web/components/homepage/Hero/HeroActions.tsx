import { Button } from '@/components/ui/button';

export function HeroActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button size="lg">Cadastrar meu negócio</Button>

      <Button variant="outline" size="lg">
        Encontrar negócios
      </Button>
    </div>
  );
}
