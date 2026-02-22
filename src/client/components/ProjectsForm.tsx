import type { CvInput } from '@/lib/zod-schemas/cv.js'

interface Props {
  data: CvInput
  onDataChange: (data: CvInput) => void
  labels: Record<string, string>
}

export default function ProjectsForm({ data, onDataChange, labels }: Props) {
  const projects = data.projects

  const updateTitle = (value: string) => {
    onDataChange({ ...data, projects: { ...data.projects, title: value } })
  }

  const updateItem = (index: number, field: string, value: string) => {
    const items = projects.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
    onDataChange({ ...data, projects: { ...data.projects, items } })
  }

  const addItem = () => {
    onDataChange({
      ...data,
      projects: {
        ...data.projects,
        items: [...projects.items, { name: '', tech: '', date: '', highlights: [] }],
      },
    })
  }

  const removeItem = (index: number) => {
    onDataChange({ ...data, projects: { ...data.projects, items: projects.items.filter((_, i) => i !== index) } })
  }

  const updateHighlight = (itemIndex: number, hlIndex: number, value: string) => {
    const items = projects.items.map((item, i) => {
      if (i !== itemIndex) return item
      const highlights = item.highlights.map((h, j) => (j === hlIndex ? value : h))
      return { ...item, highlights }
    })
    onDataChange({ ...data, projects: { ...data.projects, items } })
  }

  const addHighlight = (itemIndex: number) => {
    const items = projects.items.map((item, i) => i === itemIndex ? { ...item, highlights: [...item.highlights, ''] } : item)
    onDataChange({ ...data, projects: { ...data.projects, items } })
  }

  const removeHighlight = (itemIndex: number, hlIndex: number) => {
    const items = projects.items.map((item, i) => i === itemIndex ? { ...item, highlights: item.highlights.filter((_, j) => j !== hlIndex) } : item)
    onDataChange({ ...data, projects: { ...data.projects, items } })
  }

  const inputClass = 'w-full px-3 py-2.5 bg-forge-750 border border-forge-600 rounded-lg text-sm text-text-primary placeholder-text-muted focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all'

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="proj-title" className="block text-sm font-medium text-text-secondary mb-1">{labels.sectionTitle ?? 'Título da seção'}</label>
        <input id="proj-title" className={inputClass} value={projects.title} onChange={(e) => updateTitle(e.target.value)} />
      </div>

      {projects.items.map((item, index) => (
        <div className="border border-forge-600 rounded-lg p-4 mb-3 bg-forge-800/50" key={index}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm text-text-primary">{item.name || `#${index + 1}`}</span>
            <button type="button" className="w-10 h-10 flex items-center justify-center border border-forge-500 rounded-lg text-text-muted hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors text-xs cursor-pointer" onClick={() => removeItem(index)} aria-label={`Remover ${item.name || `item ${index + 1}`}`}>x</button>
          </div>
          <div className="mb-4">
            <label htmlFor={`proj-${index}-name`} className="block text-sm font-medium text-text-secondary mb-1">{labels.projectName ?? 'Nome do Projeto'}</label>
            <input id={`proj-${index}-name`} className={inputClass} value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor={`proj-${index}-tech`} className="block text-sm font-medium text-text-secondary mb-1">{labels.tech ?? 'Tecnologias utilizadas'}</label>
            <input id={`proj-${index}-tech`} className={inputClass} value={item.tech} onChange={(e) => updateItem(index, 'tech', e.target.value)} />
            <p className="text-xs text-text-muted mt-1">Ex: React, Node.js, PostgreSQL</p>
          </div>
          <div className="mb-4">
            <label htmlFor={`proj-${index}-date`} className="block text-sm font-medium text-text-secondary mb-1">{labels.date ?? 'Período'}</label>
            <input id={`proj-${index}-date`} className={inputClass} value={item.date} onChange={(e) => updateItem(index, 'date', e.target.value)} />
            <p className="text-xs text-text-muted mt-1">Ex: Jun 2023 - Ago 2023</p>
          </div>
          <div className="mb-4">
            <label id={`proj-${index}-highlights-label`} className="block text-sm font-medium text-text-secondary mb-1">{labels.highlights ?? 'Principais realizações'}</label>
            <p className="text-xs text-text-muted mb-1">Liste conquistas, resultados ou responsabilidades. Uma por linha.</p>
            <div className="flex flex-col gap-2" role="group" aria-labelledby={`proj-${index}-highlights-label`}>
              {item.highlights.map((h, hlIndex) => (
                <div className="flex gap-2" key={hlIndex}>
                  <input className={`${inputClass} flex-1`} value={h} aria-label={`${labels.highlights ?? 'Realização'} ${hlIndex + 1}`} onChange={(e) => updateHighlight(index, hlIndex, e.target.value)} />
                  <button type="button" className="w-10 h-10 flex items-center justify-center border border-forge-500 rounded-lg text-text-muted hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors text-xs cursor-pointer flex-shrink-0" onClick={() => removeHighlight(index, hlIndex)} aria-label={`Remover realização ${hlIndex + 1}`}>x</button>
                </div>
              ))}
              <button type="button" className="px-3 py-2 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 transition-all self-start" onClick={() => addHighlight(index)}>
                + {labels.addHighlight ?? 'Adicionar realização'}
              </button>
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="px-4 py-2.5 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 transition-all" onClick={addItem}>
        + {labels.addItem ?? 'Adicionar Projeto'}
      </button>
    </div>
  )
}
