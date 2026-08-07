import Link from 'next/link';

import { socialLinks } from './socialLinks';

export function FooterSocialLinks() {
  return (
    <div className="flex flex-col gap-3 items-center md:items-start">
      <h3 className="text-sm font-semibold text-text">Redes sociais</h3>

      {socialLinks.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="text-sm text-text-muted transition-colors hover:text-text"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
