import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuth } from '../auth/hooks/useAuth'
import type { NotificationsResponse } from './types'

const NOTIFICATIONS_KEY = ['notifications'] as const

function isDashboardUser(role: string | undefined) {
  return role === 'HOST' || role === 'ADMIN'
}

export function useNotifications() {
  const { user } = useAuth()

  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, 'list'],
    queryFn: () => api.get<NotificationsResponse>('/api/v1/notifications?limit=20'),
    enabled: isDashboardUser(user?.role),
    refetchInterval: 30_000,
  })
}

export function useUnreadNotificationCount() {
  const { user } = useAuth()

  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, 'unread-count'],
    queryFn: () => api.get<{ count: number }>('/api/v1/notifications/unread-count'),
    enabled: isDashboardUser(user?.role),
    refetchInterval: 30_000,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.patch(`/api/v1/notifications/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => api.patch('/api/v1/notifications/read-all'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
    },
  })
}
