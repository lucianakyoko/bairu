import Link from 'next/link';

export function HeaderLogo() {
  return (
    <Link
      href="/"
      className="text-2xl font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
    >
      Bairu
    </Link>
  );
}
