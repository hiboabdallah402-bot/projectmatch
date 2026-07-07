import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

function PublicLayout() {
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

export default PublicLayout
