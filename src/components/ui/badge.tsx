import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'outline' };

/** Small label pill. Solid colours and the project's 7px corners. */
export function Badge({ className, variant = 'default', ...props }: Props) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]',
        variant === 'default' ? 'border-transparent bg-accent text-onaccent' : 'border-fg/40 text-fg',
        className,
      )}
      {...props}
    />
  );
}
