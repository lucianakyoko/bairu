import { Card } from '@/components/ui/card';

import { BeforeState } from './BeforeState';
import { ProfileMockup } from './ProfileMockup';
import { AfterState } from '@/components/homepage/Solution/AfterState';
import { Separator } from '@/components/ui/separator';

export function BeforeAfterComparison() {
  return (
    <Card className="grid gap-10 rounded-2xl border-none bg-surface p-6 md:p-8 lg:grid-cols-2 lg:gap-12 lg:p-12">
      <div className="space-y-3 text-center order-2 lg:order-1">
        <BeforeState />

        <Separator />

        <AfterState />
      </div>

      <ProfileMockup />
    </Card>
  );
}
