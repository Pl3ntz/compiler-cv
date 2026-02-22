import { motion } from 'framer-motion'

interface Props {
  readonly score: number
}

const RADIUS = 42
const STROKE = 7
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const THRESHOLD_ANGLE = 0.8 * 2 * Math.PI
const SIZE = 100

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  return '#ef4444'
}

function getLabel(score: number): { text: string; color: string } {
  if (score >= 80) return { text: 'Excelente', color: '#22c55e' }
  if (score >= 60) return { text: 'Bom', color: '#eab308' }
  return { text: 'Precisa Melhorar', color: '#ef4444' }
}

export default function AtsScoreGauge({ score }: Props) {
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
  const color = getScoreColor(score)
  const label = getLabel(score)

  const thresholdX = SIZE / 2 + RADIUS * Math.cos(THRESHOLD_ANGLE - Math.PI / 2)
  const thresholdY = SIZE / 2 + RADIUS * Math.sin(THRESHOLD_ANGLE - Math.PI / 2)
  const tickDx = 6 * Math.cos(THRESHOLD_ANGLE - Math.PI / 2)
  const tickDy = 6 * Math.sin(THRESHOLD_ANGLE - Math.PI / 2)

  return (
    <div className="text-center mb-3">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`ATS Score: ${score} out of 100. ${label.text}`}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#2a3550"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
        <line
          x1={thresholdX - tickDx}
          y1={thresholdY - tickDy}
          x2={thresholdX + tickDx}
          y2={thresholdY + tickDy}
          stroke="#5e6d85"
          strokeWidth="2"
        />
        <text
          x={SIZE / 2}
          y={SIZE / 2 - 4}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-2xl font-bold"
          style={{ fill: color }}
        >
          {score}
        </text>
        <text
          x={SIZE / 2}
          y={SIZE / 2 + 16}
          textAnchor="middle"
          className="text-xs"
          style={{ fill: '#5e6d85' }}
        >
          /100
        </text>
      </svg>
      <div className="text-sm font-semibold mt-1" style={{ color: label.color }}>
        {label.text}
      </div>
    </div>
  )
}
