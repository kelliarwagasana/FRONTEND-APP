import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuth } from '../auth/hooks/useAuth'
import type { AnalyticsData } from './types'

export function useAnalytics() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const isHost = user?.role === 'HOST'

  return useQuery({
    queryKey: ['analytics', isAdmin ? 'admin' : 'host'],
    queryFn: () =>
      api.get<AnalyticsData>(
        isAdmin ? '/api/v1/analytics/admin' : '/api/v1/analytics/host',
      ),
    enabled: isAdmin || isHost,
  })
}
