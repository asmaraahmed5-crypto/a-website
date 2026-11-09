/** Join class names, skipping falsy values. (A tiny stand-in for shadcn's cn helper.) */
export function cn(...parts: Array<string | false | null | undefined | Record<string, boolean>>) {
  return parts
    .flatMap((p) => (typeof p === 'object' && p ? Object.entries(p).filter(([, on]) => on).map(([k]) => k) : [p]))
    .filter(Boolean)
    .join(' ');
}
