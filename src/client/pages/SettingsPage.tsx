import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth.js'
import SettingsForm from '../components/SettingsForm.js'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <h1 className="text-2xl font-bold text-text-primary mb-6">Configurações</h1>
      <SettingsForm
        userName={user?.name ?? ''}
        userEmail={user?.email ?? ''}
      />
    </motion.div>
  )
}
