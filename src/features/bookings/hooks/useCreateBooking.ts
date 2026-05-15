import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { Booking } from '../../listings/types'

export interface CreateBookingPayload {
  listingId: string
  checkIn: string
  checkOut: string
  guests: number
  guestName: string
  guestEmail: string
  guestPhone: string
  guestPhotoDataUrl?: string
  payment: {
    card: string
    expiry: string
    cvv: string
  }
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) =>
      api.post<Booking>('/api/v1/bookings', {
        listingId: payload.listingId,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        guests: payload.guests,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] })
      queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}
