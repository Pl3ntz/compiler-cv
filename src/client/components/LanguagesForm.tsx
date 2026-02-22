import type { CvInput } from '@/lib/zod-schemas/cv.js'

interface Props {
  data: CvInput
  onDataChange: (data: CvInput) => void
  labels: Record<string, string>
}

export default function LanguagesForm({ data, onDataChange, labels }: Props) {
  const languages = data.languages

  const updateItem = (index: number, field: string, value: string) => {
    const items = languages.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
    onDataChange({ ...data, languages: { ...data.languages, items } })
  }

  const addItem = () => {
    onDataChange({
      ...data,
      languages: { ...data.languages, items: [...languages.items, { name: '', level: '' }] },
    })
  }

  const removeItem = (index: number) => {
    onDataChange({ ...data, languages: { ...data.languages, items: languages.items.filter((_, i) => i !== index) } })
  }

  const inputClass = 'w-full px-3 py-2.5 bg-forge-750 border border-forge-600 rounded-lg text-sm text-text-primary placeholder-text-muted focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all'

  return (
    <div>
      {languages.items.map((item, index) => (
        <div className="border border-forge-600 rounded-lg p-4 mb-3 bg-forge-800/50" key={index}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm text-text-primary">{item.name || `#${index + 1}`}</span>
            <button type="button" className="w-10 h-10 flex items-center justify-center border border-forge-500 rounded-lg text-text-muted hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors text-xs cursor-pointer" onClick={() => removeItem(index)} aria-label={`Remover ${item.name || `item ${index + 1}`}`}>x</button>
          </div>
          <div className="mb-4">
            <label htmlFor={`lang-${index}-name`} className="block text-sm font-medium text-text-secondary mb-1">{labels.languageName ?? 'Idioma'}</label>
            <input id={`lang-${index}-name`} className={inputClass} value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor={`lang-${index}-level`} className="block text-sm font-medium text-text-secondary mb-1">{labels.level ?? 'Nível'}</label>
            <input id={`lang-${index}-level`} className={inputClass} value={item.level} onChange={(e) => updateItem(index, 'level', e.target.value)} />
            <p className="text-xs text-text-muted mt-1">Ex: Nativo, Fluente, Intermediário, Básico</p>
          </div>
        </div>
      ))}

      <button type="button" className="px-4 py-2.5 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 transition-all" onClick={addItem}>
        + {labels.addItem ?? 'Adicionar Idioma'}
      </button>
    </div>
  )
}
