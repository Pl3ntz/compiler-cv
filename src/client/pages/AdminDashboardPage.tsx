import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'

interface Stats {
  userCount: number
  cvCount: number
  activeSessionCount: number
  recentUsers: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: string
  }>
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) {
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
        <h1 className="text-2xl font-bold text-text-primary">Painel Admin</h1>
        <Link to="/admin/users" className="px-4 py-2.5 bg-ember-500 text-white text-sm font-medium rounded-lg hover:bg-ember-400 transition-all shadow-lg shadow-ember-500/20 no-underline">
          Gerenciar Usuários
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-forge-800 border border-forge-600 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-text-primary">{stats.userCount}</div>
          <div className="text-sm text-text-muted mt-1">Total de Usuários</div>
        </div>
        <div className="bg-forge-800 border border-forge-600 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-text-primary">{stats.cvCount}</div>
          <div className="text-sm text-text-muted mt-1">Total de CVs</div>
        </div>
        <div className="bg-forge-800 border border-forge-600 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-text-primary">{stats.activeSessionCount}</div>
          <div className="text-sm text-text-muted mt-1">Sessões Ativas</div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Usuários Recentes</h2>
        <div className="bg-forge-800 border border-forge-600 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-forge-600">
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Papel</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Cadastro</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary bg-forge-850">Ações</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((user) => (
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
      </div>
    </motion.div>
  )
}
