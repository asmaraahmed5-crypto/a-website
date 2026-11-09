import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../lib/audio';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> & {
  children: ReactNode;
  variant?: 'solid' | 'ghost';
};

export default function Button({ children, variant = 'solid', className = '', onClick, ...rest }: Props) {
  const base =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40';
  const look = variant === 'solid' ? 'bg-accent text-onaccent hover:opacity-85' : 'border-2 border-fg/40 text-fg hover:border-accent hover:text-accent';
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${look} ${className}`}
      onClick={(e) => {
        sfx.click();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
