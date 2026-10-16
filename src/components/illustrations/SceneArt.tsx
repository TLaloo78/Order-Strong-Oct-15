// Larger decorative scenes: the empty plate (empty states) and the protein bowl (sign-in).
// Decorative only, so hidden from assistive technology.

export function EmptyPlateArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="80" cy="62" rx="44" ry="40" className="fill-sand" />
      <circle cx="80" cy="58" r="38" fill="#fffdf9" />
      <circle cx="80" cy="58" r="29" fill="none" stroke="#e9dfd2" strokeWidth="2" />
      {/* Fork */}
      <g className="fill-brand">
        <rect x="21" y="22" width="3" height="18" rx="1.5" />
        <rect x="26.5" y="22" width="3" height="18" rx="1.5" />
        <rect x="32" y="22" width="3" height="18" rx="1.5" />
        <path d="M21 37h14v3a7 7 0 0 1-14 0Z" />
        <rect x="26" y="44" width="4" height="46" rx="2" />
      </g>
      {/* Knife */}
      <path d="M134 20c6 6 6 22 0 30v40a2 2 0 0 1-4 0V22a2 2 0 0 1 4-2Z" className="fill-brand" />
      {/* Sparkle */}
      <g className="stroke-brand" strokeWidth="3" strokeLinecap="round">
        <line x1="104" y1="14" x2="108" y2="6" />
        <line x1="112" y1="20" x2="120" y2="17" />
      </g>
    </svg>
  )
}

// Fixed pseudo-random positions so the bowl looks the same on every render.
const GRAINS = Array.from({ length: 70 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180
  const r = 8 + ((i * 53) % 78)
  return { x: 100 + Math.cos(a) * r, y: 100 + Math.sin(a) * r, rot: (i * 47) % 180, c: ['#f3e6cb', '#dcc59c', '#efdfbf'][i % 3] }
})

export function ProteinBowlArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="bowl-food">
          <circle cx="100" cy="100" r="80" />
        </clipPath>
      </defs>
      <circle cx="102" cy="106" r="96" fill="#000" opacity="0.12" />
      <circle cx="100" cy="100" r="96" fill="#f6f1ea" />
      <circle cx="100" cy="100" r="84" fill="#ece3d6" />
      <g clipPath="url(#bowl-food)">
        <circle cx="100" cy="100" r="82" fill="#e8d7b6" />
        {GRAINS.map((g, i) => (
          <ellipse key={i} cx={g.x} cy={g.y} rx="2.4" ry="1.7" fill={g.c} transform={`rotate(${g.rot} ${g.x} ${g.y})`} />
        ))}
        {/* Kale */}
        {([
          [44, 78, 14], [36, 104, 13], [50, 128, 14], [66, 150, 13], [58, 58, 11], [48, 96, 10], [62, 140, 10],
      ] as [number, number, number][]).map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={['#2f6b3a', '#3d7f45', '#25603f', '#4b8f4c'][i % 4]} />
        ))}
        {/* Avocado */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`rotate(${30 + i * 7} ${118 + i * 12} ${44 + i * 6})`}>
            <ellipse cx={118 + i * 12} cy={44 + i * 6} rx="9" ry="24" fill="#4d7a2c" />
            <ellipse cx={117 + i * 12} cy={43 + i * 6} rx="7" ry="22" fill={i % 2 ? '#cfe08f' : '#c2d881'} />
          </g>
        ))}
        {/* Tomatoes */}
        {([
          [164, 100], [152, 124], [168, 130],
      ] as [number, number][]).map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="11" fill="#cf3b22" />
            <circle cx={x} cy={y} r="8" fill="#ef7a5a" />
          </g>
        ))}
        {/* Purple cabbage */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${118 + i * 6} ${150 + (i % 3) * 6} q 10 -6 22 0`} fill="none" stroke={['#6d2d63', '#8e4a86', '#a8669c'][i % 3]} strokeWidth="3.5" strokeLinecap="round" />
        ))}
        {/* Grilled chicken */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`rotate(-28 ${78 + i * 18} ${86 + i * 12})`}>
            <rect x={62 + i * 18} y={62 + i * 12} width="32" height="56" rx="11" fill="#d79a5c" stroke="#a8652f" strokeWidth="1" />
            {[0, 1, 2].map((m) => (
              <line key={m} x1={66 + i * 18} y1={74 + i * 12 + m * 14} x2={90 + i * 18} y2={70 + i * 12 + m * 14} stroke="#6b3f22" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
            ))}
          </g>
        ))}
        <path d="M50 92c20-16 34 18 54 0s34-16 50 10" fill="none" stroke="#f7ebd3" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}
