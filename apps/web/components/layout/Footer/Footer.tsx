import Link from 'next/link';

import { FooterBrand } from './FooterBrand';
import { FooterNavigation } from './FooterNavigation';
import { FooterSocialLinks } from './FooterSocialLinks';

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto space-y-12 px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3 justify-items-center">
          <FooterBrand />

          <FooterNavigation />

          <FooterSocialLinks />
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Bairu. Todos os direitos reservados.</p>

          <p className="mt-2">
            Feito com ❤️ por{' '}
            <Link
              href="https://lucianakyoko.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary transition-colors hover:underline"
            >
              Luciana Kyoko
            </Link>{' '}
            em São Miguel Arcanjo/ SP.
          </p>
        </div>
      </div>
    </footer>
  );
}
