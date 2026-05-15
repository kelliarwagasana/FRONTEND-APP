import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { Booking } from '../../listings/types'

export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingId: string) => api.delete(`/api/v1/bookings/${bookingId}`),
    onMutate: async (bookingId) => {
      await queryClient.cancelQueries({ queryKey: ['bookings', 'me'] })
      const previous = queryClient.getQueryData<Booking[]>(['bookings', 'me'])
      queryClient.setQueryData<Booking[]>(['bookings', 'me'], (old) =>
        (old ?? []).filter((b) => b.id !== bookingId),
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['bookings', 'me'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] })
    },
  })
}
