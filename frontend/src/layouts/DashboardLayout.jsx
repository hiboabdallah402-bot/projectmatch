import { Outlet } from 'react-router-dom'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import { Menu } from 'lucide-react'
import { useState } from 'react'

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-white">
        <div className="flex flex-col h-full">
          {/* Mobile menu button */}
          <div className="sm:hidden border-b border-slate-200 px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
              <span>Menu</span>
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
