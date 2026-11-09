export function IceCream({ size = 140, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" className={className} aria-hidden>
      <defs>
        <linearGradient id="cone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8C98A" />
          <stop offset="1" stopColor="#A9803F" />
        </linearGradient>
        <linearGradient id="sc1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5F0E7" />
          <stop offset="1" stopColor="#E8D8B8" />
        </linearGradient>
        <linearGradient id="sc2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D8B07A" />
          <stop offset="1" stopColor="#B88A55" />
        </linearGradient>
      </defs>
      <path d="M22 60 L50 134 L78 60 Z" fill="url(#cone)" />
      <path d="M30 76 L70 76 M36 92 L64 92 M42 108 L58 108 M33 60 L56 128 M50 60 L68 110 M67 60 L45 126" stroke="#8F6A2C" strokeWidth="1.2" opacity=".5" fill="none" />
      <path d="M18 62 q4 -14 16 -12 q4 -16 20 -12 q14 -4 20 10 q12 2 10 14 q-10 8 -34 8 q-24 0 -32 -8z" fill="url(#sc2)" />
      <circle cx="50" cy="40" r="26" fill="url(#sc1)" />
      <path d="M26 44 q6 10 10 2 q4 12 10 2" fill="#F5F0E7" />
      <circle cx="50" cy="12" r="6" fill="#C0524A" />
      <path d="M50 8 q4 -8 10 -8" stroke="#8F7440" strokeWidth="1.6" fill="none" />
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
