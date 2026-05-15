import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/hooks/useAuth'
import { api } from '../../lib/api'
import { uploadListingPhotos } from '../../lib/uploadApi'
import { mapListingFromApi } from '../listings/mapFromApi'
import type { Booking, Listing } from '../listings/types'

export function useMyListings() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['listings', 'mine'],
    queryFn: async () => {
      const rows = await api.get<Record<string, unknown>[]>('/api/v1/listings/mine')
      return rows.map((row) => mapListingFromApi(row))
    },
    enabled: user?.role === 'HOST',
  })
}

export function useHostBookings() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['bookings', 'host'],
    queryFn: async () => {
      const rows = await api.get<Record<string, unknown>[]>('/api/v1/bookings/host')
      return rows.map((row) => {
        const listing = row.listing as Record<string, unknown> | undefined
        return {
          ...row,
          listing: listing ? mapListingFromApi(listing) : row.listing,
        } as Booking
      })
    },
    enabled: user?.role === 'HOST',
  })
}

export interface CreateListingBody {
  title: string
  description: string
  location: string
  pricePerNight: number
  category: string
  type: Listing['type']
  guest: number
  superhost: boolean
  isAvailable: boolean
  availableFrom: string
  amenities: string[]
  imageFiles: File[]
}

export function useCreateListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreateListingBody) => {
      const { imageFiles, ...fields } = body
      const created = await api.post<Record<string, unknown>>('/api/v1/listings', {
        title: fields.title,
        description: fields.description,
        location: fields.location,
        pricePerNight: fields.pricePerNight,
        guests: fields.guest,
        type: fields.type,
        amenities: fields.amenities,
      })

      const listingId = String(created.id ?? '')
      if (imageFiles.length > 0 && listingId) {
        const withPhotos = await uploadListingPhotos(listingId, imageFiles)
        return mapListingFromApi(withPhotos as unknown as Record<string, unknown>)
      }

      return mapListingFromApi(created)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['listings', 'mine'] })
      qc.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

export function useUpdateListing(listingId: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<Listing> & { newPhotoFiles?: File[] }) => {
      if (!listingId) throw new Error('Missing listing')
      const { newPhotoFiles, ...rest } = body
      const payload: Record<string, unknown> = { ...rest }
      if (rest.guest !== undefined) {
        payload.guests = rest.guest
        delete payload.guest
      }
      delete payload.newPhotoFiles

      await api.put<Listing>(`/api/v1/listings/${listingId}`, payload)

      if (newPhotoFiles && newPhotoFiles.length > 0) {
        const withPhotos = await uploadListingPhotos(listingId, newPhotoFiles)
        return mapListingFromApi(withPhotos as unknown as Record<string, unknown>)
      }

      const raw = await api.get<Record<string, unknown>>(`/api/v1/listings/${listingId}`)
      return mapListingFromApi(raw)
    },
    onMutate: async (body) => {
      if (!listingId) return {}
      await qc.cancelQueries({ queryKey: ['listing', listingId] })
      const previous = qc.getQueryData<Listing>(['listing', listingId])
      if (previous) {
        const { newPhotoFiles: _, ...optimistic } = body
        qc.setQueryData<Listing>(['listing', listingId], {
          ...previous,
          ...optimistic,
          updatedAt: new Date().toISOString(),
        })
      }
      return { previous }
    },
    onError: (_e, _b, ctx) => {
      if (ctx?.previous && listingId) qc.setQueryData(['listing', listingId], ctx.previous)
    },
    onSettled: () => {
      if (listingId) qc.invalidateQueries({ queryKey: ['listing', listingId] })
      qc.invalidateQueries({ queryKey: ['listings', 'mine'] })
    },
  })
}

export function useDeleteListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (listingId: string) => api.delete(`/api/v1/listings/${listingId}`),
    onMutate: async (listingId) => {
      await qc.cancelQueries({ queryKey: ['listings', 'mine'] })
      const previous = qc.getQueryData<Listing[]>(['listings', 'mine'])
      qc.setQueryData<Listing[]>(
        ['listings', 'mine'],
        (old) => (old ?? []).filter((l) => l.id !== listingId),
      )
      return { previous }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(['listings', 'mine'], ctx.previous)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['listings'] })
      qc.invalidateQueries({ queryKey: ['listings', 'mine'] })
    },
  })
}

export function useHostBookingAction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: 'CONFIRMED' | 'CANCELLED' }) =>
      api.patch(`/api/v1/bookings/${bookingId}/status`, { status }),
    onMutate: async ({ bookingId, status }) => {
      await qc.cancelQueries({ queryKey: ['bookings', 'host'] })
      const previous = qc.getQueryData<Booking[]>(['bookings', 'host'])
      qc.setQueryData<Booking[]>(
        ['bookings', 'host'],
        (old) =>
          (old ?? []).map((b) => (b.id === bookingId ? { ...b, status } : b)),
      )
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(['bookings', 'host'], ctx.previous)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['bookings', 'host'] })
    },
  })
}
