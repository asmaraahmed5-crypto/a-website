import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../lib/audio';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> & {
  children: ReactNode;
  variant?: 'solid' | 'ghost';
};

export default function GoldButton({ children, variant = 'solid', className = '', onClick, ...rest }: Props) {
  const base =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40';
  const look =
    variant === 'solid'
      ? 'bg-gradient-to-b from-gold-soft to-gold text-midnight shadow-[0_0_30px_rgba(198,165,107,0.25)] hover:from-white hover:to-gold-soft'
      : 'border border-gold/50 text-champagne hover:border-gold hover:bg-gold/10';
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
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
