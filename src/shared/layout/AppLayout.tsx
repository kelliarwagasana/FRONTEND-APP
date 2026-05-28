import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'

export default function AppLayout() {
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <div className="flex min-h-screen flex-col">
      <div className={isDashboard ? 'flex-1' : 'flex-1 pb-16'}>
        <Outlet />
      </div>
      {!isDashboard && <Footer />}
    </div>
  )
}

