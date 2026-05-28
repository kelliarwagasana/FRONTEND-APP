export interface MonthBucket {
  month: string
  label: string
  value: number
}

export interface AnalyticsData {
  summary: {
    totalListings: number
    totalBookings: number
    totalReviews: number
    totalRevenue: number
    averageRating: number | null
  }
  listingsByStatus: { published: number; pending: number; rejected: number }
  bookingsByStatus: { pending: number; confirmed: number; cancelled: number }
  reviewsByRating: { rating: number; count: number }[]
  listingsByMonth: MonthBucket[]
  bookingsByMonth: MonthBucket[]
  reviewsByMonth: MonthBucket[]
  revenueByMonth: MonthBucket[]
}
