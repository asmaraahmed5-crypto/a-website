/** Flat, solid-colour illustrations (no gradients). */
export function IceCream({ size = 140, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" className={className} aria-hidden>
      <path d="M22 62 L50 136 L78 62 Z" fill="#D8C7A8" />
      <path d="M32 78 L68 78 M38 94 L62 94 M44 110 L56 110 M34 62 L54 128 M66 62 L46 128" stroke="#8A7A5E" strokeWidth="1.4" fill="none" />
      <path d="M16 64 q4 -14 17 -12 q5 -14 18 -10 q14 -4 20 10 q12 3 10 14 q-10 8 -34 8 q-24 0 -31 -10z" fill="#6B1F2A" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="50" cy="38" r="25" fill="#E9DFCF" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M27 42 q6 10 10 2 q4 12 10 2" fill="#E9DFCF" />
      <circle cx="50" cy="11" r="6" fill="#6B1F2A" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M50 6 q4 -7 10 -7" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

export function Paw({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <ellipse cx="16" cy="21" rx="7" ry="6" />
      <ellipse cx="6.5" cy="13" rx="3" ry="4" transform="rotate(-18 6.5 13)" />
      <ellipse cx="12.5" cy="7.5" rx="3" ry="4.2" />
      <ellipse cx="19.5" cy="7.5" rx="3" ry="4.2" />
      <ellipse cx="25.5" cy="13" rx="3" ry="4" transform="rotate(18 25.5 13)" />
    </svg>
  );
}

export function CatSilhouette({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} fill="currentColor" aria-hidden>
      <path d="M32 108c-10-24-4-46 12-56-6-8-8-20-5-30l14 11c6-2 12-2 18 0l14-11c3 10 1 22-5 30 16 10 22 32 12 56z" />
      <path d="M92 104c20-2 26-26 10-40" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** A flat envelope used by the letter sections. open=true lifts the flap. */
export function Envelope({ open, seal }: { open: boolean; seal: string }) {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
      <rect x="0" y="40" width="320" height="180" rx="7" fill="#E9DFCF" stroke="#0B0B0B" strokeWidth="2" />
      <path d="M0 220 L160 120 L320 220 Z" fill="#D8C7A8" stroke="#0B0B0B" strokeWidth="2" />
      {open ? (
        <>
          <rect x="30" y="20" width="260" height="150" rx="4" fill="#FFFFFF" stroke="#0B0B0B" strokeWidth="2" />
          <path d="M0 40 L160 -20 L320 40 Z" fill="#D8C7A8" stroke="#0B0B0B" strokeWidth="2" />
        </>
      ) : (
        <>
          <path d="M0 40 L160 140 L320 40 Z" fill="#D8C7A8" stroke="#0B0B0B" strokeWidth="2" />
          <circle cx="160" cy="132" r="20" fill="#6B1F2A" stroke="#0B0B0B" strokeWidth="2" />
          <text x="160" y="139" textAnchor="middle" fontFamily="Montserrat,Arial,sans-serif" fontWeight="800" fontSize="18" fill="#E9DFCF">
            {seal}
          </text>
        </>
      )}
    </svg>
  );
}
