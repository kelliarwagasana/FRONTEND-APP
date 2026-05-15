import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import { mapListingFromApi } from '../mapFromApi'

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const raw = await api.get<Record<string, unknown>>(`/api/v1/listings/${id!}`)
      return mapListingFromApi(raw)
    },
    enabled: Boolean(id),
  })
}
