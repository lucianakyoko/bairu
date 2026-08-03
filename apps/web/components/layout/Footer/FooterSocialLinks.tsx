import Link from 'next/link';

import { socialLinks } from './socialLinks';

export function FooterSocialLinks() {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">Redes sociais</h3>

      {socialLinks.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
