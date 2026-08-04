import { Logo } from '@/components/brand/Logo';
import Link from 'next/link';

export function FooterBrand() {
  return (
    <div className="space-y-4 flex flex-col items-center md:items-start">
      <Link
        href="/"
        aria-label="Ir para a página inicial do Bairu"
        className="inline-flex transition-opacity hover:opacity-90 items-center gap-2"
      >
        <Logo size={44} />
      </Link>

      <p className="max-w-sm text-sm text-center md:text-left leading-relaxed text-muted-foreground">
        Fortalecendo negócios e comunidades locais.
      </p>
    </div>
  );
}
