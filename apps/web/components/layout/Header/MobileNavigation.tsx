'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { navigationItems } from './navigation';
import { Separator } from '@/components/ui/separator';

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden cursor-pointer"
          title="Abrir menu"
          aria-label="Abrir menu"
        >
          <Menu className="text-text hover:text-primary" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <nav aria-label="Navegação mobile" className="mt-8 flex flex-col gap-2">
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="justify-start font-semibold text-text hover:text-text-muted transition-colors duration-200"
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <Separator />

        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            asChild
            className="border border-primary text-primary hover:bg-primary/10"
          >
            <Link href="/login">Entrar</Link>
          </Button>

          <Button asChild>
            <Link href="/para-negocios">Cadastrar meu negócio</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
