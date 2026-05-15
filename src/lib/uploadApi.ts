import { apiRequest } from './api'
import type { User } from '../features/auth/types'
import type { Listing } from '../features/listings/types'

export async function uploadUserAvatar(userId: string, file: File): Promise<User> {
  const form = new FormData()
  form.append('avatar', file)
  return apiRequest<User>(`/api/v1/upload/users/${userId}/avatar`, {
    method: 'POST',
    body: form,
  })
}

export async function deleteUserAvatar(userId: string): Promise<void> {
  await apiRequest(`/api/v1/upload/users/${userId}/avatar`, { method: 'DELETE' })
}

export async function uploadListingPhotos(listingId: string, files: File[]): Promise<Listing> {
  const form = new FormData()
  files.forEach((file) => form.append('photos', file))
  return apiRequest<Listing>(`/api/v1/upload/listings/${listingId}/photos`, {
    method: 'POST',
    body: form,
  })
}

export async function deleteListingPhoto(listingId: string, photoId: string | number): Promise<void> {
  await apiRequest(`/api/v1/upload/listings/${listingId}/photos/${photoId}`, { method: 'DELETE' })
}
