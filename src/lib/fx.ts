/** Fire gold particles from a point (viewport coords) or from the centre of an element. */
export function burst(x?: number, y?: number, n = 60) {
  window.dispatchEvent(new CustomEvent('fx-burst', { detail: { x, y, n } }));
}

export function burstFrom(el: Element | null, n = 60) {
  if (!el) return burst(undefined, undefined, n);
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, n);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}
