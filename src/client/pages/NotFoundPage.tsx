import { Link } from 'react-router'
import { motion } from 'framer-motion'
import Brand from '../components/Brand.js'

export default function NotFoundPage() {
  return (
    <div className="bg-forge-950 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.05)_0%,transparent_70%)] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-lg"
      >
        <Link to="/" className="flex justify-center mb-8 no-underline">
          <Brand iconSize={44} textClassName="text-xl" />
        </Link>
        <div className="bg-forge-800 border border-forge-600 rounded-2xl p-10 shadow-lg shadow-ember-500/5 text-center">
          <h1 className="text-5xl font-extrabold text-ember-500 mb-3">404</h1>
          <p className="text-text-secondary mb-6">A página que você procura não existe.</p>
          <Link to="/dashboard" className="block w-full py-2.5 text-center text-sm font-medium text-white bg-ember-500 rounded-lg hover:bg-ember-400 transition-all shadow-lg shadow-ember-500/20 no-underline">
            Ir para o Painel
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
