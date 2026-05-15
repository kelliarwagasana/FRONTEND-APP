import toast from 'react-hot-toast'
import { useApproveListing, usePendingListings, useRejectListing } from '../hooks'

export default function ModerationQueuePage() {
  const pendingQuery = usePendingListings()
  const approve = useApproveListing()
  const reject = useRejectListing()

  const listings = pendingQuery.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#292626]">Moderation queue</h1>
        <p className="mt-1 text-sm text-[#857d7a]">Listings awaiting approval.</p>
      </div>

      {pendingQuery.isPending ? (
        <p className="text-sm text-slate-600">Loading…</p>
      ) : (
        <div className="grid gap-6">
          {listings.map((listing) => (
            <article key={listing.id} className="rounded-2xl border border-[#eadfdb] bg-white p-6 shadow-sm md:grid md:grid-cols-[200px_1fr] md:gap-6">
              {listing.photos[0] && (
                <img src={listing.photos[0].url} alt="" className="h-40 w-full rounded-xl object-cover md:h-full" />
              )}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-[#292626]">{listing.title}</h2>
                <p className="text-sm leading-relaxed text-[#473f3d]">{listing.description}</p>
                <p className="text-sm font-semibold text-[#f97316]">${listing.pricePerNight} / night</p>
                <p className="text-xs text-[#857d7a]">
                  Host: <span className="font-semibold text-[#292626]">{listing.host?.name}</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      approve.mutate(listing.id, {
                        onSuccess: () => toast.success('Listing approved'),
                        onError: (e: Error) => toast.error(e.message),
                      })
                    }
                    className="rounded-lg bg-[#f97316] px-4 py-2 text-xs font-black text-white hover:bg-black"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      reject.mutate(listing.id, {
                        onSuccess: () => toast.success('Listing rejected'),
                        onError: (e: Error) => toast.error(e.message),
                      })
                    }
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-black text-red-800"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
          {listings.length === 0 && (
            <p className="rounded-xl border border-dashed border-[#eadfdb] bg-[#fffaf8] p-8 text-center text-sm text-[#857d7a]">
              No listings pending review.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
