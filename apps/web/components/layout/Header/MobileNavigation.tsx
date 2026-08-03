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

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
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
              className="justify-start"
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="my-6 border-t" />

        <div className="flex flex-col gap-3">
          <Button variant="ghost" asChild>
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
