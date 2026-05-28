import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../auth/authStorage'
import type { User } from '../../auth/types'
import ThemeToggle from '../../../shared/components/ThemeToggle'
import NotificationBell from '../../notifications/components/NotificationBell'
import { getSectionTitle, formatUserRole } from '../utils/dashboardUtils'
import type { DashboardSection } from '../utils/dashboardUtils'
import UserAvatar from './UserAvatar'
interface DashboardTopbarProps {
  currentUser: User
  activeSection: DashboardSection
  isSidebarVisible: boolean
  onToggleSidebar: () => void
}

export default function DashboardTopbar({
  currentUser,
  activeSection,
  isSidebarVisible,
  onToggleSidebar,
}: DashboardTopbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const displayUsername = currentUser.username?.trim() || currentUser.name
  const roleLine = formatUserRole(currentUser.role)

  return (
    <header className="sticky top-0 z-30 border-b-2 border-black bg-white/95 backdrop-blur">
      <div className="flex min-h-[78px] items-center justify-between gap-4 px-5 lg:px-7">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
            className="flex h-11 w-11 items-center justify-center border-2 border-black bg-[#f97316] text-lg font-black text-white transition hover:bg-black"
          >
            =
          </button>
          <h1 className="text-lg font-black uppercase tracking-[0.12em] text-black">{getSectionTitle(activeSection)}</h1>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <ThemeToggle />
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="flex items-center gap-3 rounded-xl border border-[#eadfdb] bg-white px-3 py-2 text-left shadow-sm transition hover:border-[#f97316]/40 hover:bg-[#fff7ed]"
            >
              <span className="relative shrink-0">
                <UserAvatar user={currentUser} size="md" />
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#f97316]"
                  aria-hidden
                />
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-semibold tracking-tight text-slate-900">
                  {displayUsername}
                </span>
                <span className="mt-0.5 block truncate text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  {roleLine}
                </span>
              </span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[#eadfdb] bg-white p-2 shadow-sm">
                <Link
                  to="/dashboard/profile"
                  className="block px-3 py-2 text-sm font-black text-black hover:bg-[#fff7ed]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 w-full px-3 py-2 text-left text-sm font-black text-[#f97316] hover:bg-[#fff7ed]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

