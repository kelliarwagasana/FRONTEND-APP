export type NotificationType =
  | 'BOOKING_CREATED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_DECLINED'
  | 'BOOKING_CANCELLED'
  | 'REVIEW_RECEIVED'
  | 'LISTING_APPROVED'
  | 'LISTING_REJECTED'
  | 'LISTING_CREATED'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  metadata?: Record<string, unknown> | null
  createdAt: string
}

export interface NotificationsResponse {
  data: Notification[]
  meta: {
    total: number
    unreadCount: number
    page: number
    limit: number
    totalPages: number
  }
}
