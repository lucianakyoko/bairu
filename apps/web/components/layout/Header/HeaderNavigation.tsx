import Link from 'next/link';

import { navigationItems } from './navigation';

export function HeaderNavigation() {
  return (
    <nav
      aria-label="Navegação principal"
      className="hidden items-center gap-8 lg:flex"
    >
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-semibold text-text hover:text-text-muted transition-colors duration-200"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
