import Logo from './Logo.js'

interface BrandProps {
  iconSize?: number
  className?: string
  textClassName?: string
  animated?: boolean
}

export default function Brand({
  iconSize = 36,
  className = '',
  textClassName = 'text-lg',
  animated = true,
}: BrandProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Logo size={iconSize} animated={animated} />
      <span
        className={`font-brand font-semibold tracking-[0.15em] uppercase bg-gradient-to-r from-text-primary to-molten-400 bg-clip-text text-transparent select-none ${textClassName}`}
      >
        Forja
      </span>
    </span>
  )
}
