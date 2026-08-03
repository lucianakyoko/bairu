import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function HeaderActions() {
  return (
    <div className="hidden items-center gap-4 lg:flex">
      <Button variant="ghost" asChild>
        <Link href="/login">Entrar</Link>
      </Button>

      <Button asChild>
        <Link href="/para-negocios">Cadastrar meu negócio</Link>
      </Button>
    </div>
  );
}
