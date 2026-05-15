import { Link } from 'react-router-dom'
import type { User } from '../../auth/types'
import type { DashboardSection } from '../utils/dashboardUtils'
import UserAvatar from './UserAvatar'

interface DashboardSidebarProps {
  currentUser: User
  activeSection: DashboardSection
  isVisible: boolean
}

export default function DashboardSidebar({ currentUser, activeSection, isVisible }: DashboardSidebarProps) {
  const isAdmin = currentUser.role === 'ADMIN'
  const isHost = currentUser.role === 'HOST'
  const items = [
    { section: 'overview', label: 'Dashboard', marker: 'D' },
    ...(isHost ? [{ section: 'create-listing' as const, label: 'New listing', marker: 'N' }] : []),
    { section: 'listings', label: 'My Listing', marker: 'L' },
    { section: 'reviews', label: 'Reviews', marker: 'R' },
    { section: 'bookings', label: 'Bookings', marker: 'B' },
    { section: 'guests', label: 'Users', marker: 'G' },
    ...(isAdmin ? [{ section: 'users' as const, label: 'Users', marker: 'U' }] : []),
    ...(isAdmin
      ? [
          { section: 'moderation' as const, label: 'Moderation', marker: 'M' },
          { section: 'platform-bookings' as const, label: 'All bookings', marker: 'A' },
        ]
      : []),
    { section: 'profile', label: 'Profile', marker: 'P' },
  ] as Array<{ section: DashboardSection; label: string; marker: string }>

  return (
    <aside
      className={`z-40 border-r-2 border-black bg-white text-black transition-transform duration-300 lg:fixed lg:inset-y-0 lg:left-0 lg:w-[315px] ${
        isVisible ? 'block translate-x-0' : 'hidden lg:block lg:-translate-x-full'
      }`}
    >
      <div className="flex h-[78px] items-center px-6">
        <p className="text-4xl font-black tracking-tight text-black">
          Air<span className="text-[#f97316]">Bnb</span>
        </p>
      </div>

      <div className="mx-6 mb-6 flex items-center gap-3 border-2 border-black bg-white p-3 shadow-[5px_5px_0_#f97316] lg:hidden">
        <UserAvatar user={currentUser} size="md" />
        <div className="min-w-0">
          <p className="truncate font-black text-black">{currentUser.name}</p>
          <p className="truncate text-xs text-black/55">{currentUser.email}</p>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-6 pb-6 lg:flex-col lg:overflow-visible">
        {items.map((item) => {
          const isActive = item.section === activeSection

          return (
            <Link
              key={item.section}
              to={
                item.section === 'overview'
                  ? '/dashboard'
                  : item.section === 'create-listing'
                    ? '/dashboard/create-listing'
                    : `/dashboard/${item.section}`
              }
              className={`flex items-center gap-3 whitespace-nowrap border-2 px-6 py-3 text-sm font-black transition ${
                isActive
                  ? 'rounded-lg bg-[#f97316] text-white'
                  : 'border-transparent text-black hover:border-[#f97316] rounded-lg hover:bg-[#fff7ed] hover:text-[#f97316]'
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center border text-[10px] ${isActive ? 'border-white' : 'border-black'}`}>
                {item.marker}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

