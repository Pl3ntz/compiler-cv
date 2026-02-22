import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth.js'

interface UserDetail {
  id: string
  name: string
  email: string
  role: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

interface UserCv {
  id: string
  locale: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

interface UserSession {
  id: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  expiresAt: string
}

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [cvs, setCvs] = useState<UserCv[]>([])
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(true)

  const isSelf = currentUser?.id === userId

  useEffect(() => {
    if (!userId) return
    fetch(`/api/admin/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found')
        return res.json()
      })
      .then((data) => {
        setUser(data.user)
        setCvs(data.cvs)
        setSessions(data.sessions)
      })
      .catch(() => navigate('/admin/users'))
      .finally(() => setLoading(false))
  }, [userId, navigate])

  const handleToggleRole = async () => {
    if (!user || !userId) return
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    const confirmed = confirm(`Alterar o papel deste usuário para "${newRole}"?`)
    if (!confirmed) return

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })

    if (res.ok) {
      setUser({ ...user, role: newRole })
    } else {
      const data = await res.json()
      alert(data.error ?? 'Falha ao atualizar usuário')
    }
  }

  const handleDelete = async () => {
    if (!user || !userId) return
    const confirmed = confirm(
      `Excluir usuário "${user.name}"? Isso também excluirá todos os CVs e sessões. Esta ação não pode ser desfeita.`
    )
    if (!confirmed) return

    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    if (res.ok) {
      navigate('/admin/users')
    } else {
      const data = await res.json()
      alert(data.error ?? 'Falha ao excluir usuário')
    }
  }

  if (loading || !user) {
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
        <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
        <Link to="/admin/users" className="px-3 py-2 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 hover:text-text-primary transition-all no-underline">
          Voltar para Usuários
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-forge-800 border border-forge-600 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Informações do Usuário</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="font-medium text-text-muted">ID</dt>
            <dd className="text-text-primary"><code className="text-xs bg-forge-700 px-1.5 py-0.5 rounded">{user.id}</code></dd>
            <dt className="font-medium text-text-muted">Email</dt>
            <dd className="text-text-primary">{user.email}</dd>
            <dt className="font-medium text-text-muted">Papel</dt>
            <dd>
              <span className={user.role === 'admin'
                ? 'px-2.5 py-1 text-xs font-medium rounded-full leading-none bg-warning/10 text-warning border border-warning/20'
                : 'px-2.5 py-1 text-xs font-medium rounded-full leading-none bg-forge-700 text-text-muted'
              }>
                {user.role}
              </span>
            </dd>
            <dt className="font-medium text-text-muted">Email Verificado</dt>
            <dd className="text-text-primary">{user.emailVerified ? 'Sim' : 'Não'}</dd>
            <dt className="font-medium text-text-muted">Cadastro</dt>
            <dd className="text-text-primary">{new Date(user.createdAt).toLocaleString('pt-BR')}</dd>
            <dt className="font-medium text-text-muted">Atualizado</dt>
            <dd className="text-text-primary">{new Date(user.updatedAt).toLocaleString('pt-BR')}</dd>
          </dl>

          {!isSelf && (
            <div className="flex gap-2 mt-6 pt-4 border-t border-forge-600">
              <button
                className={user.role === 'admin'
                  ? 'px-3 py-2 text-sm font-medium text-text-secondary border border-forge-500 rounded-lg hover:bg-forge-700 transition-all'
                  : 'px-3 py-2 text-sm font-medium text-white bg-ember-500 rounded-lg hover:bg-ember-400 transition-all'
                }
                onClick={handleToggleRole}
              >
                {user.role === 'admin' ? 'Rebaixar para Usuário' : 'Promover a Admin'}
              </button>
              <button
                className="px-3 py-2 text-sm font-medium text-error border border-error/30 rounded-lg hover:bg-error/10 transition-all"
                onClick={handleDelete}
              >
                Excluir Usuário
              </button>
            </div>
          )}
          {isSelf && (
            <p className="text-xs text-text-muted mt-4 italic">Você não pode modificar sua própria conta pelo painel admin.</p>
          )}
        </div>

        <div className="bg-forge-800 border border-forge-600 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">CVs ({cvs.length})</h2>
          {cvs.length === 0 ? (
            <p className="text-sm text-text-muted">Nenhum CV criado ainda.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-forge-600">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-forge-600">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary bg-forge-850">Idioma</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary bg-forge-850">Nome</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary bg-forge-850">Atualizado</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary bg-forge-850">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cvs.map((cv) => (
                    <tr key={cv.id} className="border-b border-forge-600/50 hover:bg-forge-750 transition-colors">
                      <td className="px-3 py-2 text-xs text-text-primary">{cv.locale.toUpperCase()}</td>
                      <td className="px-3 py-2 text-xs text-text-primary">{cv.name || '(vazio)'}</td>
                      <td className="px-3 py-2 text-xs text-text-muted">{new Date(cv.updatedAt).toLocaleDateString('pt-BR')}</td>
                      <td className="px-3 py-2 text-xs">
                        <a
                          href={`/cv/${userId}/${cv.id}`}
                          className="px-2 py-1 text-xs font-medium text-text-secondary border border-forge-500 rounded hover:bg-forge-700 transition-all"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-forge-800 border border-forge-600 rounded-xl p-6 mt-4">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Sessões ({sessions.length})</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-text-muted">Nenhuma sessão.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-forge-600">
            <table className="w-full">
              <thead>
                <tr className="border-b border-forge-600">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary bg-forge-850">Endereço IP</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary bg-forge-850">User Agent</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary bg-forge-850">Criado</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-text-secondary bg-forge-850">Expira</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-forge-600/50 hover:bg-forge-750 transition-colors">
                    <td className="px-3 py-2 text-xs text-text-primary">{s.ipAddress ?? '-'}</td>
                    <td className="px-3 py-2 text-xs text-text-muted max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{s.userAgent ?? '-'}</td>
                    <td className="px-3 py-2 text-xs text-text-muted">{new Date(s.createdAt).toLocaleString('pt-BR')}</td>
                    <td className="px-3 py-2 text-xs text-text-muted">{new Date(s.expiresAt).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}
