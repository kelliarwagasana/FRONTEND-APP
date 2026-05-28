import { type FormEvent, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../../shared/components/Navbar'
import Spinner from '../../../shared/components/Spinner'
import { getCurrentUser } from '../../auth/authStorage'
import { useCreateReview, useListingReviews } from '../../reviews/hooks'
import ListingPhotoGallery from '../components/ListingPhotoGallery'
import { useListing } from '../hooks/useListing'

export default function ListingDetailPage() {
  const { listingId } = useParams<{ listingId: string }>()
  const listingQuery = useListing(listingId)
  const reviewsQuery = useListingReviews(listingId)
  const createReview = useCreateReview(listingId)
  const listing = listingQuery.data
  const currentUser = getCurrentUser()
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewError, setReviewError] = useState('')
  const [reviewMessage, setReviewMessage] = useState('')

  const reviews = reviewsQuery.data ?? []

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const handleReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setReviewError('')
    setReviewMessage('')

    if (!listing) {
      setReviewError('Listing not found.')
      return
    }

    if (!currentUser) {
      setReviewError('Please login as a guest before posting a review.')
      return
    }

    createReview.mutate(
      { rating: reviewRating, comment: reviewComment },
      {
        onSuccess: () => {
          setReviewComment('')
          setReviewRating(5)
          setReviewMessage('Review posted. Thank you for sharing your stay.')
        },
        onError: (e: Error) => setReviewError(e.message),
      },
    )
  }

  if (listingQuery.isPending) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <Navbar variant="solid" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <Spinner />
          <p className="text-sm font-semibold text-slate-600">Loading listing…</p>
        </div>
      </div>
    )
  }

  if (listingQuery.isError || !listing) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <Navbar variant="solid" />
        <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-6 py-20 text-center">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 shadow-lg shadow-slate-200/30">
            <p className="text-xl font-semibold text-slate-900">
              {listingQuery.isError ? 'Could not load this listing.' : 'Listing not found.'}
            </p>
            <button
              type="button"
              onClick={() => listingQuery.refetch()}
              className="mt-4 inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Retry
            </button>
            <Link
              to="/listings"
              className="mt-5 inline-flex rounded-full bg-[#f97316] px-5 py-3 text-sm font-semibold text-white hover:bg-[#000000]"
            >
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    )
  }
  const photos = listing.photos ?? []

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar variant="solid" />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/30">
          <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
            <ListingPhotoGallery
              photos={photos.map((p) => ({ id: p.id, url: p.url }))}
              title={listing.title}
            />
          </div>
          <div className="space-y-8 p-8 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="text-xl font-bold text-slate-900">About</h2>
                  {listing.description && (
                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600">{listing.description}</p>
                  )}
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Amenities</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {listing.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Details</p>
                    <p className="mt-3 text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{listing.type}</span>
                      <span className="text-slate-400"> · </span>
                      {listing.guest} guests max
                      <span className="text-slate-400"> · </span>
                      {reviews.length ? `${averageRating.toFixed(1)}★ (${reviews.length})` : 'New listing'}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Host</p>
                    <div className="mt-4 flex items-center gap-4">
                      {listing.host?.avatar && (
                        <img
                          src={listing.host.avatar}
                          alt={listing.host.name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{listing.host?.name ?? 'Host'}</p>
                        {listing.host?.createdAt ? (
                          <p className="text-xs text-slate-600">
                            Since {new Date(listing.host.createdAt).getFullYear()}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-200/30">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Booking</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Listed {new Date(listing.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">
                      ${listing.pricePerNight}
                      <span className="font-normal text-slate-500"> / night</span>
                      <span className="text-slate-400"> · </span>
                      {listing.guest} guests
                    </p>

                    {!currentUser ? (
                      <Link
                        to="/login"
                        className="inline-flex w-full items-center justify-center rounded-full bg-[#f97316] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#000000]"
                      >
                        Login to book
                      </Link>
                    ) : currentUser.role === 'GUEST' ? (
                      listing.isAvailable === false ? (
                        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
                          This stay is not available to book right now.
                        </p>
                      ) : (
                        <Link
                          to={`/listings/${listing.id}/book`}
                          className="inline-flex w-full flex-col items-center justify-center rounded-full bg-[#f97316] px-4 py-3.5 text-center text-white shadow-sm transition hover:bg-black"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/85">
                            Available on
                          </span>
                          <span className="mt-1 text-base font-bold">
                            {listing.availableFrom
                              ? new Date(listing.availableFrom).toLocaleDateString(undefined, {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Choose your dates'}
                          </span>
                          <span className="mt-1 text-xs font-medium text-white/90">Continue to book</span>
                        </Link>
                      )
                    ) : (
                      <Link
                        to="/dashboard"
                        className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Dashboard
                      </Link>
                    )}
                  </div>

                  <Link
                    to="/listings"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#f97316] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#000000]"
                  >
                    Explore more stays
                  </Link>
                </div>
              </aside>
            </div>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-600">Guest reviews</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {reviews.length ? `${averageRating.toFixed(1)} out of 5` : 'No reviews yet'}
                  </h2>
                </div>
                <div className="flex text-2xl text-[#f97316]" aria-label={`${averageRating.toFixed(1)} star rating`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>{star <= Math.round(averageRating) ? '*' : '-'}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <form onSubmit={handleReview} className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-bold text-slate-900">Post your review</h3>
                  <p className="mt-1 text-sm text-slate-600">Guest accounts can rate and review this listing.</p>

                  <div className="mt-5">
                    <span className="text-sm font-semibold text-slate-700">Rating</span>
                    <div className="mt-2 flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setReviewRating(rating)}
                          className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition ${
                            rating <= reviewRating
                              ? 'border-[#f97316] bg-[#f97316] text-white'
                              : 'border-slate-300 bg-white text-slate-600 hover:border-[#ff9a8d]'
                          }`}
                          aria-label={`${rating} star rating`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="mt-5 block">
                    <span className="text-sm font-semibold text-slate-700">Your review</span>
                    <textarea
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      rows={4}
                      className="mt-2 w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
                      placeholder="Tell future guests what stood out..."
                      required
                    />
                  </label>

                  {reviewError && (
                    <p className="mt-4 rounded-lg border border-[#f97316] bg-[#fff7ed] px-4 py-3 text-sm font-bold text-black">
                      {reviewError}
                    </p>
                  )}

                  {reviewMessage && (
                    <p className="mt-4 rounded-lg border border-black bg-white px-4 py-3 text-sm font-bold text-black">
                      {reviewMessage}
                    </p>
                  )}

                  {!currentUser ? (
                    <Link
                      to="/login"
                      className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#f97316] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#000000]"
                    >
                      Login to review
                    </Link>
                  ) : currentUser.role === 'GUEST' ? (
                    <button
                      type="submit"
                      className="mt-5 w-full rounded-full bg-[#f97316] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#000000]"
                    >
                      Post review
                    </button>
                  ) : (
                    <p className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                      Only guest accounts can post listing reviews.
                    </p>
                  )}
                </form>

                <div className="space-y-3">
                  {reviews.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                      No guest reviews yet. Be the first to share feedback.
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <article key={review.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {review.user.avatar && (
                              <img src={review.user.avatar} alt={review.user.name} className="h-11 w-11 rounded-full object-cover" />
                            )}
                            <div>
                              <p className="font-semibold text-slate-900">{review.user.name}</p>
                              <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-sm font-bold text-[#f97316]">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-700">{review.comment}</p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

