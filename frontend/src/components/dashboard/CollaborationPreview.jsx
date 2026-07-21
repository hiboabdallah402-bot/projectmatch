import { useMemo } from 'react'

function CollaborationPreview({ projects = [], isLoading = false }) {
  const collaborationData = useMemo(() => {
    return {
      activeMembers: [
        { id: 1, name: 'Ahmed N.', avatar: '🧑', status: 'online' },
        { id: 2, name: 'Fatuma M.', avatar: '👩', status: 'online' },
        { id: 3, name: 'Lina K.', avatar: '👱‍♀️', status: 'away' },
      ],
      recentFiles: [
        { id: 1, name: 'api-contract-v2.pdf', icon: '📄', size: '2.4 MB' },
        { id: 2, name: 'design-mockups.fig', icon: '🎨', size: '8.1 MB' },
        { id: 3, name: 'requirements.docx', icon: '📝', size: '1.2 MB' },
      ],
      upcomingMeetings: [
        { id: 1, title: 'Daily Standup', time: '09:30 AM', icon: '🤝' },
        { id: 2, title: 'Sprint Planning', time: '02:00 PM', icon: '📋' },
      ],
    }
  }, [])

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Team Collaboration</h3>
        <div className="h-40 animate-pulse rounded-lg bg-gray-100" />
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Team Collaboration</h3>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Active Members */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Active Members</p>
          <div className="space-y-2">
            {collaborationData.activeMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <span className="text-lg">{member.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{member.name}</p>
                </div>
                <span className={`h-2 w-2 rounded-full ${member.status === 'online' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Recent Files</p>
          <div className="space-y-2">
            {collaborationData.recentFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-2">
                <span className="text-lg">{file.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Upcoming Meetings</p>
          <div className="space-y-2">
            {collaborationData.upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center gap-2">
                <span className="text-lg">{meeting.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{meeting.title}</p>
                  <p className="text-xs text-gray-500">{meeting.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CollaborationPreview
