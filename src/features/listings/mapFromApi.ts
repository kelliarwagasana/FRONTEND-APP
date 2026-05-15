import type { User } from '../auth/types'
import type { Listing, ListingPhoto, Review } from './types'

function mapPhotos(raw: unknown): ListingPhoto[] {
  if (!Array.isArray(raw)) return []
  return raw.map((p) => {
    const row = p as Record<string, unknown>
    return {
      id: String(row.id ?? ''),
      url: String(row.url ?? ''),
      publicId: row.publicId != null ? String(row.publicId) : '',
      listingId: String(row.listingId ?? ''),
    }
  })
}

export function mapReviews(raw: unknown): Review[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => {
    const r = item as Record<string, unknown>
    const reviewer = r.reviewer as Record<string, unknown> | undefined
    const user: User = reviewer
      ? {
          id: String(reviewer.id ?? ''),
          name: String(reviewer.name ?? ''),
          email: '',
          username: '',
          phone: '',
          role: 'GUEST',
          createdAt: '',
          avatar: reviewer.avatar != null ? String(reviewer.avatar) : undefined,
        }
      : (r.user as User)

    return {
      id: String(r.id ?? ''),
      rating: Number(r.rating ?? 0),
      comment: r.comment != null ? String(r.comment) : '',
      userId: String(r.reviewerId ?? ''),
      listingId: String(r.listingId ?? ''),
      user,
      createdAt:
        typeof r.createdAt === 'string'
          ? r.createdAt
          : new Date(r.createdAt as Date).toISOString(),
    }
  })
}

/** Maps Prisma/API listing JSON to the shape the UI expects (guest vs guests, coordinates default). */
export function mapListingFromApi(raw: Record<string, unknown>): Listing {
  const guests = Number(raw.guests ?? raw.guest ?? 1)
  const host = raw.host as Listing['host']
  const id = String(raw.id ?? '')

  let photos = mapPhotos(raw.photos)
  if (photos.length === 0) {
    const cover =
      typeof raw.coverUrl === 'string' && raw.coverUrl.trim() !== ''
        ? raw.coverUrl.trim()
        : typeof raw.url === 'string' && raw.url.trim() !== ''
          ? raw.url.trim()
          : ''
    if (cover) {
      photos = [{ id: '0', url: cover, publicId: '', listingId: id }]
    }
  }

  return {
    ...(raw as unknown as Listing),
    id,
    guest: Number.isFinite(guests) ? guests : 1,
    coordinates:
      (raw.coordinates as Listing['coordinates']) ?? ({ lat: 0, lng: 0 } as Listing['coordinates']),
    photos,
    reviews: mapReviews(raw.reviews),
    host,
    status: raw.status as Listing['status'],

    // Derived availability coming from the API
    // - isBookedByMe => user already paid/hold it (PENDING or CONFIRMED)
    isAvailable:
      typeof raw.isBookedByMe === 'boolean' ? !raw.isBookedByMe : (raw.isAvailable as Listing['isAvailable']),
  }
}

