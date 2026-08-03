import { Card, CardContent } from '@/components/ui/card';

import type { Audience } from './data';

interface AudienceCardProps {
  audience: Audience;
}

export function AudienceCard({ audience }: AudienceCardProps) {
  const Icon = audience.icon;

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col gap-6 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">
            {audience.title}
          </h3>

          <p className="text-sm leading-7 text-muted-foreground">
            {audience.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
