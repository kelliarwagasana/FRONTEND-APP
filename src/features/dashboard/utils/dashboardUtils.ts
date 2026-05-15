import type { User } from '../../auth/types'

export type DashboardSection =
  | 'overview'
  | 'bookings'
  | 'guests'
  | 'users'
  | 'reviews'
  | 'listings'
  | 'profile'
  | 'moderation'
  | 'platform-bookings'
  | 'create-listing'

export interface DashboardOutletContext {
  currentUser: User
  isAdmin: boolean
}

export function getDashboardSection(section?: string, isAdmin = false): DashboardSection {
  const allowedSections: DashboardSection[] = [
    'overview',
    'create-listing',
    'bookings',
    'guests',
    'reviews',
    'listings',
    'profile',
    'moderation',
    'platform-bookings',
  ]

  if (isAdmin) {
    allowedSections.splice(4, 0, 'users')
  }

  if (section && allowedSections.includes(section as DashboardSection)) {
    return section as DashboardSection
  }

  if (section === 'upload') {
    return 'listings'
  }

  if (section?.startsWith('edit-listing')) {
    return 'listings'
  }

  return 'overview'
}

export function getSectionTitle(section: DashboardSection) {
  const titles: Record<DashboardSection, string> = {
    overview: 'Dashboard home',
    bookings: 'Bookings',
    guests: 'Guest list',
    users: 'Users list',
    reviews: 'Reviews',
    listings: 'Listings',
    profile: 'Profile',
    moderation: 'Moderation queue',
    'platform-bookings': 'All bookings',
    'create-listing': 'Create listing',
  }

  return titles[section]
}

export function money(amount: number) {
  return `$${amount.toLocaleString()}`
}

export function statusClasses(status: string) {
  if (status === 'CONFIRMED') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  if (status === 'CANCELLED') {
    return 'bg-red-50 text-red-700 border-red-200'
  }

  return 'bg-amber-50 text-amber-700 border-amber-200'
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
