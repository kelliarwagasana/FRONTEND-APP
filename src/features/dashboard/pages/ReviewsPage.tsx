import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi'
import type { DashboardOutletContext } from '../utils/dashboardUtils'
import { useAdminAggregatedReviews, useHostReviews } from '../../reviews/hooks'

export default function ReviewsPage() {
  const { isAdmin } = useOutletContext<DashboardOutletContext>()
  const hostQuery = useHostReviews()
  const adminQuery = useAdminAggregatedReviews()
  const [showReviews, setShowReviews] = useState(false)

  const query = isAdmin ? adminQuery : hostQuery

  const reviews = useMemo(() => query.data ?? [], [query.data])

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }, [reviews])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-[#292626]">Reviews</h1>
        <p className="mt-1 text-sm text-[#857d7a]">
          {isAdmin
            ? 'Guest feedback across the platform.'
            : 'Feedback from guests who stayed at your listings.'}
        </p>
      </section>

      <section className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => reviews.length > 0 && setShowReviews((v) => !v)}
            disabled={query.isPending || reviews.length === 0}
            className="flex min-w-0 flex-1 items-start gap-4 rounded-xl border border-transparent p-1 text-left transition hover:border-[#f97316]/25 hover:bg-[#fff7ed] disabled:cursor-not-allowed disabled:opacity-60 sm:items-center"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#f97316]">
              <FiStar className="h-6 w-6" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#857d7a]">
                Total in your system
              </p>
              <p className="mt-1 text-3xl font-bold text-[#292626]">
                {query.isPending ? '—' : reviews.length}
              </p>
              <p className="mt-1 text-sm text-[#857d7a]">
                {query.isPending
                  ? 'Loading count…'
                  : reviews.length === 0
                    ? 'No reviews yet.'
                    : averageRating != null
                      ? `Average ${averageRating} / 5 · use the card or button to open the list`
                      : `${reviews.length} review${reviews.length === 1 ? '' : 's'} · open below to read`}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => reviews.length > 0 && setShowReviews((v) => !v)}
            disabled={query.isPending || reviews.length === 0}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-[#eadfdb] disabled:text-[#857d7a]"
          >
            {showReviews ? (
              <>
                Hide reviews
                <FiChevronUp className="h-4 w-4" aria-hidden />
              </>
            ) : (
              <>
                Read reviews
                <FiChevronDown className="h-4 w-4" aria-hidden />
              </>
            )}
          </button>
        </div>
      </section>

      {showReviews && (
        <section className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-white shadow-sm">
          <div className="border-b border-[#eadfdb] px-5 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-[#292626]">All reviews</h2>
            <p className="mt-1 text-sm text-[#857d7a]">
              {query.isPending ? 'Loading…' : `${reviews.length} review${reviews.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <ReviewBody isLoading={query.isPending} reviews={reviews} />
        </section>
      )}
    </div>
  )
}

function ReviewBody({
  isLoading,
  reviews,
}: {
  isLoading: boolean
  reviews: Array<{
    id: string
    rating: number
    comment: string
    user: { name: string }
    createdAt: string
    listingTitle?: string
  }>
}) {
  if (isLoading) {
    return <p className="p-6 text-sm text-[#857d7a]">Loading reviews…</p>
  }
  if (reviews.length === 0) {
    return <p className="p-6 text-sm text-[#857d7a]">No reviews yet.</p>
  }
  return (
    <div className="divide-y divide-[#f0e5e1] bg-[#faf8f7]">
      {reviews.map((review) => (
        <article key={review.id} className="bg-white p-5 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-[#292626]">{review.listingTitle ?? 'Listing'}</p>
            <p className="text-sm font-semibold text-[#f97316]">{review.rating}/5</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#473f3d]">{review.comment}</p>
          <p className="mt-3 text-sm text-[#857d7a]">
            {review.user.name} — {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </article>
      ))}
    </div>
  )
}
