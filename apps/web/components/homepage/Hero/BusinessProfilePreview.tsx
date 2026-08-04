import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock3, Store, ArrowRight } from 'lucide-react';

export function BusinessProfilePreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
      <PreviewHeader />

      <div className="space-y-6 p-6">
        <PreviewInfo />

        <PreviewTags />

        <Button className="w-full">
          Ver perfil
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function PreviewHeader() {
  return (
    <div className="border-b border-border bg-primary/5 p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Store className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-text">Padaria do Centro</h3>

          <p className="text-sm text-text-muted">Padaria • Café</p>

          <span className="inline-flex rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
            Aberto agora
          </span>
        </div>
      </div>
    </div>
  );
}

function PreviewInfo() {
  const items = [
    {
      icon: MapPin,
      label: 'Centro • São Miguel Arcanjo',
    },
    {
      icon: Phone,
      label: '(15) 99999-9999',
    },
    {
      icon: Clock3,
      label: 'Seg–Sáb • 06h às 18h',
    },
  ];

  return (
    <div className="space-y-4">
      {items.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-3 text-sm text-text-muted"
        >
          <Icon className="h-4 w-4 text-primary" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function PreviewTags() {
  const tags = ['Pães', 'Bolos', 'Café', 'Doces'];

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-text-muted"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
