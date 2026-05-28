import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/hooks/useAuth'
import { api } from '../../lib/api'
import { mapListingFromApi } from '../listings/mapFromApi'
import type { Booking, Listing } from '../listings/types'

export function useAdminStats() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () =>
      api.get<{
        totalUsers: number
        totalListings: number
        pendingListings: number
        approvedListings: number
        rejectedListings: number
        totalBookings: number
        totalRevenue: number
      }>(
        '/api/v1/admin/stats',
      ),
    enabled: user?.role === 'ADMIN',
  })
}

export function useAdminAllListings() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['listings', 'admin', 'all'],
    queryFn: async () => {
      const rows = await api.get<Record<string, unknown>[]>('/api/v1/listings/admin/all')
      return rows.map((row) => mapListingFromApi(row))
    },
    enabled: user?.role === 'ADMIN',
  })
}

export function usePendingListings() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['listings', 'pending'],
    queryFn: async () => {
      const rows = await api.get<Record<string, unknown>[]>('/api/v1/listings/pending')
      return rows.map((row) => mapListingFromApi(row))
    },
    enabled: user?.role === 'ADMIN',
  })
}

export function useApproveListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/api/v1/listings/${id}/status`, { status: 'PUBLISHED' }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['listings', 'pending'] })
      const previous = qc.getQueryData<Listing[]>(['listings', 'pending'])
      qc.setQueryData<Listing[]>(
        ['listings', 'pending'],
        (old) => (old ?? []).filter((l) => l.id !== id),
      )
      return { previous }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(['listings', 'pending'], ctx.previous)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['listings'] })
      qc.invalidateQueries({ queryKey: ['listings', 'mine'] })
      qc.invalidateQueries({ queryKey: ['listings', 'pending'] })
      qc.invalidateQueries({ queryKey: ['listings', 'admin', 'all'] })
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useRejectListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/api/v1/listings/${id}/status`, { status: 'REJECTED' }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['listings', 'pending'] })
      const previous = qc.getQueryData<Listing[]>(['listings', 'pending'])
      qc.setQueryData<Listing[]>(
        ['listings', 'pending'],
        (old) => (old ?? []).filter((l) => l.id !== id),
      )
      return { previous }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(['listings', 'pending'], ctx.previous)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['listings'] })
      qc.invalidateQueries({ queryKey: ['listings', 'mine'] })
      qc.invalidateQueries({ queryKey: ['listings', 'pending'] })
      qc.invalidateQueries({ queryKey: ['listings', 'admin', 'all'] })
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export interface AllBookingsFilters {
  status: string
  dateFrom: string
  dateTo: string
  page: number
}

export function useAllBookings(filters: AllBookingsFilters) {
  const { user } = useAuth()
  const { status, dateFrom, dateTo, page } = filters

  return useQuery({
    queryKey: ['bookings', 'all', { status, dateFrom, dateTo, page }],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', '8')
      if (status && status !== 'all') params.set('status', status.toUpperCase())
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      const res = await api.get<{
        data: Record<string, unknown>[]
        meta: { total: number; page: number; limit: number }
      }>(`/api/v1/bookings?${params.toString()}`)
      const items = res.data.map((row) => {
        const listing = row.listing as Record<string, unknown> | undefined
        return {
          ...row,
          listing: listing ? mapListingFromApi(listing) : row.listing,
        } as Booking
      })
      return {
        items,
        total: res.meta.total,
        page: res.meta.page,
        limit: res.meta.limit,
      }
    },
    enabled: user?.role === 'ADMIN',
    placeholderData: keepPreviousData,
  })
}

export function useBanUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => api.post(`/api/v1/admin/users/${userId}/ban`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      qc.invalidateQueries({ queryKey: ['listings'] })
      qc.invalidateQueries({ queryKey: ['bookings'] })
      qc.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}
