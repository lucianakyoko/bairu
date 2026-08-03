import { BrandIcon } from '@/components/icons/BrandIcon';
import { beforePlatforms } from './data';
import { cn } from '@/lib/utils';

export function BeforeState() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Hoje
        </p>

        <p className="text-sm text-muted-foreground">
          Suas informações ficam espalhadas em diferentes lugares.
        </p>
      </div>

      <div className="flex gap-4">
        {beforePlatforms.map((platform) => (
          <BrandIcon
            key={platform.name}
            brand={platform.name}
            className={cn(
              'h-12 w-12 rounded-xl bg-background p-3',
              `text-${platform.color}`,
            )}
          />
        ))}
      </div>
    </div>
  );
}
