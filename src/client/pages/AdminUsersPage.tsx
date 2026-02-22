import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router'
import { motion } from 'framer-motion'

interface UserRow {
  id: string
  name: string
  email: string
  role: string
  emailVerified: boolean
  createdAt: string
  cvCount: number
}

interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const [users, setUsers] = useState<UserRow[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/users?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users)
        setMeta(data.meta)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

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
        <h1 className="text-2xl font-bold text-text-primary">Usuários ({meta?.total ?? 0})</h1>
        <Link to="/admin" className="px-3 py-2 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 hover:text-text-primary transition-all no-underline">
          Voltar ao Painel
        </Link>
      </div>

      <div className="bg-forge-800 border border-forge-600 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-forge-600">
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Papel</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">CVs</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Verificado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Cadastro</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-forge-600/50 hover:bg-forge-750 transition-colors">
                <td className="px-4 py-3 text-sm text-text-primary">{user.name}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={user.role === 'admin'
                    ? 'px-2.5 py-1 text-xs font-medium rounded-full leading-none bg-warning/10 text-warning border border-warning/20'
                    : 'px-2.5 py-1 text-xs font-medium rounded-full leading-none bg-forge-700 text-text-muted'
                  }>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">{user.cvCount}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{user.emailVerified ? 'Sim' : 'Não'}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-sm">
                  <Link to={`/admin/users/${user.id}`} className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 hover:text-text-primary transition-all no-underline">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          {page > 1 && (
            <button
              className="px-3 py-2 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 transition-all"
              onClick={() => setSearchParams({ page: String(page - 1) })}
            >
              Anterior
            </button>
          )}
          <span className="text-sm text-text-muted">Página {page} de {meta.totalPages}</span>
          {page < meta.totalPages && (
            <button
              className="px-3 py-2 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 transition-all"
              onClick={() => setSearchParams({ page: String(page + 1) })}
            >
              Próxima
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
