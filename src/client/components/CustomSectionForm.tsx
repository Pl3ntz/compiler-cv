import type { CvInput } from '@/lib/zod-schemas/cv.js'

interface Props {
  sectionId: string
  data: CvInput
  onDataChange: (data: CvInput) => void
}

export default function CustomSectionForm({ sectionId, data, onDataChange }: Props) {
  const sections = data.customSections ?? []
  const section = sections.find(s => s.id === sectionId)
  if (!section) return null

  const updateSection = (updated: typeof section) => {
    const customSections = sections.map(s => s.id === sectionId ? updated : s)
    onDataChange({ ...data, customSections })
  }

  const updateTitle = (title: string) => {
    updateSection({ ...section, title })
  }

  const updateItemText = (index: number, text: string) => {
    const items = section.items.map((item, i) => i === index ? { ...item, text } : item)
    updateSection({ ...section, items })
  }

  const addItem = () => {
    updateSection({ ...section, items: [...section.items, { text: '' }] })
  }

  const removeItem = (index: number) => {
    updateSection({ ...section, items: section.items.filter((_, i) => i !== index) })
  }

  const inputClass = 'w-full px-3 py-2.5 bg-forge-750 border border-forge-600 rounded-lg text-sm text-text-primary placeholder-text-muted focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all'

  return (
    <div>
      <div className="mb-4">
        <label htmlFor={`cs-${sectionId}-title`} className="block text-sm font-medium text-text-secondary mb-1">Titulo da secao</label>
        <input
          id={`cs-${sectionId}-title`}
          className={inputClass}
          value={section.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Ex: Certificacoes, Voluntariado, Premios..."
        />
      </div>

      {section.items.map((item, index) => (
        <div className="border border-forge-600 rounded-lg p-4 mb-3 bg-forge-800/50" key={index}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm text-text-primary">Item #{index + 1}</span>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center border border-forge-500 rounded-lg text-text-muted hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors text-xs cursor-pointer"
              onClick={() => removeItem(index)}
              aria-label={`Remover item ${index + 1}`}
            >
              x
            </button>
          </div>
          <div>
            <label htmlFor={`cs-${sectionId}-item-${index}`} className="block text-sm font-medium text-text-secondary mb-1">Texto</label>
            <input
              id={`cs-${sectionId}-item-${index}`}
              className={inputClass}
              value={item.text}
              onChange={(e) => updateItemText(index, e.target.value)}
              placeholder="Descreva o item..."
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="px-4 py-2.5 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 transition-all"
        onClick={addItem}
      >
        + Adicionar item
      </button>
    </div>
  )
}
