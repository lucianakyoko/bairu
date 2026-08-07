import Link from 'next/link';

import { footerNavigation } from './navigation';

export function FooterNavigation() {
  return (
    <nav
      aria-label="Links do rodapé"
      className="flex flex-col gap-3 items-center md:items-start"
    >
      <h3 className="text-sm font-semibold text-text">Explorar</h3>
      {footerNavigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
