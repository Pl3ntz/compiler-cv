import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { authClient } from '@/lib/auth-client.js'

interface Props {
  userName: string
  userEmail: string
}

export default function SettingsForm({ userName, userEmail }: Props) {
  const [name, setName] = useState(userName)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nameStatus, setNameStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [nameError, setNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNameError('')
    setNameStatus('saving')

    try {
      const result = await authClient.updateUser({ name })
      if (result.error) {
        setNameError(result.error.message ?? 'Falha ao atualizar nome')
        setNameStatus('error')
        return
      }
      setNameStatus('saved')
    } catch {
      setNameError('Ocorreu um erro inesperado')
      setNameStatus('error')
    }
  }

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordError('')

    if (newPassword.length < 8) {
      setPasswordError('A nova senha deve ter pelo menos 8 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem')
      return
    }

    setPasswordStatus('saving')

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (result.error) {
        setPasswordError(result.error.message ?? 'Falha ao alterar senha')
        setPasswordStatus('error')
        return
      }
      setPasswordStatus('saved')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setPasswordError('Ocorreu um erro inesperado')
      setPasswordStatus('error')
    }
  }

  const inputClass = 'w-full px-3.5 py-3 bg-forge-750 border border-forge-600 rounded-lg text-sm text-text-primary placeholder-text-muted focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 focus:outline-none transition-all'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-forge-800 border border-forge-600 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-5">Perfil</h2>
        <form onSubmit={handleUpdateName}>
          <div className="mb-4">
            <label htmlFor="settings-email" className="block text-sm font-medium text-text-secondary mb-1.5">E-mail</label>
            <input
              id="settings-email"
              type="email"
              className={`${inputClass} opacity-50 cursor-not-allowed`}
              value={userEmail}
              disabled
            />
          </div>
          <div className="mb-4">
            <label htmlFor="settings-name" className="block text-sm font-medium text-text-secondary mb-1.5">Nome</label>
            <input
              id="settings-name"
              type="text"
              className={inputClass}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setNameStatus('idle')
              }}
            />
          </div>
          <AnimatePresence>
            {nameError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-error/10 border border-error/30 text-error rounded-lg p-3 mb-4 text-sm"
              >
                {nameError}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="submit"
            className="px-5 py-2.5 bg-ember-500 text-white font-semibold rounded-lg hover:bg-ember-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            disabled={nameStatus === 'saving'}
          >
            {nameStatus === 'saving'
              ? 'Salvando...'
              : nameStatus === 'saved'
                ? 'Salvo!'
                : 'Atualizar nome'}
          </button>
        </form>
      </div>

      <div className="bg-forge-800 border border-forge-600 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-5">Alterar senha</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="current-password" className="block text-sm font-medium text-text-secondary mb-1.5">Senha atual</label>
            <input
              id="current-password"
              type="password"
              className={inputClass}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                setPasswordStatus('idle')
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="new-password" className="block text-sm font-medium text-text-secondary mb-1.5">Nova senha</label>
            <input
              id="new-password"
              type="password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setPasswordStatus('idle')
              }}
              required
              minLength={8}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-text-secondary mb-1.5">Confirmar nova senha</label>
            <input
              id="confirm-password"
              type="password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setPasswordStatus('idle')
              }}
              required
              minLength={8}
            />
          </div>
          <AnimatePresence>
            {passwordError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-error/10 border border-error/30 text-error rounded-lg p-3 mb-4 text-sm"
              >
                {passwordError}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="submit"
            className="px-5 py-2.5 bg-ember-500 text-white font-semibold rounded-lg hover:bg-ember-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            disabled={passwordStatus === 'saving'}
          >
            {passwordStatus === 'saving'
              ? 'Alterando...'
              : passwordStatus === 'saved'
                ? 'Alterada!'
                : 'Alterar senha'}
          </button>
        </form>
      </div>
    </div>
  )
}
