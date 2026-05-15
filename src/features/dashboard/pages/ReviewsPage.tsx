import { useOutletContext } from 'react-router-dom'
import type { DashboardOutletContext } from '../utils/dashboardUtils'
import { useAdminAggregatedReviews, useHostReviews } from '../../reviews/hooks'

export default function ReviewsPage() {
  const { isAdmin } = useOutletContext<DashboardOutletContext>()
  const hostQuery = useHostReviews()
  const adminQuery = useAdminAggregatedReviews()

  const query = isAdmin ? adminQuery : hostQuery
  const reviews = query.data ?? []

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-950">Reviews</h2>
        <p className="mt-1 text-sm text-slate-500">
          {query.isPending ? 'Loading…' : `${reviews.length} review${reviews.length === 1 ? '' : 's'}`}
        </p>
      </div>
      <ReviewBody isLoading={query.isPending} reviews={reviews} />
    </section>
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
    return <p className="p-6 text-sm text-slate-500">Loading reviews…</p>
  }
  if (reviews.length === 0) {
    return <p className="p-6 text-sm text-slate-500">No reviews yet.</p>
  }
  return (
    <div className="divide-y divide-slate-100">
      {reviews.map((review) => (
        <article key={review.id} className="p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-slate-950">{review.listingTitle ?? 'Listing'}</p>
            <p className="text-sm font-semibold text-[#f97316]">{review.rating}/5</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p>
          <p className="mt-3 text-sm text-slate-500">
            {review.user.name} — {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </article>
      ))}
    </div>
  )
}
