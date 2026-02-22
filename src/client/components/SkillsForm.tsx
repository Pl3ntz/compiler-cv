import type { CvInput } from '@/lib/zod-schemas/cv.js'

interface Props {
  data: CvInput
  onDataChange: (data: CvInput) => void
  labels: Record<string, string>
}

export default function SkillsForm({ data, onDataChange, labels }: Props) {
  const skills = data.skills

  const updateTitle = (value: string) => {
    onDataChange({ ...data, skills: { ...data.skills, title: value } })
  }

  const updateCategory = (index: number, field: string, value: string) => {
    const categories = skills.categories.map((cat, i) => i === index ? { ...cat, [field]: value } : cat)
    onDataChange({ ...data, skills: { ...data.skills, categories } })
  }

  const addCategory = () => {
    onDataChange({
      ...data,
      skills: { ...data.skills, categories: [...skills.categories, { name: '', values: '' }] },
    })
  }

  const removeCategory = (index: number) => {
    onDataChange({ ...data, skills: { ...data.skills, categories: skills.categories.filter((_, i) => i !== index) } })
  }

  const inputClass = 'w-full px-3 py-2.5 bg-forge-750 border border-forge-600 rounded-lg text-sm text-text-primary placeholder-text-muted focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all'

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="skills-title" className="block text-sm font-medium text-text-secondary mb-1">{labels.sectionTitle ?? 'Título da seção'}</label>
        <input id="skills-title" className={inputClass} value={skills.title} onChange={(e) => updateTitle(e.target.value)} />
      </div>

      {skills.categories.map((cat, index) => (
        <div className="border border-forge-600 rounded-lg p-4 mb-3 bg-forge-800/50" key={index}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm text-text-primary">{cat.name || `#${index + 1}`}</span>
            <button type="button" className="w-10 h-10 flex items-center justify-center border border-forge-500 rounded-lg text-text-muted hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors text-xs cursor-pointer" onClick={() => removeCategory(index)} aria-label={`Remover ${cat.name || `categoria ${index + 1}`}`}>x</button>
          </div>
          <div className="mb-4">
            <label htmlFor={`skill-${index}-name`} className="block text-sm font-medium text-text-secondary mb-1">{labels.categoryName ?? 'Grupo de habilidades'}</label>
            <input id={`skill-${index}-name`} className={inputClass} value={cat.name} onChange={(e) => updateCategory(index, 'name', e.target.value)} />
            <p className="text-xs text-text-muted mt-1">Ex: Linguagens de Programação, Frameworks, Ferramentas</p>
          </div>
          <div className="mb-4">
            <label htmlFor={`skill-${index}-values`} className="block text-sm font-medium text-text-secondary mb-1">{labels.categoryValues ?? 'Habilidades (separadas por vírgula)'}</label>
            <input id={`skill-${index}-values`} className={inputClass} value={cat.values} onChange={(e) => updateCategory(index, 'values', e.target.value)} />
            <p className="text-xs text-text-muted mt-1">Ex: Python, JavaScript, SQL</p>
          </div>
        </div>
      ))}

      <button type="button" className="px-4 py-2.5 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 transition-all" onClick={addCategory}>
        + {labels.addItem ?? 'Adicionar grupo'}
      </button>
    </div>
  )
}
