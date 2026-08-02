import { Card, CardContent } from '@/components/ui/card';
import type { Benefit } from './data';

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  const Icon = benefit.icon;

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col gap-6 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">
            {benefit.title}
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {benefit.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
