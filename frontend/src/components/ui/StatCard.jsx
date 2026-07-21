// StatCard component for displaying KPIs
export function StatCard({ icon: Icon, label, value, description, trend, trendColor = 'emerald' }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`text-sm font-semibold text-${trendColor}-600`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          {description && <p className="mt-2 text-xs text-gray-500">{description}</p>}
        </div>
        {Icon && (
          <div className={`rounded-lg bg-${trendColor}-100 p-3 text-${trendColor}-600`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  )
}
