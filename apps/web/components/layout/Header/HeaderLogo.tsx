import { Logo } from '@/components/brand/Logo';
import Link from 'next/link';

export function HeaderLogo() {
  return (
    <Link
      href="/"
      aria-label="Ir para a página inicial do Bairu"
      className="transition-opacity hover:opacity-90 flex items-center gap-2"
    >
      <Logo />
    </Link>
  );
}
