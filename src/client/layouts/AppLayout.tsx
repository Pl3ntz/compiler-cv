import { Outlet, Link } from 'react-router'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth.js'
import UserMenu from '../components/UserMenu.js'
import Brand from '../components/Brand.js'

export default function AppLayout() {
  const { user } = useAuth()

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-forge-850/80 backdrop-blur-xl border-b border-forge-600 sticky top-0 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link to="/dashboard" className="no-underline hover:opacity-90 transition-opacity">
            <Brand iconSize={34} textClassName="text-base" />
          </Link>
          <div className="flex items-center gap-3">
            <UserMenu
              userName={user?.name ?? ''}
              userEmail={user?.email ?? ''}
              isAdmin={user?.role === 'admin'}
            />
          </div>
        </div>
      </motion.nav>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Outlet />
      </motion.div>
    </>
  )
}
