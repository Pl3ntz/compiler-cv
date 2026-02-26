import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router'
import { motion } from 'framer-motion'

interface FeedbackRow {
  id: string
  type: string
  rating: number
  message: string
  contactEmail: string | null
  createdAt: string
}

interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

const TYPE_FILTERS = [
  { label: 'Todos', value: '' },
  { label: 'Usuarios', value: 'user' },
  { label: 'Recrutadores', value: 'recruiter' },
] as const

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? '#f59e0b' : 'none'}
          stroke={i < rating ? '#f59e0b' : '#6b7280'}
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </div>
  )
}

export default function AdminFeedbackPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const typeFilter = searchParams.get('type') ?? ''
  const [rows, setRows] = useState<FeedbackRow[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (typeFilter) params.set('type', typeFilter)

    fetch(`/api/admin/feedback?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data.feedback)
        setMeta(data.meta)
        setAverageRating(data.averageRating)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [page, typeFilter])

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Excluir este feedback?')
    if (!confirmed) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.id !== id))
        if (meta) setMeta({ ...meta, total: meta.total - 1 })
      }
    } catch {
      // ignore
    } finally {
      setDeletingId(null)
    }
  }

  const setFilter = (value: string) => {
    const params: Record<string, string> = {}
    if (value) params.type = value
    setSearchParams(params)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-forge-600 border-t-ember-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Feedbacks ({meta?.total ?? 0})</h1>
        <Link to="/admin" className="px-3 py-2 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 hover:text-text-primary transition-all no-underline">
          Voltar ao Painel
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-forge-800 border border-forge-600 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-text-primary">{averageRating || '-'}</div>
          <div className="text-sm text-text-muted mt-1">Avaliacao Media</div>
        </div>
        <div className="bg-forge-800 border border-forge-600 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-text-primary">{meta?.total ?? 0}</div>
          <div className="text-sm text-text-muted mt-1">Total de Feedbacks</div>
        </div>
      </div>

      {/* Type filter pills */}
      <div className="flex gap-2 mb-4">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer border ${
              typeFilter === f.value
                ? 'bg-ember-500/15 text-ember-400 border-ember-500/30'
                : 'bg-forge-700 text-text-secondary border-forge-600 hover:bg-forge-600'
            }`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-forge-800 border border-forge-600 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-forge-600">
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Nota</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Mensagem</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">E-mail</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Data</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-muted">
                  Nenhum feedback encontrado.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-forge-600/50 hover:bg-forge-750 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    <span className={
                      row.type === 'recruiter'
                        ? 'px-2.5 py-1 text-xs font-medium rounded-full leading-none bg-molten-500/10 text-molten-400 border border-molten-500/20'
                        : 'px-2.5 py-1 text-xs font-medium rounded-full leading-none bg-forge-700 text-text-muted'
                    }>
                      {row.type === 'recruiter' ? 'Recrutador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StarDisplay rating={row.rating} />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary max-w-xs truncate">{row.message || '-'}</td>
                  <td className="px-4 py-3 text-sm text-text-muted">{row.contactEmail || '-'}</td>
                  <td className="px-4 py-3 text-sm text-text-muted">{new Date(row.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-medium text-error border border-error/30 rounded-lg hover:bg-error/10 transition-all cursor-pointer bg-transparent disabled:opacity-50"
                      disabled={deletingId === row.id}
                      onClick={() => handleDelete(row.id)}
                    >
                      {deletingId === row.id ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          {page > 1 && (
            <button
              type="button"
              className="px-3 py-2 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 transition-all"
              onClick={() => setSearchParams({ page: String(page - 1), ...(typeFilter ? { type: typeFilter } : {}) })}
            >
              Anterior
            </button>
          )}
          <span className="text-sm text-text-muted">Pagina {page} de {meta.totalPages}</span>
          {page < meta.totalPages && (
            <button
              type="button"
              className="px-3 py-2 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 transition-all"
              onClick={() => setSearchParams({ page: String(page + 1), ...(typeFilter ? { type: typeFilter } : {}) })}
            >
              Proxima
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
