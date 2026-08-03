import Link from 'next/link';

export function FooterBrand() {
  return (
    <div className="space-y-3">
      <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
        Bairu
      </Link>

      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        Fortalecendo negócios e comunidades locais.
      </p>
    </div>
  );
}
