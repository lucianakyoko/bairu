import { Logo } from '@/components/brand/Logo';
import Link from 'next/link';

export function FooterBrand() {
  return (
    <div className="space-y-5 flex flex-col items-center md:items-start">
      <Link
        href="/"
        aria-label="Ir para a página inicial do Bairu"
        className="inline-flex transition-opacity hover:opacity-90 items-center gap-2"
      >
        <Logo size={48} />
      </Link>

      <p className="max-w-sm text-sm text-center md:text-left leading-relaxed text-text-muted">
        Fortalecendo negócios e comunidades locais.
      </p>
    </div>
  );
}
