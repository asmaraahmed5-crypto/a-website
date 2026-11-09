import { useEffect, useRef } from 'react';

/** Desktop-only soft gold ring that follows the pointer. Off on touch devices and for reduced motion. */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ref.current;
    if (!fine || reduce || !el) return;
    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;
    let raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = '1';
    };
    const leave = () => {
      el.style.opacity = '0';
    };
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x - 18}px, ${y - 18}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[58] hidden h-9 w-9 rounded-full border border-gold/60 opacity-0 transition-opacity duration-300 [@media(pointer:fine)]:block"
      style={{ boxShadow: '0 0 24px rgba(198,165,107,0.25)' }}
    />
  );
}
