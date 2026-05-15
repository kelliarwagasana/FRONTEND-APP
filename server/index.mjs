import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

const PORT = Number(process.env.PORT) || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'liston-dev-jwt-secret'

/** @typedef {'ADMIN' | 'GUEST' | 'HOST'} Role */

const seedUsers = [
  { id: 'user-admin-1', name: 'Amara Admin', email: 'admin@example.com', username: 'amaraAdmin', phone: '+1-555-0100', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=64&q=80', role: 'ADMIN', createdAt: '2018-01-02T10:00:00Z', password: 'password123', isActive: true },
  { id: 'user-1', name: 'Sofia', email: 'sofia@example.com', username: 'sofiaHost', phone: '+1-555-0101', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=64&q=80', role: 'HOST', createdAt: '2019-01-15T10:00:00Z', password: 'password123', isActive: true },
  { id: 'user-2', name: 'Marco', email: 'marco@example.com', username: 'marcoHost', phone: '+1-555-0102', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&q=80', role: 'HOST', createdAt: '2021-03-22T10:00:00Z', password: 'password123', isActive: true },
  { id: 'user-3', name: 'Ines', email: 'ines@example.com', username: 'inesHost', phone: '+1-555-0103', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80', role: 'HOST', createdAt: '2022-06-10T10:00:00Z', password: 'password123', isActive: true },
  { id: 'user-4', name: 'Elena', email: 'elena@example.com', username: 'elenaHost', phone: '+1-555-0104', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&q=80', role: 'HOST', createdAt: '2020-08-05T10:00:00Z', password: 'password123', isActive: true },
  { id: 'user-5', name: 'Molly', email: 'molly@example.com', username: 'mollyHost', phone: '+1-555-0105', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&q=80', role: 'HOST', createdAt: '2023-02-14T10:00:00Z', password: 'password123', isActive: true },
  { id: 'user-6', name: 'Hiro', email: 'hiro@example.com', username: 'hiroHost', phone: '+1-555-0106', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&q=80', role: 'HOST', createdAt: '2018-11-08T10:00:00Z', password: 'password123', isActive: true },
  { id: 'user-guest-1', name: 'Demo Guest', email: 'guest@example.com', username: 'demoGuest', phone: '+1-555-0199', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=64&q=80', role: 'GUEST', createdAt: '2024-01-01T10:00:00Z', password: 'password123', isActive: true },
  { id: 'user-guest-2', name: 'Nina Traveler', email: 'nina@example.com', username: 'ninaTraveler', phone: '+1-555-0201', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=64&q=80', role: 'GUEST', createdAt: '2024-02-18T10:00:00Z', password: 'password123', isActive: true },
]

const seedListingsRaw = [
  { id: 'listing-1', title: 'Oceanfront Bungalow with Private Beach', pricePerNight: 220, guest: 4, location: 'Tulum, Mexico', coordinates: { lat: 20.2114, lng: -87.4654 }, type: 'HOUSE', amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen', 'Air Conditioning', 'Hot Tub'], hostId: 'user-1', createdAt: '2024-01-10T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-1', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', publicId: 'beach-1', listingId: 'listing-1' }], reviews: [] },
  { id: 'listing-2', title: 'Cozy Alpine Cabin with Hot Tub', pricePerNight: 385, guest: 5, location: 'Aspen, Colorado', coordinates: { lat: 39.1911, lng: -106.8175 }, type: 'CABIN', amenities: ['Fireplace', 'Hot Tub', 'Mountain View', 'Kitchen', 'Heating', 'Parking'], hostId: 'user-2', createdAt: '2024-02-15T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-2', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', publicId: 'cabin-1', listingId: 'listing-2' }], reviews: [] },
  { id: 'listing-3', title: 'Modern Loft in the Heart of the City', pricePerNight: 145, guest: 2, location: 'Lisbon, Portugal', coordinates: { lat: 38.7223, lng: -9.1393 }, type: 'APARTMENT', amenities: ['WiFi', 'Elevator', 'Modern Kitchen', 'Balcony', 'Washer', 'Air Conditioning'], hostId: 'user-3', createdAt: '2024-03-20T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-3', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', publicId: 'loft-1', listingId: 'listing-3' }], reviews: [] },
  { id: 'listing-4', title: 'Restored Stone Farmhouse with Vineyard Views', pricePerNight: 310, guest: 6, location: 'Tuscany, Italy', coordinates: { lat: 43.7711, lng: 11.2486 }, type: 'HOUSE', amenities: ['Garden', 'Wine Cellar', 'Pool', 'Outdoor Kitchen', 'Vineyard View', 'Heating'], hostId: 'user-4', createdAt: '2024-01-05T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-4', url: 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?auto=format&fit=crop&w=1200&q=80', publicId: 'farm-1', listingId: 'listing-4' }], reviews: [] },
  { id: 'listing-5', title: 'Tiny Beach Shack Steps from the Surf', pricePerNight: 95, guest: 2, location: 'Byron Bay, Australia', coordinates: { lat: -28.6474, lng: 153.602 }, type: 'HOUSE', amenities: ['Beach Access', 'Surf Board Storage', 'Kitchen', 'Outdoor Shower', 'WiFi', 'Parking'], hostId: 'user-5', createdAt: '2024-04-12T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-5', url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', publicId: 'shack-1', listingId: 'listing-5' }], reviews: [] },
  { id: 'listing-6', title: 'Rooftop Penthouse with Skyline Views', pricePerNight: 470, guest: 4, location: 'Tokyo, Japan', coordinates: { lat: 35.6762, lng: 139.6503 }, type: 'APARTMENT', amenities: ['Rooftop Terrace', 'Skyline View', 'Modern Kitchen', 'Concierge', 'WiFi', 'Parking'], hostId: 'user-6', createdAt: '2024-02-28T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-6', url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80', publicId: 'penthouse-1', listingId: 'listing-6' }], reviews: [] },
  { id: 'listing-7', title: 'Lakeside Villa with Private Dock', pricePerNight: 540, guest: 8, location: 'Lake Como, Italy', coordinates: { lat: 45.984, lng: 9.2572 }, type: 'VILLA', amenities: ['Lake Access', 'Private Dock', 'Chef Kitchen', 'Pool', 'Garden', 'Parking'], hostId: 'user-4', createdAt: '2024-03-11T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-7', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80', publicId: 'villa-1', listingId: 'listing-7' }], reviews: [] },
  { id: 'listing-8', title: 'Desert Casita with Sunset Patio', pricePerNight: 180, guest: 3, location: 'Sedona, Arizona', coordinates: { lat: 34.8697, lng: -111.7609 }, type: 'HOUSE', amenities: ['Patio', 'Desert View', 'Kitchen', 'WiFi', 'Fire Pit', 'Parking'], hostId: 'user-5', createdAt: '2024-04-02T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-8', url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80', publicId: 'casita-1', listingId: 'listing-8' }], reviews: [] },
  { id: 'listing-9', title: 'Canal Apartment Near Old Town', pricePerNight: 165, guest: 2, location: 'Amsterdam, Netherlands', coordinates: { lat: 52.3676, lng: 4.9041 }, type: 'APARTMENT', amenities: ['Canal View', 'Bike Storage', 'WiFi', 'Kitchen', 'Washer', 'Heating'], hostId: 'user-3', createdAt: '2024-03-25T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-9', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', publicId: 'canal-apartment-1', listingId: 'listing-9' }], reviews: [] },
  { id: 'listing-10', title: 'Forest A-Frame with Sauna', pricePerNight: 260, guest: 4, location: 'Bend, Oregon', coordinates: { lat: 44.0582, lng: -121.3153 }, type: 'CABIN', amenities: ['Sauna', 'Fireplace', 'Forest View', 'Kitchen', 'WiFi', 'Hiking Trails'], hostId: 'user-2', createdAt: '2024-02-05T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-10', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80', publicId: 'aframe-1', listingId: 'listing-10' }], reviews: [] },
  { id: 'listing-11', title: 'Minimal Studio by the Museum District', pricePerNight: 125, guest: 2, location: 'Paris, France', coordinates: { lat: 48.8566, lng: 2.3522 }, type: 'APARTMENT', amenities: ['WiFi', 'Kitchenette', 'Elevator', 'Workspace', 'Heating', 'Washer'], hostId: 'user-6', createdAt: '2024-05-01T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-11', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', publicId: 'studio-1', listingId: 'listing-11' }], reviews: [] },
  { id: 'listing-12', title: 'Clifftop House Above the Atlantic', pricePerNight: 330, guest: 5, location: 'Madeira, Portugal', coordinates: { lat: 32.7607, lng: -16.9595 }, type: 'HOUSE', amenities: ['Ocean View', 'Terrace', 'Kitchen', 'Pool', 'WiFi', 'Parking'], hostId: 'user-1', createdAt: '2024-04-20T08:00:00Z', updatedAt: '2024-05-08T10:30:00Z', photos: [{ id: 'photo-12', url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80', publicId: 'clifftop-1', listingId: 'listing-12' }], reviews: [] },
]

function enrichListing(l) {
  const defaultDesc = `${l.title}. Premium stay in ${l.location} with thoughtful amenities and easy access to local highlights.`
  const desc =
    typeof l.description === 'string' && l.description.trim().length >= 10 ? l.description.trim() : defaultDesc

  return {
    ...l,
    description: desc,
    category: l.category ?? l.type,
    status: l.status ?? 'PUBLISHED',
    superhost: l.superhost ?? true,
    isAvailable: l.isAvailable ?? true,
    availableFrom: l.availableFrom ?? (l.createdAt ? l.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10)),
  }
}

/** @type {typeof seedUsers} */
let users = structuredClone(seedUsers)
/** @type {ReturnType<typeof enrichListing>[]} */
let listings = seedListingsRaw.map(enrichListing)
/** @type {any[]} */
let bookings = []
/** @type {Map<string, Set<string>>} */
const savedByUserId = new Map()

function publicUser(u) {
  if (!u) return null
  const { password: _p, ...rest } = u
  return rest
}

function findUserById(id) {
  return users.find((x) => x.id === id)
}

function populateListing(row) {
  const host = publicUser(findUserById(row.hostId))
  return { ...row, host: host ?? mockHost(row.hostId), reviews: row.reviews ?? [] }
}

function mockHost(hostId) {
  return publicUser(findUserById(hostId)) ?? { id: hostId, name: 'Host', email: 'host@example.com', username: 'host', phone: '', role: 'HOST', createdAt: new Date().toISOString() }
}

function issueToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    req.user = null
    return next()
  }
  try {
    const token = header.slice(7)
    const payload = jwt.verify(token, JWT_SECRET)
    const user = users.find((u) => u.id === payload.sub && u.isActive !== false)
    req.user = user ? publicUser(user) : null
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    return next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    req.user = null
    return next()
  }
  try {
    const token = header.slice(7)
    const payload = jwt.verify(token, JWT_SECRET)
    const full = users.find((u) => u.id === payload.sub && u.isActive !== false)
    req.user = full ? publicUser(full) : null
    next()
  } catch {
    req.user = null
    next()
  }
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  next()
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}

function bookingNights(checkIn, checkOut) {
  const a = new Date(checkIn).getTime()
  const b = new Date(checkOut).getTime()
  return Math.max(0, Math.ceil((b - a) / (1000 * 60 * 60 * 24)))
}

function serializeBooking(b) {
  const listingRow = listings.find((l) => l.id === b.listingId)
  const listing = listingRow ? populateListing(listingRow) : null
  const guest = publicUser(findUserById(b.guestId))
  return {
    ...b,
    listing,
    guest,
  }
}

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '15mb' }))

app.post('/api/auth/login', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const password = String(req.body?.password ?? '')
  const user = users.find((u) => u.email.toLowerCase() === email)
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Email or password is incorrect.' })
  }
  if (user.isActive === false) {
    return res.status(401).json({ message: 'This account has been deactivated.' })
  }
  const pub = publicUser(user)
  res.json({ user: pub, token: issueToken(user) })
})

app.post('/api/auth/register', (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const username = String(req.body?.username ?? '').trim()
  const phone = String(req.body?.phone ?? '').trim()
  const password = String(req.body?.password ?? '')
  const role = req.body?.role === 'HOST' ? 'HOST' : 'GUEST'
  if (!name || !email || !username || !phone || !password) {
    return res.status(400).json({ message: 'Please fill in every field.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  }
  const exists = users.some((u) => u.email === email || u.username.toLowerCase() === username.toLowerCase())
  if (exists) {
    return res.status(400).json({ message: 'An account with that email or username already exists.' })
  }
  const user = {
    id: `auth-user-${randomUUID()}`,
    name,
    email,
    username,
    phone,
    role,
    createdAt: new Date().toISOString(),
    password,
    isActive: true,
  }
  users.push(user)
  res.json({ user: publicUser(user), token: issueToken(user) })
})

app.post('/api/auth/google', (req, res) => {
  const email = 'google.guest@example.com'
  let user = users.find((u) => u.email === email)
  if (!user) {
    user = {
      id: `google-user-${Date.now()}`,
      name: 'Google Guest',
      email,
      username: 'googleGuest',
      phone: '+1-555-0300',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=160&q=80',
      role: 'GUEST',
      createdAt: new Date().toISOString(),
      password: `google-${Date.now()}`,
      isActive: true,
    }
    users.push(user)
  }
  if (user.isActive === false) {
    return res.status(401).json({ message: 'This Google account has been deactivated.' })
  }
  res.json({ user: publicUser(user), token: issueToken(user) })
})

app.get('/api/listings', optionalAuth, (req, res) => {
  const published = listings.filter((l) => l.status === 'PUBLISHED')
  res.json(published.map(populateListing))
})

app.get('/api/listings/pending', authMiddleware, requireAuth, requireRole('ADMIN'), (req, res) => {
  const pending = listings.filter((l) => l.status === 'PENDING_APPROVAL')
  res.json(pending.map(populateListing))
})

app.get('/api/listings/mine', authMiddleware, requireAuth, requireRole('HOST'), (req, res) => {
  const mine = listings.filter((l) => l.hostId === req.user.id)
  res.json(mine.map(populateListing))
})

app.get('/api/listings/:id', optionalAuth, (req, res) => {
  const row = listings.find((l) => l.id === req.params.id)
  if (!row) return res.status(404).json({ message: 'Not found' })
  const isOwner = req.user?.id === row.hostId
  const isAdmin = req.user?.role === 'ADMIN'
  if (row.status !== 'PUBLISHED' && !isOwner && !isAdmin) {
    return res.status(404).json({ message: 'Not found' })
  }
  res.json(populateListing(row))
})

app.post('/api/listings', authMiddleware, requireAuth, requireRole('HOST'), (req, res) => {
  const body = req.body ?? {}
  const id = `listing-${randomUUID()}`
  const now = new Date().toISOString()
  const photos = Array.isArray(body.photos) && body.photos.length
    ? body.photos
    : body.imageUrl
      ? [{ id: `photo-${id}`, url: body.imageUrl, publicId: 'upload', listingId: id }]
      : []
  const row = enrichListing({
    id,
    title: String(body.title ?? ''),
    description: String(body.description ?? ''),
    pricePerNight: Number(body.pricePerNight ?? body.price ?? 0),
    guest: Number(body.guest ?? body.maxGuests ?? 2),
    location: String(body.location ?? ''),
    coordinates: body.coordinates && typeof body.coordinates === 'object' ? body.coordinates : { lat: 0, lng: 0 },
    type: body.type ?? 'APARTMENT',
    amenities: Array.isArray(body.amenities) ? body.amenities : [],
    hostId: req.user.id,
    category: String(body.category ?? body.type ?? 'STAY'),
    superhost: Boolean(body.superhost),
    isAvailable: body.isAvailable !== false,
    availableFrom: String(body.availableFrom ?? now.slice(0, 10)),
    createdAt: now,
    updatedAt: now,
    photos,
    reviews: [],
    status: 'PENDING_APPROVAL',
  })
  listings.push(row)
  res.status(201).json(populateListing(row))
})

app.put('/api/listings/:id', authMiddleware, requireAuth, (req, res) => {
  const row = listings.find((l) => l.id === req.params.id)
  if (!row) return res.status(404).json({ message: 'Not found' })
  if (row.hostId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' })
  }
  const body = req.body ?? {}
  const next = {
    ...row,
    ...body,
    id: row.id,
    hostId: row.hostId,
    updatedAt: new Date().toISOString(),
  }
  if (body.photos) next.photos = body.photos
  const idx = listings.findIndex((l) => l.id === row.id)
  listings[idx] = next
  res.json(populateListing(next))
})

app.patch('/api/listings/:id/status', authMiddleware, requireAuth, requireRole('ADMIN'), (req, res) => {
  const row = listings.find((l) => l.id === req.params.id)
  if (!row) return res.status(404).json({ message: 'Not found' })
  const status = String(req.body?.status ?? '')
  const allowed = ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'REJECTED']
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }
  row.status = status
  row.updatedAt = new Date().toISOString()
  res.json(populateListing(row))
})

app.delete('/api/listings/:id', authMiddleware, requireAuth, (req, res) => {
  const idx = listings.findIndex((l) => l.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Not found' })
  const row = listings[idx]
  if (row.hostId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' })
  }
  listings.splice(idx, 1)
  bookings = bookings.filter((b) => b.listingId !== row.id)
  res.status(204).end()
})

app.get('/api/saved', authMiddleware, requireAuth, requireRole('GUEST'), (req, res) => {
  const set = savedByUserId.get(req.user.id) ?? new Set()
  res.json({ listingIds: [...set] })
})

app.post('/api/saved/:id', authMiddleware, requireAuth, requireRole('GUEST'), (req, res) => {
  const listingId = req.params.id
  if (!listings.some((l) => l.id === listingId && l.status === 'PUBLISHED')) {
    return res.status(404).json({ message: 'Listing not found' })
  }
  let set = savedByUserId.get(req.user.id)
  if (!set) {
    set = new Set()
    savedByUserId.set(req.user.id, set)
  }
  if (set.has(listingId)) set.delete(listingId)
  else set.add(listingId)
  res.json({ listingIds: [...set] })
})

app.post('/api/bookings', authMiddleware, requireAuth, requireRole('GUEST'), (req, res) => {
  const body = req.body ?? {}
  const listingId = String(body.listingId ?? '')
  const listingRow = listings.find((l) => l.id === listingId)
  if (!listingRow || listingRow.status !== 'PUBLISHED') {
    return res.status(400).json({ message: 'Invalid listing' })
  }
  const checkIn = String(body.checkIn ?? '')
  const checkOut = String(body.checkOut ?? '')
  const guests = Number(body.guests ?? 1)
  const nights = bookingNights(checkIn, checkOut)
  if (nights < 1) {
    return res.status(400).json({ message: 'Check-out must be after check-in.' })
  }
  if (guests < 1 || guests > 16) {
    return res.status(400).json({ message: 'Invalid guest count' })
  }
  const totalPrice = nights * listingRow.pricePerNight
  const booking = {
    id: `booking-${randomUUID()}`,
    listingId,
    guestId: req.user.id,
    checkIn,
    checkOut,
    guests,
    guestName: String(body.guestName ?? ''),
    guestEmail: String(body.guestEmail ?? ''),
    guestPhone: String(body.guestPhone ?? ''),
    guestPhotoDataUrl: body.guestPhotoDataUrl ? String(body.guestPhotoDataUrl) : undefined,
    payment: body.payment ?? {},
    totalPrice,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  }
  bookings.push(booking)
  res.status(201).json(serializeBooking(booking))
})

app.get('/api/bookings/me', authMiddleware, requireAuth, requireRole('GUEST'), (req, res) => {
  const mine = bookings.filter((b) => b.guestId === req.user.id && b.status !== 'CANCELLED')
  res.json(mine.map(serializeBooking))
})

app.delete('/api/bookings/:id', authMiddleware, requireAuth, requireRole('GUEST'), (req, res) => {
  const b = bookings.find((x) => x.id === req.params.id)
  if (!b || b.guestId !== req.user.id) return res.status(404).json({ message: 'Not found' })
  b.status = 'CANCELLED'
  res.status(204).end()
})

app.get('/api/bookings/host', authMiddleware, requireAuth, requireRole('HOST'), (req, res) => {
  const hostListingIds = new Set(listings.filter((l) => l.hostId === req.user.id).map((l) => l.id))
  const list = bookings.filter((b) => hostListingIds.has(b.listingId))
  res.json(list.map(serializeBooking))
})

app.patch('/api/bookings/:id/status', authMiddleware, requireAuth, requireRole('HOST'), (req, res) => {
  const b = bookings.find((x) => x.id === req.params.id)
  if (!b) return res.status(404).json({ message: 'Not found' })
  const listingRow = listings.find((l) => l.id === b.listingId)
  if (!listingRow || listingRow.hostId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  const status = String(req.body?.status ?? '')
  if (!['CONFIRMED', 'CANCELLED', 'PENDING'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }
  b.status = status
  res.json(serializeBooking(b))
})

app.get('/api/admin/stats', authMiddleware, requireAuth, requireRole('ADMIN'), (req, res) => {
  const revenue = bookings.filter((b) => b.status !== 'CANCELLED').reduce((s, b) => s + b.totalPrice, 0)
  res.json({
    totalUsers: users.filter((u) => u.isActive !== false).length,
    totalListings: listings.length,
    totalBookings: bookings.length,
    totalRevenue: revenue,
  })
})

app.get('/api/bookings/all', authMiddleware, requireAuth, requireRole('ADMIN'), (req, res) => {
  const statusFilter = req.query.status && req.query.status !== 'all' ? String(req.query.status).toUpperCase() : null
  const dateFrom = req.query.dateFrom ? String(req.query.dateFrom) : null
  const dateTo = req.query.dateTo ? String(req.query.dateTo) : null
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10))
  let list = [...bookings]
  if (statusFilter) {
    list = list.filter((b) => b.status === statusFilter)
  }
  if (dateFrom) {
    list = list.filter((b) => b.checkIn >= dateFrom)
  }
  if (dateTo) {
    list = list.filter((b) => b.checkOut <= dateTo)
  }
  const total = list.length
  const slice = list.slice((page - 1) * limit, page * limit)
  res.json({
    items: slice.map(serializeBooking),
    total,
    page,
    limit,
  })
})

app.post('/api/admin/users/:id/ban', authMiddleware, requireAuth, requireRole('ADMIN'), (req, res) => {
  const user = users.find((u) => u.id === req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.role === 'ADMIN') {
    return res.status(400).json({ message: 'Cannot ban admin' })
  }
  user.isActive = false
  listings = listings.filter((l) => l.hostId !== user.id)
  bookings.forEach((b) => {
    if (b.guestId === user.id) {
      b.status = 'CANCELLED'
    }
  })
  res.json({ success: true })
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
