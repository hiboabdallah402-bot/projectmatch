import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { getAccessToken } from '../utils/auth'

function ProtectedLayout() {
  const location = useLocation()
  const token = getAccessToken()
  const isWorkspace = location.pathname.startsWith('/app')

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // For workspace routes (/app/*), render full-height layout without container
  if (isWorkspace) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    )
  }

  // For other protected routes, render with rounded container
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-138px)] w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <main className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default ProtectedLayout
