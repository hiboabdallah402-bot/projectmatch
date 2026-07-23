import { useNavigate } from 'react-router-dom'

function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      label: 'Create Project',
      icon: '➕',
      color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700',
      onClick: () => navigate('/app/projects/create'),
    },
    {
      label: 'Browse Projects',
      icon: '🔍',
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
      onClick: () => navigate('/app/projects'),
    },
    {
      label: 'View Applications',
      icon: '📬',
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
      onClick: () => navigate('/app/applications'),
    },
    {
      label: 'Edit Profile',
      icon: '👤',
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-700',
      onClick: () => navigate('/app/profile/edit'),
    },
  ]

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`flex flex-col items-center gap-2 rounded-lg border border-gray-200 px-4 py-4 text-center transition-all hover:shadow-md ${action.color}`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default QuickActions
