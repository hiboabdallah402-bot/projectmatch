import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

function PublicLayout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isAboutPage = location.pathname === '/about'

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#07090d_0%,#0b0d12_18%,#12151d_42%,#f5f7fb_42%,#f7f8fa_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_18%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_22%)]" />
      <Navbar />
      {isHomePage ? (
        <main className="flex-1 overflow-x-hidden bg-transparent p-0 shadow-none">
          <Outlet />
        </main>
      ) : isAboutPage ? (
        <div className="relative mx-auto w-full max-w-7xl flex-col px-4 pt-6 pb-12 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
          <main className="flex-1 overflow-x-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8 lg:p-10">
            <Outlet />
          </main>
        </div>
      ) : (
        <div className="relative mx-auto flex min-h-[calc(100vh-60px)] w-full max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
          <main className="flex-1 overflow-x-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8 lg:p-10">
            <Outlet />
          </main>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default PublicLayout
