import { Card } from '@/components/ui/card';

import { BeforeState } from './BeforeState';
import { ProfileMockup } from './ProfileMockup';
import { AfterState } from '@/components/homepage/Solution/AfterState';
import { Separator } from '@/components/ui/separator';

export function BeforeAfterComparison() {
  return (
    <Card className="grid gap-12 border-none bg-surface p-12 lg:grid-cols-2">
      <div className="space-y-3 text-center">
        <BeforeState />

        <Separator />

        <AfterState />
      </div>

      <ProfileMockup />
    </Card>
  );
}
