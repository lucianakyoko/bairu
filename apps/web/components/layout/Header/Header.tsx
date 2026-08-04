import { HeaderActions } from './HeaderActions';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNavigation } from './HeaderNavigation';
import { MobileNavigation } from './MobileNavigation';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <HeaderLogo />

        <HeaderNavigation />

        <HeaderActions />

        <MobileNavigation />
      </div>
    </header>
  );
}
