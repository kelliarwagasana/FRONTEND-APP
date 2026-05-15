import { Suspense, lazy, useEffect } from 'react'
import {  Routes, Route, Navigate, useLocation, BrowserRouter } from 'react-router-dom'
import NProgress from 'nprogress'
import LoginPage from './features/auth/pages/LoginPage'
import ProfilePage from './features/auth/pages/ProfilePage'
import RegisterPage from './features/auth/pages/RegisterPage'
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage'
import ChangePasswordPage from './features/auth/pages/ChangePasswordPage'
import BookingsPage from './features/bookings/pages/BookingsPage'
import BookingFlowPage from './features/bookings/pages/BookingFlowPage'
import DashboardBookingsPage from './features/dashboard/pages/BookingsPage'
import DashboardGuestsPage from './features/dashboard/pages/GuestsPage'
import DashboardUsersPage from './features/dashboard/pages/UsersPage'
import DashboardReviewsPage from './features/dashboard/pages/ReviewsPage'
import DashboardListingsPage from './features/dashboard/pages/ListingsPage'
import DashboardProfilePage from './features/dashboard/pages/ProfilePage'
import DashboardOverviewPage from './features/dashboard/pages/OverviewPage'
import ModerationQueuePage from './features/admin/pages/ModerationQueuePage'
import AllBookingsAdminPage from './features/admin/pages/AllBookingsAdminPage'
import CreateListingPage from './features/host/pages/CreateListingPage'
import EditListingPage from './features/host/pages/EditListingPage'
import HomePage from './features/home/pages/HomePage'
import ListingsPage from './features/listings/pages/ListingsPage'
import SavedListingsPage from './features/listings/pages/SavedListingsPage'
import LoadingPage from './shared/components/LoadingPage'
import NotFound from './shared/components/NotFound'
import { Toaster } from 'react-hot-toast'

const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'))
const ListingDetailPage = lazy(() => import('./features/listings/pages/ListingDetailPage'))

function RouteProgressListener() {
  const location = useLocation()

  useEffect(() => {
    NProgress.start()
    const timer = setTimeout(() => {
      NProgress.done()
    }, 100)

    return () => clearTimeout(timer)
  }, [location])

  return null
}

export default function App() {
  return (
    
    <BrowserRouter>
    
      <RouteProgressListener />
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route
          path="/listings/:listingId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ListingDetailPage />
            </Suspense>
            
          }
        />
        <Route path="/listings/:listingId/book" element={<BookingFlowPage />} />
        <Route path="/saved" element={<SavedListingsPage />} />
        <Route path="/explore" element={<Navigate to="/listings" replace />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<LoadingPage />}>
              <DashboardPage />
            </Suspense>
            
          }
        >
          <Route index element={<DashboardOverviewPage />} />
          <Route path="bookings" element={<DashboardBookingsPage />} />
          <Route path="guests" element={<DashboardGuestsPage />} />
          <Route path="users" element={<DashboardUsersPage />} />
          <Route path="reviews" element={<DashboardReviewsPage />} />
          <Route path="listings" element={<DashboardListingsPage />} />
          <Route path="moderation" element={<ModerationQueuePage />} />
          <Route path="platform-bookings" element={<AllBookingsAdminPage />} />
          <Route path="create-listing" element={<CreateListingPage />} />
          <Route path="edit-listing/:listingId" element={<EditListingPage />} />
          <Route path="profile" element={<DashboardProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

