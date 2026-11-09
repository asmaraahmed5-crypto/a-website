import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// Parts of the 21st.dev "hero-designali" hero, rewritten as clean TypeScript:
//  - TrailCanvas: the springy light trails that follow the pointer (the original used module
//    globals and @ts-ignore; this version is self-contained, sized to its parent, only runs while
//    visible, never blocks scrolling, and is skipped on touch screens and for reduced motion).
//    Colours are white to light grey to match the black and white site instead of a rainbow.
//  - TypeWriter: the looping typed phrase, without the react-typed dependency.
// The demo's buttons and the gradient grid are intentionally not included.
// ─────────────────────────────────────────────────────────────

const E = { friction: 0.5, trails: 80, size: 50, dampening: 0.025, tension: 0.99 };

type Node = { x: number; y: number; vx: number; vy: number };
type Line = { spring: number; friction: number; nodes: Node[] };

function makeLine(spring: number, x: number, y: number): Line {
  return {
    spring: spring + 0.1 * Math.random() - 0.05,
    friction: E.friction + 0.01 * Math.random() - 0.005,
    nodes: Array.from({ length: E.size }, () => ({ x, y, vx: 0, vy: 0 })),
  };
}

function updateLine(l: Line, px: number, py: number) {
  let e = l.spring;
  let t = l.nodes[0];
  t.vx += (px - t.x) * e;
  t.vy += (py - t.y) * e;
  for (let i = 0; i < l.nodes.length; i++) {
    t = l.nodes[i];
    if (i > 0) {
      const n = l.nodes[i - 1];
      t.vx += (n.x - t.x) * e;
      t.vy += (n.y - t.y) * e;
      t.vx += n.vx * E.dampening;
      t.vy += n.vy * E.dampening;
    }
    t.vx *= l.friction;
    t.vy *= l.friction;
    t.x += t.vx;
    t.y += t.vy;
    e *= E.tension;
  }
}

function drawLine(ctx: CanvasRenderingContext2D, l: Line) {
  let n = l.nodes[0].x;
  let i = l.nodes[0].y;
  ctx.beginPath();
  ctx.moveTo(n, i);
  let a = 1;
  for (const o = l.nodes.length - 2; a < o; a++) {
    const e = l.nodes[a];
    const t = l.nodes[a + 1];
    n = 0.5 * (e.x + t.x);
    i = 0.5 * (e.y + t.y);
    ctx.quadraticCurveTo(e.x, e.y, n, i);
  }
  const e = l.nodes[a];
  const t = l.nodes[a + 1];
  ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
  ctx.stroke();
  ctx.closePath();
}

/** Light trails that chase the pointer. Place inside a `relative` parent; it fills it. */
export function TrailCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (reduce || !fine) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const pos = { x: w / 2, y: h / 2 };
    let lines: Line[] = [];
    let phase = Math.random() * Math.PI * 2;
    let visible = true;
    let raf = 0;
    let lastMove = 0;
    let cleared = true;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pos.x = e.clientX - r.left;
      pos.y = e.clientY - r.top;
      lastMove = performance.now();
      if (!lines.length) lines = Array.from({ length: E.trails }, (_, i) => makeLine(0.45 + (i / E.trails) * 0.025, pos.x, pos.y));
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      // sleep once the pointer has been still for a while
      if (now - lastMove > 3500) {
        if (!cleared) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.clearRect(0, 0, w, h);
          cleared = true;
        }
        return;
      }
      cleared = false;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      phase += 0.0015 * 16;
      const light = 82 + Math.sin(phase) * 18; // soft white to light grey
      ctx.strokeStyle = `hsla(0,0%,${Math.round(light)}%,0.045)`;
      ctx.lineWidth = 10;
      for (const l of lines) {
        updateLine(l, pos.x, pos.y);
        drawLine(ctx, l);
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && lines.length && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(parent);
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn('pointer-events-none', className)} />;
}

/** Looping typed phrase. Shows the first phrase still for reduced motion; screen readers get the full list. */
export function TypeWriter({ strings, typeSpeed = 75, backSpeed = 30, hold = 1300 }: { strings: string[]; typeSpeed?: number; backSpeed?: number; hold?: number }) {
  const [text, setText] = useState('');
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduce || !strings.length) return;
    let i = 0;
    let n = 0;
    let deleting = false;
    let t = 0;
    const tick = () => {
      const word = strings[i % strings.length];
      if (!deleting) {
        n++;
        setText(word.slice(0, n));
        if (n >= word.length) {
          deleting = true;
          t = window.setTimeout(tick, hold);
          return;
        }
        t = window.setTimeout(tick, typeSpeed);
      } else {
        n--;
        setText(word.slice(0, n));
        if (n <= 0) {
          deleting = false;
          i++;
          t = window.setTimeout(tick, 350);
          return;
        }
        t = window.setTimeout(tick, backSpeed);
      }
    };
    t = window.setTimeout(tick, 500);
    return () => window.clearTimeout(t);
  }, [strings, typeSpeed, backSpeed, hold, reduce]);

  if (reduce) return <span>{strings[0]}</span>;
  return (
    <>
      <span className="sr-only">{strings.join(', ')}</span>
      <span aria-hidden>
        {text}
        <span className="ml-0.5 inline-block animate-pulse font-light">|</span>
      </span>
    </>
  );
}
