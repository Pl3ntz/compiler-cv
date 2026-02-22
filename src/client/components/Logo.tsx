interface LogoProps {
  size?: number
  className?: string
  animated?: boolean
}

export default function Logo({ size = 36, className = '', animated = true }: LogoProps) {
  const dur = '1.6s'
  const p = '86 24' /* pivot = grip/wrist at right end of handle */

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      {/* ── ANVIL (trembles on impact) ── */}
      <g>
        {animated && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;0 0;0 1.5;0 0;0 0"
            keyTimes="0;0.46;0.50;0.56;1"
            dur={dur}
            repeatCount="indefinite"
          />
        )}
        <rect x="14" y="78" width="72" height="10" rx="3" fill="#9a7528" />
        <rect x="26" y="62" width="48" height="16" rx="2" fill="#c49535" />
        <rect x="16" y="50" width="68" height="14" rx="3" fill="#e8b84a" />
        <polygon points="16,50 2,56 2,58 16,64" fill="#d4a04a" />
        <rect x="18" y="51" width="64" height="3" rx="1" fill="#f0d060" opacity="0.4" />
      </g>

      {/* ── HAMMER ──
           Handle horizontal → RIGHT (grip/pivot at right end).
           Head at LEFT end, hanging below handle.
           Flat face = BOTTOM of head = horizontal at impact.
           Raised (+50°): head swings UP in arc from pivot.
           Impact (0°): handle horizontal, face flat on anvil.
      */}
      <g transform={animated ? undefined : `rotate(5, ${p})`}>
        {animated && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={`50 ${p};50 ${p};0 ${p};8 ${p};50 ${p}`}
            keyTimes="0;0.22;0.48;0.55;1"
            keySplines="0 0 1 1;0.42 0 1 0.6;0 0 0.4 1;0.25 0.1 0.7 1"
            calcMode="spline"
            dur={dur}
            repeatCount="indefinite"
          />
        )}
        {/* Handle (wooden, horizontal to the right) */}
        <rect x="52" y="20" width="34" height="8" rx="3" fill="#5C3D0E" />
        <rect x="53" y="21.5" width="32" height="5" rx="2" fill="#8B6914" opacity="0.5" />
        {/* Head (steel block at left end, hangs below handle) */}
        <rect x="38" y="18" width="18" height="30" rx="3" fill="#808094" />
        {/* Flat striking face — BOTTOM of head, horizontal at impact */}
        <rect x="38" y="45" width="18" height="3" rx="1.5" fill="#A0A0B8" />
        {/* Top highlight on head */}
        <rect x="39" y="19" width="16" height="2.5" rx="1" fill="#A0A0B8" opacity="0.35" />
        {/* Junction highlight (where handle meets head) */}
        <rect x="53" y="19" width="2.5" height="9" rx="1" fill="#A0A0B8" opacity="0.15" />
      </g>

      {/* ── IMPACT GLOW (centered under head) ── */}
      <circle cx="47" cy="49" r="6" fill="#ff6b35" opacity={animated ? 0 : 0.15}>
        {animated && (
          <animate
            attributeName="opacity"
            values="0;0;0.5;0.15;0"
            keyTimes="0;0.45;0.50;0.64;1"
            dur={dur}
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="47" cy="49" r="3" fill="#ffcc44" opacity={animated ? 0 : 0.35}>
        {animated && (
          <animate
            attributeName="opacity"
            values="0;0;0.9;0.35;0"
            keyTimes="0;0.45;0.50;0.64;1"
            dur={dur}
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* ── SPARKS (flash at impact, radiate from under the head) ── */}
      <g opacity={animated ? 0 : 1}>
        {animated && (
          <animate
            attributeName="opacity"
            values="0;0;1;1;0;0"
            keyTimes="0;0.46;0.49;0.56;0.72;1"
            dur={dur}
            repeatCount="indefinite"
          />
        )}

        {/* Left */}
        <line x1="40" y1="49" x2="14" y2="38" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="49" x2="6" y2="28" stroke="#ff8c42" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="49" x2="20" y2="32" stroke="#ffaa30" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right */}
        <line x1="52" y1="49" x2="78" y2="38" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="54" y1="49" x2="86" y2="28" stroke="#ff8c42" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="49" x2="70" y2="32" stroke="#ffaa30" strokeWidth="1.5" strokeLinecap="round" />

        {/* Dots at tips */}
        <circle cx="13" cy="37" r="2.5" fill="#ff6b35" />
        <circle cx="5" cy="27" r="2" fill="#ff8c42" />
        <circle cx="19" cy="31" r="1.5" fill="#ffaa30" />
        <circle cx="79" cy="37" r="2.5" fill="#ff6b35" />
        <circle cx="87" cy="27" r="2" fill="#ff8c42" />
        <circle cx="71" cy="31" r="1.5" fill="#ffaa30" />

        {/* Tiny particles */}
        <circle cx="10" cy="44" r="1" fill="#ff8c42" opacity="0.8" />
        <circle cx="82" cy="44" r="1" fill="#ff8c42" opacity="0.8" />
        <circle cx="16" cy="24" r="1" fill="#ffaa30" opacity="0.6" />
        <circle cx="76" cy="24" r="1" fill="#ffaa30" opacity="0.6" />
      </g>
    </svg>
  )
}
