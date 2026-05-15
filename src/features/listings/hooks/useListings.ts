import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import { mapListingFromApi } from '../mapFromApi'
import type { Listing } from '../types'

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const res = await api.get<{ data: Record<string, unknown>[] }>(
        '/api/v1/listings?page=1&limit=100&refresh=1',
      )
      return res.data.map((row) => mapListingFromApi(row)) as Listing[]
    },
  })
}