import type { ReactNode } from 'react'
import type { Cuisine } from '../../types/restaurant'

// Flat, top-down food illustrations, one per cuisine, in the same style as the link-preview bowl.
// Food colors are fixed (food looks the same in any theme); plates stay light like real plates.
// Decorative only: the restaurant name and cuisine are always shown as text next to them.

const PLATE = '#fffdf9'
const PLATE_RIM = '#e9dfd2'

function Plate({ r = 50 }: { r?: number }) {
  return (
    <>
      <circle cx="60" cy="62" r={r + 2} fill="#000" opacity="0.08" />
      <circle cx="60" cy="60" r={r} fill={PLATE} />
      <circle cx="60" cy="60" r={r - 7} fill="none" stroke={PLATE_RIM} strokeWidth="1.5" />
    </>
  )
}

function GrillArt() {
  return (
    <>
      <Plate />
      {/* Greens */}
      {([
        [38, 44, 11],
        [32, 58, 10],
        [40, 70, 11],
        [47, 52, 9],
      ] as [number, number, number][]).map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#4f9450' : '#3d7f45'} />
      ))}
      {/* Grilled chicken breast */}
      <path d="M52 40c14-6 32 2 34 16s-8 28-22 28-24-10-22-24c1-9 3-16 10-20Z" fill="#dba068" />
      <path d="M52 40c14-6 32 2 34 16s-8 28-22 28" fill="none" stroke="#b97a40" strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={54 + i * 7} y1={46 + i * 2} x2={66 + i * 7} y2={70 + i * 2} stroke="#7a4521" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      ))}
      {/* Lemon wedge */}
      <path d="M70 86a14 14 0 0 0 18-14Z" fill="#f2d14b" stroke="#e0b92e" strokeWidth="1.5" />
    </>
  )
}

function MediterraneanArt() {
  return (
    <>
      <Plate />
      {/* Hummus */}
      <circle cx="44" cy="48" r="17" fill="#e8cfa0" />
      <path d="M36 46c4-6 14-6 16 2" fill="none" stroke="#c79a5a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="45" cy="50" r="3" fill="#b5a33a" />
      {/* Skewers */}
      {[0, 1].map((s) => (
        <g key={s} transform={`translate(${s * 8} ${s * 12})`}>
          <line x1="50" y1="80" x2="92" y2="58" stroke="#8a6a4a" strokeWidth="2.5" strokeLinecap="round" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={58 + i * 11} y={66 - i * 6} width="10" height="10" rx="2.5" fill={i % 2 ? '#c9874a' : '#d99a5c'} transform={`rotate(-28 ${63 + i * 11} ${71 - i * 6})`} />
          ))}
        </g>
      ))}
      {/* Cucumber, tomato, olives */}
      {([
        [76, 36],
        [86, 44],
      ] as [number, number][]).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="#cfe3a6" stroke="#6b9a3a" strokeWidth="2" />
          <circle cx={x} cy={y} r="2" fill="#e8f1cf" />
        </g>
      ))}
      <circle cx="34" cy="72" r="7" fill="#d6452a" />
      <circle cx="34" cy="72" r="4" fill="#ef7a5a" />
      <ellipse cx="62" cy="30" rx="4" ry="3" fill="#3b2f3f" />
      <ellipse cx="70" cy="28" rx="4" ry="3" fill="#4a3c4f" />
    </>
  )
}

function MexicanArt() {
  return (
    <>
      {/* Cast-iron skillet */}
      <rect x="92" y="54" width="26" height="12" rx="6" fill="#3a3330" />
      <circle cx="58" cy="62" r="52" fill="#000" opacity="0.08" />
      <circle cx="56" cy="60" r="50" fill="#3a3330" />
      <circle cx="56" cy="60" r="43" fill="#4a423e" />
      {/* Steak strips */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={30 + i * 9} y="32" width="8" height="34" rx="4" fill={i % 2 ? '#8e4529' : '#a3532f'} transform={`rotate(24 ${34 + i * 9} 49)`} />
      ))}
      {/* Peppers */}
      <path d="M62 34c8 2 14 8 16 16" fill="none" stroke="#e05a2c" strokeWidth="5" strokeLinecap="round" />
      <path d="M66 42c6 2 10 6 12 12" fill="none" stroke="#f2c94c" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 46c5 1 9 4 11 9" fill="none" stroke="#5a9a3c" strokeWidth="5" strokeLinecap="round" />
      {/* Black beans and corn */}
      {[...Array(10)].map((_, i) => (
        <ellipse key={i} cx={34 + (i % 5) * 6} cy={74 + Math.floor(i / 5) * 6} rx="3" ry="2.2" fill="#231d1c" />
      ))}
      {[...Array(8)].map((_, i) => (
        <rect key={i} x={62 + (i % 4) * 5} y={70 + Math.floor(i / 4) * 5} width="4" height="4" rx="1" fill="#f2c94c" />
      ))}
      {/* Lime */}
      <path d="M72 86a12 12 0 0 0 16-10Z" fill="#9ccc4f" stroke="#6a9a2e" strokeWidth="1.5" />
    </>
  )
}

