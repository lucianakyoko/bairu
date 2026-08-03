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
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
