import { useEffect, useRef } from 'react';

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; hue: number };

/** Fixed canvas: slow ambient gold dust plus bursts fired with burst() from lib/fx. */
export default function FxCanvas({ ambient }: { ambient: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const ambientRef = useRef(ambient);
  ambientRef.current = ambient;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const g = canvas.getContext('2d');
    if (!g) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let w = 0;
    let h = 0;
    let raf = 0;
    const bursts: P[] = [];
    const dust: P[] = [];

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

    const makeDust = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.1 - Math.random() * 0.2,
      life: 0,
      max: 1,
      r: 0.6 + Math.random() * 1.4,
      hue: 38 + Math.random() * 10,
    });
    for (let i = 0; i < 38; i++) dust.push(makeDust());

    const onBurst = (e: Event) => {
      if (reduce.matches) return;
      const d = (e as CustomEvent<{ x?: number; y?: number; n: number }>).detail;
      const cx = d.x ?? w / 2;
      const cy = d.y ?? h / 2;
      for (let i = 0; i < d.n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 1 + Math.random() * 4.5;
        bursts.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 1.2,
          life: 0,
          max: 55 + Math.random() * 45,
          r: 1 + Math.random() * 2.2,
          hue: 36 + Math.random() * 14,
        });
      }
    };
    window.addEventListener('fx-burst', onBurst);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      g.clearRect(0, 0, w, h);
      if (ambientRef.current && !reduce.matches) {
        for (const p of dust) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -5) {
            p.y = h + 5;
            p.x = Math.random() * w;
          }
          g.fillStyle = `hsla(${p.hue},55%,68%,0.35)`;
          g.beginPath();
          g.arc(p.x, p.y, p.r, 0, 6.283);
          g.fill();
        }
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const p = bursts[i];
        p.life++;
        p.vy += 0.06;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        const a = 1 - p.life / p.max;
        if (a <= 0) {
          bursts.splice(i, 1);
          continue;
        }
        g.fillStyle = `hsla(${p.hue},70%,70%,${a})`;
        g.beginPath();
        g.arc(p.x, p.y, p.r, 0, 6.283);
        g.fill();
      }
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