function AsianArt() {
  return (
    <>
      {/* Chopsticks */}
      <line x1="70" y1="6" x2="112" y2="44" stroke="#b88a58" strokeWidth="4" strokeLinecap="round" />
      <line x1="78" y1="4" x2="116" y2="38" stroke="#a5784a" strokeWidth="4" strokeLinecap="round" />
      {/* Bowl */}
      <circle cx="60" cy="64" r="50" fill="#000" opacity="0.08" />
      <circle cx="58" cy="62" r="48" fill="#2f4a5c" />
      <circle cx="58" cy="62" r="41" fill="#f7f3ea" />
      {[...Array(18)].map((_, i) => (
        <ellipse key={i} cx={34 + (i * 13) % 48} cy={44 + ((i * 7) % 36)} rx="2.4" ry="1.4" fill="#e6dfd0" transform={`rotate(${i * 37} ${34 + (i * 13) % 48} ${44 + ((i * 7) % 36)})`} />
      ))}
      {/* Teriyaki chicken */}
      {([
        [48, 54],
        [60, 50],
        [54, 64],
        [66, 62],
      ] as [number, number][]).map(([x, y], i) => (
        <rect key={i} x={x - 7} y={y - 6} width="14" height="12" rx="4" fill={i % 2 ? '#9e5222' : '#b8642c'} />
      ))}
      {/* Broccoli */}
      {([
        [76, 76],
        [40, 74],
      ] as [number, number][]).map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 2} y={y} width="4" height="8" rx="2" fill="#7fb06a" />
          <circle cx={x - 4} cy={y - 1} r="5" fill="#3f8a4c" />
          <circle cx={x + 4} cy={y - 1} r="5" fill="#3f8a4c" />
          <circle cx={x} cy={y - 5} r="5" fill="#4f9a5a" />
        </g>
      ))}
      {/* Edamame */}
      {([
        [70, 40],
        [76, 46],
        [44, 38],
      ] as [number, number][]).map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="6" ry="3.2" fill="#8cc06a" transform={`rotate(${30 + i * 25} ${x} ${y})`} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={50 + i * 4} cy={57 + (i % 2) * 6} r="0.9" fill="#f7ecd6" />
      ))}
    </>
  )
}

function CafeArt() {
  return (
    <>
      {/* Coffee cup */}
      <circle cx="96" cy="26" r="16" fill="#000" opacity="0.08" />
      <circle cx="95" cy="24" r="15" fill={PLATE} stroke={PLATE_RIM} strokeWidth="1.5" />
      <circle cx="95" cy="24" r="10" fill="#6b4a35" />
      <path d="M90 22c3-2 7-2 10 1" fill="none" stroke="#c9a27e" strokeWidth="1.5" strokeLinecap="round" />
      {/* Plate */}
      <circle cx="54" cy="68" r="46" fill="#000" opacity="0.08" />
      <circle cx="52" cy="66" r="44" fill={PLATE} />
      <circle cx="52" cy="66" r="37" fill="none" stroke={PLATE_RIM} strokeWidth="1.5" />
      {/* Toast */}
      <rect x="22" y="56" width="30" height="30" rx="7" fill="#b77a3e" transform="rotate(-12 37 71)" />
      <rect x="25" y="59" width="24" height="24" rx="5" fill="#dcaa68" transform="rotate(-12 37 71)" />
      {/* Avocado */}
      <ellipse cx="38" cy="64" rx="9" ry="6" fill="#bcd77f" transform="rotate(-12 38 64)" />
      {/* Eggs */}
      {([
        [62, 54],
        [70, 72],
      ] as [number, number][]).map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 12} ${y}c0-8 7-12 13-11 7 1 12 5 11 12-1 6-7 10-13 9-7-1-11-4-11-10Z`} fill="#fffaf0" stroke="#efe3cc" strokeWidth="1" />
          <circle cx={x} cy={y} r="5.5" fill="#f4b630" />
        </g>
      ))}
    </>
  )
}

function SteakhouseArt() {
  return (
    <>
      {/* Board */}
      <rect x="10" y="22" width="100" height="78" rx="14" fill="#000" opacity="0.08" transform="translate(2 3)" />
      <rect x="10" y="22" width="100" height="78" rx="14" fill="#b98552" />
      <rect x="16" y="28" width="88" height="66" rx="10" fill="#c99561" />
      <circle cx="100" cy="34" r="3" fill="#8f6438" />
      {/* Sliced steak */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`rotate(-8 ${34 + i * 11} 58)`}>
          <rect x={28 + i * 11} y="40" width="12" height="38" rx="4" fill="#6e3020" />
          <rect x={30 + i * 11} y="43" width="8" height="32" rx="3" fill={i % 2 ? '#c8645a' : '#d47468'} />
        </g>
      ))}
      {/* Asparagus */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1="40" y1={84 + i * 4} x2="92" y2={78 + i * 4} stroke="#6d9a3c" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="93" cy={78 + i * 4} rx="4" ry="2.4" fill="#4f7a2c" />
        </g>
      ))}
      {/* Rosemary */}
      <path d="M86 36l10 26" stroke="#3f6b3a" strokeWidth="2" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={89 + i * 2.4} cy={42 + i * 6} rx="4" ry="1.4" fill="#4f8a4a" transform={`rotate(${i % 2 ? 40 : -40} ${89 + i * 2.4} ${42 + i * 6})`} />
      ))}
    </>
  )
}

const ART: Record<Cuisine, () => ReactNode> = {
  Grill: GrillArt,
  Mediterranean: MediterraneanArt,
  Mexican: MexicanArt,
  Asian: AsianArt,
  Café: CafeArt,
  Steakhouse: SteakhouseArt,
}

/** A dish illustration for a cuisine, on a soft tinted tile. */
export function CuisineArt({ cuisine, className = '' }: { cuisine: Cuisine; className?: string }) {
  const Art = ART[cuisine]
  return (
    <span className={`block overflow-hidden rounded-2xl bg-brand-tint ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="block size-full" focusable="false">
        <Art />
      </svg>
    </span>
  )
}
