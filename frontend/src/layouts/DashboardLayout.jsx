import { Outlet } from 'react-router-dom'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'

function DashboardLayout() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
