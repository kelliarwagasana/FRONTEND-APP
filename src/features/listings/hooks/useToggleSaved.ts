import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api'

export function useToggleSaved() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (listingId: string) =>
      api.post<{ listingIds: string[] }>(`/api/v1/saved/${listingId}`),
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: ['saved'] })
      const previous = queryClient.getQueryData<{ listingIds: string[] }>(['saved'])
      queryClient.setQueryData<{ listingIds: string[] }>(['saved'], (old) => {
        const ids = old?.listingIds ?? []
        const next = new Set(ids)
        if (next.has(listingId)) {
          next.delete(listingId)
        } else {
          next.add(listingId)
        }
        return { listingIds: [...next] }
      })
      return { previous }
    },
    onError: (_error, _listingId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['saved'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] })
    },
  })
}
