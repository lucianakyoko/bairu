import { cn } from '@/lib/utils';
import Image from 'next/image';

type LogoProps = {
  size?: number;
  showName?: boolean;
  className?: string;
};

export function Logo({ size = 40, showName = true, className }: LogoProps) {
  return (
    <div className="inline-flex items-center gap-3">
      <Image
        src="/brand/logo-mark.svg"
        alt="Bairu"
        width={size}
        height={size}
        priority
      />
      {showName && (
        <span
          className={cn(
            'text-2xl font-semibold tracking-tight text-primary',
            className,
          )}
        >
          Bairu
        </span>
      )}
    </div>
  );
}
