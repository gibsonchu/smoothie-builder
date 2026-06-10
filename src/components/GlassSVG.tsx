import type { GlassId } from '../data/glassware'

type Props = {
  id: GlassId
  fill?: number
  color?: string
  compact?: boolean
}

export function GlassSVG({ id, fill = 0, color = '#f2b264', compact = false }: Props) {
  const height = compact ? 104 : 168
  const fillY = 150 - fill * 1.12

  if (id === 'mug') {
    return (
      <svg viewBox="0 0 120 170" width={compact ? 78 : 132} height={height} aria-hidden="true">
        <defs>
          <clipPath id={`clip-${id}`}><path d="M28 52h58v82c0 14-11 23-29 23S28 148 28 134z" /></clipPath>
        </defs>
        <path d="M84 75h18c11 0 16 8 16 20s-6 22-20 22H84v-14h11c7 0 10-3 10-9s-3-8-9-8H84z" fill="#d9d1c6" stroke="var(--glass-line)" strokeWidth="4" />
        <path d="M24 48h66v87c0 17-13 27-33 27s-33-10-33-27z" fill="#efe5da" stroke="var(--glass-line)" strokeWidth="4" />
        <g clipPath={`url(#clip-${id})`}><rect x="24" y={fillY} width="70" height="130" fill={color} opacity="0.9" /></g>
      </svg>
    )
  }

  if (id === 'coupe') {
    return (
      <svg viewBox="0 0 120 170" width={compact ? 82 : 136} height={height} aria-hidden="true">
        <defs><clipPath id={`clip-${id}`}><path d="M16 38c7 35 25 53 44 53s37-18 44-53z" /></clipPath></defs>
        <g clipPath={`url(#clip-${id})`}><rect x="12" y={fillY - 28} width="96" height="90" fill={color} opacity="0.86" /></g>
        <path d="M16 38c7 35 25 53 44 53s37-18 44-53z" fill="rgba(255,255,255,.18)" stroke="var(--glass-line)" strokeWidth="4" />
        <path d="M60 90v54M38 154h44" stroke="var(--glass-line)" strokeWidth="5" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'wood') {
    return (
      <svg viewBox="0 0 120 170" width={compact ? 78 : 132} height={height} aria-hidden="true">
        <defs>
          <clipPath id={`clip-${id}`}><path d="M30 38h60l-7 116H37z" /></clipPath>
          <linearGradient id="woodgrain" x1="0" x2="1"><stop stopColor="#9a6334" /><stop offset="1" stopColor="#d29b61" /></linearGradient>
        </defs>
        <path d="M30 38h60l-7 116H37z" fill="url(#woodgrain)" stroke="#654021" strokeWidth="4" />
        <path d="M42 48c8 18-10 42 4 67M61 43c-8 25 13 49 1 91M78 51c-7 18 4 39-4 76" fill="none" stroke="#704722" strokeWidth="2" opacity=".45" />
        <g clipPath={`url(#clip-${id})`}><rect x="30" y={fillY} width="60" height="120" fill={color} opacity="0.72" /></g>
      </svg>
    )
  }

  const paths: Record<GlassId, string> = {
    highball: 'M35 22h50l-6 136H41z',
    mason: 'M28 34h64l-6 121H34z',
    stemless: 'M25 30c2 80 18 128 35 128s33-48 35-128z',
    doublewall: 'M30 28h60l-8 126H38z',
    vintage: 'M31 42h58l-9 112H40z',
    mug: '',
    coupe: '',
    wood: '',
  }

  return (
    <svg viewBox="0 0 120 170" width={compact ? 78 : 132} height={height} aria-hidden="true">
      <defs><clipPath id={`clip-${id}`}><path d={paths[id]} /></clipPath></defs>
      {id === 'mason' && <path d="M25 26h70M31 34h58" stroke="var(--glass-line)" strokeWidth="5" strokeLinecap="round" opacity=".9" />}
      <g clipPath={`url(#clip-${id})`}>
        <rect x="20" y={fillY} width="80" height="132" fill={color} opacity="0.86" />
        {id === 'vintage' && Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${37 + i * 8} 105v45`} stroke="rgba(255,255,255,.35)" strokeWidth="2" />)}
      </g>
      <path d={paths[id]} fill="rgba(255,255,255,.16)" stroke="var(--glass-line)" strokeWidth="4" />
      {id === 'doublewall' && <path d="M43 45h34l-4 82H47z" fill="none" stroke="var(--glass-line)" strokeWidth="2" opacity=".65" />}
      {id === 'highball' && <path d="M45 32h2M73 32h2" stroke="white" strokeWidth="3" opacity=".55" />}
    </svg>
  )
}
