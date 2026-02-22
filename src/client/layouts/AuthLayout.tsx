import { Outlet, Link } from 'react-router'
import { motion } from 'framer-motion'
import Brand from '../components/Brand.js'

export default function AuthLayout() {
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

        <div className="bg-forge-800 border border-forge-600 rounded-2xl p-8 sm:p-10 shadow-lg shadow-ember-500/5">
          <Outlet />
        </div>
      </motion.div>
    </div>
  )
}
