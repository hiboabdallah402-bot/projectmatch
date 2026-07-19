import { Outlet } from 'react-router-dom'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'

function DashboardLayout() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:px-8 lg:py-8">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-7 lg:p-8">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
