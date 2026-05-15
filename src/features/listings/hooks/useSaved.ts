import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { api } from '../../../lib/api'

export function useSaved() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['saved'],
    queryFn: () => api.get<{ listingIds: string[] }>('/api/v1/saved'),
    enabled: Boolean(user) && user?.role === 'GUEST',
  })
}
