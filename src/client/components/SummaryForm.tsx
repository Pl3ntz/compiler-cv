import type { CvInput } from '@/lib/zod-schemas/cv.js'

interface Props {
  data: CvInput
  onDataChange: (data: CvInput) => void
  labels: Record<string, string>
}

export default function SummaryForm({ data, onDataChange, labels }: Props) {
  const summary = data.summary

  const inputClass = 'w-full px-3 py-2.5 bg-forge-750 border border-forge-600 rounded-lg text-sm text-text-primary placeholder-text-muted focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all'

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="summary-title" className="block text-sm font-medium text-text-secondary mb-1">{labels.sectionTitle ?? 'Título da seção'}</label>
        <input
          id="summary-title"
          className={inputClass}
          value={summary.title}
          onChange={(e) => {
            onDataChange({
              ...data,
              summary: { ...data.summary, title: e.target.value },
            })
          }}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="summary-text" className="block text-sm font-medium text-text-secondary mb-1">{labels.text ?? 'Texto do Resumo'}</label>
        <p className="text-xs text-text-muted mb-1">Descreva brevemente sua experiência e objetivos profissionais (2-4 linhas)</p>
        <textarea
          id="summary-text"
          className={`${inputClass} resize-y min-h-[120px]`}
          rows={6}
          value={summary.text}
          onChange={(e) => {
            onDataChange({
              ...data,
              summary: { ...data.summary, text: e.target.value },
            })
          }}
        />
      </div>
    </div>
  )
}
