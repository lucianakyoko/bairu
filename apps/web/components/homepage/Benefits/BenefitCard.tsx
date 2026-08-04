import { Card, CardContent } from '@/components/ui/card';
import type { Benefit } from './data';

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  const Icon = benefit.icon;

  return (
    <Card className="h-full rounded-2xl border-border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="flex flex-col gap-6 p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
          <Icon className="h-6 w-6 text-primary" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-text">{benefit.title}</h3>

          <p className="text-base leading-7 text-text-muted">
            {benefit.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
