import { useOutletContext } from 'react-router-dom'
import type { DashboardOutletContext } from '../utils/dashboardUtils'
import AdminDashboardPage from '../../admin/pages/AdminDashboardPage'
import HostDashboardPage from '../../host/pages/HostDashboardPage'

export default function OverviewPage() {
  const { currentUser } = useOutletContext<DashboardOutletContext>()

  if (currentUser.role === 'ADMIN') {
    return <AdminDashboardPage />
  }

  if (currentUser.role === 'HOST') {
    return <HostDashboardPage />
  }

  return null
}
