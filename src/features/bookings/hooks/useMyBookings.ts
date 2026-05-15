import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { api } from '../../../lib/api'
import { mapListingFromApi } from '../../listings/mapFromApi'
import type { Booking } from '../../listings/types'

export function useMyBookings() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['bookings', 'me'],
    queryFn: async () => {
      const rows = await api.get<Record<string, unknown>[]>('/api/v1/bookings/me')
      return rows.map((row) => {
        const listing = row.listing as Record<string, unknown> | undefined
        return {
          ...row,
          listing: listing ? mapListingFromApi(listing) : row.listing,
        } as Booking
      })
    },
    enabled: Boolean(user) && user?.role === 'GUEST',
  })
}
