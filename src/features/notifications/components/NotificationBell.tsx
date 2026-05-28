import { useEffect, useRef, useState } from 'react'
import { FiBell } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from '../hooks'
import type { Notification } from '../types'

function formatRelativeTime(value: string) {
  const date = new Date(value)
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60_000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString()
}

function getNotificationLink(notification: Notification) {
  const meta = notification.metadata ?? {}

  switch (notification.type) {
    case 'BOOKING_CREATED':
    case 'BOOKING_CANCELLED':
      return '/dashboard/bookings'
    case 'BOOKING_CONFIRMED':
    case 'BOOKING_DECLINED':
      return '/bookings'
    case 'REVIEW_RECEIVED':
      return '/dashboard/reviews'
    case 'LISTING_APPROVED':
    case 'LISTING_REJECTED':
      return typeof meta.listingId === 'string'
        ? `/dashboard/edit-listing/${meta.listingId}`
        : '/dashboard/listings'
    case 'LISTING_CREATED':
      return '/dashboard/moderation'
    default:
      return '/dashboard'
  }
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { data: unreadData } = useUnreadNotificationCount()
  const { data: notificationsData, isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = unreadData?.count ?? 0
  const notifications = notificationsData?.data ?? []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markRead.mutate(notification.id)
    }

    setIsOpen(false)
    navigate(getNotificationLink(notification))
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:border-[#f97316] hover:text-[#f97316]"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <FiBell className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#f97316] px-1 text-[10px] font-black text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 border-2 border-black bg-white shadow-[6px_6px_0_#f97316] sm:w-96">
          <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
            <h2 className="text-sm font-black uppercase tracking-[0.12em] text-black">Notifications</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="text-xs font-black text-[#f97316] hover:underline disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <p className="px-4 py-6 text-center text-sm text-black/55">Loading...</p>
            )}

            {!isLoading && notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-black/55">No notifications yet</p>
            )}

            {!isLoading &&
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`block w-full border-b border-black/10 px-4 py-3 text-left transition hover:bg-[#fff7ed] ${
                    notification.read ? 'bg-white' : 'bg-[#fff7ed]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-black text-black">{notification.title}</p>
                    {!notification.read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#f97316]" />
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-black/70">{notification.body}</p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-black/45">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
