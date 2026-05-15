import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useAuth } from '../auth/hooks/useAuth'
import { mapReviews } from '../listings/mapFromApi'
import type { Review } from '../listings/types'

interface ReviewsResponse {
  data: Record<string, unknown>[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export function useListingReviews(listingId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', listingId],
    queryFn: async () => {
      const res = await api.get<ReviewsResponse>(
        `/api/v1/reviews/listings/${listingId}/reviews?page=1&limit=50`,
      )
      return mapReviews(res.data)
    },
    enabled: Boolean(listingId),
  })
}

export function useCreateReview(listingId: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { rating: number; comment: string }) =>
      api.post<Record<string, unknown>>(`/api/v1/reviews/listings/${listingId}/reviews`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', listingId] })
      qc.invalidateQueries({ queryKey: ['listing', listingId] })
      qc.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

export function useDeleteReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: string | number) =>
      api.delete(`/api/v1/reviews/reviews/${reviewId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
      qc.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

export function useHostReviews() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['reviews', 'host'],
    queryFn: async () => {
      const rows = await api.get<Record<string, unknown>[]>('/api/v1/listings/mine')
      const reviews: (Review & { listingTitle?: string })[] = []
      for (const row of rows) {
        const listingReviews = mapReviews(row.reviews)
        const title = String(row.title ?? '')
        listingReviews.forEach((r) => reviews.push({ ...r, listingTitle: title }))
      }
      return reviews.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    },
    enabled: user?.role === 'HOST',
  })
}

export function useAdminAggregatedReviews() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['reviews', 'admin'],
    queryFn: async () => {
      const res = await api.get<{ data: Record<string, unknown>[] }>(
        '/api/v1/listings?page=1&limit=30',
      )
      const reviews: (Review & { listingTitle?: string })[] = []
      await Promise.all(
        res.data.map(async (listing) => {
          const id = String(listing.id ?? '')
          const title = String(listing.title ?? '')
          try {
            const page = await api.get<ReviewsResponse>(
              `/api/v1/reviews/listings/${id}/reviews?page=1&limit=20`,
            )
            mapReviews(page.data).forEach((r) => reviews.push({ ...r, listingTitle: title }))
          } catch {
            /* listing may have no reviews */
          }
        }),
      )
      return reviews.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    },
    enabled: user?.role === 'ADMIN',
  })
}
