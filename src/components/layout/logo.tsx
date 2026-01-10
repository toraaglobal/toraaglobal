import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Image
        src="/logo.png"
        alt="ToraaGlobal Logo"
        width={180}
        height={50}
        priority
        className="h-10 w-auto"
      />
    </Link>
  );
}
