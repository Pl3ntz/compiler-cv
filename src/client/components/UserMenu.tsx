import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

interface Props {
  readonly userName: string
  readonly userEmail: string
  readonly isAdmin: boolean
}

function getInitials(name: string, email: string): string {
  const source = name || email
  const parts = source.split(/[\s@]+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

export default function UserMenu({ userName, userEmail, isAdmin }: Props) {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open) {
      const firstItem = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')
      firstItem?.focus()
    }
  }, [open])

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/auth/login')
  }

  const initials = getInitials(userName, userEmail)

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const menu = menuRef.current?.querySelector<HTMLElement>('[role="menu"]')
    if (!menu) return
    const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'))
    const current = document.activeElement as HTMLElement
    const index = items.indexOf(current)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(index + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(index - 1 + items.length) % items.length]?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      menuRef.current?.querySelector<HTMLButtonElement>('.user-menu-trigger')?.focus()
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="user-menu-trigger w-10 h-10 rounded-full border border-forge-500 bg-forge-700 text-xs font-semibold cursor-pointer flex items-center justify-center text-text-secondary hover:bg-forge-600 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault()
            setOpen(true)
          }
        }}
        title={userName || userEmail}
      >
        {initials}
      </button>
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+4px)] min-w-[200px] bg-forge-700 border border-forge-600 rounded-lg shadow-xl shadow-black/30 z-20 py-1"
          role="menu"
          aria-label="Menu do usuário"
          onKeyDown={handleMenuKeyDown}
        >
          <div className="px-3 py-2 text-xs text-text-muted border-b border-forge-600">{userName || userEmail}</div>
          <a href="/dashboard" className="flex items-center w-full px-3 py-2 text-sm text-text-secondary hover:bg-forge-600 hover:text-text-primary transition-colors min-h-[44px]" role="menuitem">Painel</a>
          <a href="/settings" className="flex items-center w-full px-3 py-2 text-sm text-text-secondary hover:bg-forge-600 hover:text-text-primary transition-colors min-h-[44px]" role="menuitem">Configurações</a>
          {isAdmin && (
            <a href="/admin" className="flex items-center w-full px-3 py-2 text-sm text-text-secondary hover:bg-forge-600 hover:text-text-primary transition-colors min-h-[44px]" role="menuitem">Admin</a>
          )}
          <button
            type="button"
            className="flex items-center w-full px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors border-none bg-transparent cursor-pointer min-h-[44px]"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      )}
    </div>
  )
}
