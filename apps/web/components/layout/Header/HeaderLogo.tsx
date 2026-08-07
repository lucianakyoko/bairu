import { Logo } from '@/components/brand/Logo';
import Link from 'next/link';

export function HeaderLogo() {
  return (
    <Link
      href="/"
      aria-label="Ir para a página inicial do Bairu"
      className="hover:opacity-90 transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
    >
      <Logo />
    </Link>
  );
}
