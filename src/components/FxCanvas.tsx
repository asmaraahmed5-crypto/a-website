import { useEffect, useRef } from 'react';

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string };

const COLORS = ['#FFFFFF', '#0B0B0B', '#8A8A8A', '#BDBDBD'];

/** Fixed canvas that draws small confetti bursts fired with burst() from lib/fx. */
export default function FxCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const g = canvas.getContext('2d');
    if (!g) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let w = 0;
    let h = 0;
    let raf = 0;
    const parts: P[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onBurst = (e: Event) => {
      if (reduce.matches) return;
      const d = (e as CustomEvent<{ x?: number; y?: number; n: number }>).detail;
      const cx = d.x ?? w / 2;
      const cy = d.y ?? h / 2;
      for (let i = 0; i < d.n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 1 + Math.random() * 5;
        parts.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 1.5,
          life: 0,
          max: 55 + Math.random() * 40,
          r: 2 + Math.random() * 3,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };
    window.addEventListener('fx-burst', onBurst);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      g.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life++;
        p.vy += 0.07;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        const a = 1 - p.life / p.max;
        if (a <= 0) {
          parts.splice(i, 1);
          continue;
        }
        g.globalAlpha = a;
        g.fillStyle = p.c;
        g.fillRect(p.x, p.y, p.r, p.r);
      }
      g.globalAlpha = 1;
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('fx-burst', onBurst);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[55]" />;
}
