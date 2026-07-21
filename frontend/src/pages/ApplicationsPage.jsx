import { useCallback, useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import { Check, X, AlertCircle, Inbox } from 'lucide-react'

function ApplicationsPage() {
  const [viewScope, setViewScope] = useState('received')
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [actionErrorMessage, setActionErrorMessage] = useState('')
  const [processingApplicationId, setProcessingApplicationId] = useState(null)

  const loadApplications = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await axiosClient.get(`/api/applications?scope=${viewScope}`)
      const scopedApplications = Array.isArray(response.data?.applications) ? response.data.applications : []
      setApplications(scopedApplications)
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to load applications.'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }, [viewScope])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadApplications()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadApplications])

  useEffect(() => {
    setActionMessage('')
    setActionErrorMessage('')
  }, [viewScope])

  const handleUpdateApplicationStatus = async (applicationId, nextStatus) => {
    if (!applicationId || !nextStatus || processingApplicationId === applicationId) {
      return
    }

    setProcessingApplicationId(applicationId)
    setActionMessage('')
    setActionErrorMessage('')

    try {
      const response = await axiosClient.patch(`/api/applications/${applicationId}`, {
        status: nextStatus,
      })

      const updatedApplication = response.data?.application || null

      setApplications((previous) =>
        previous.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                ...(updatedApplication || {}),
                status: updatedApplication?.status || nextStatus,
              }
            : application,
        ),
      )

      const successMessage = response.data?.message || `Application ${nextStatus.toLowerCase()}.`
      setActionMessage(successMessage)
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to update application.'
      setActionErrorMessage(message)
    } finally {
      setProcessingApplicationId(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Accepted': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Rejected': 'bg-red-50 text-red-700 border-red-200',
      'Withdrawn': 'bg-gray-50 text-gray-700 border-gray-200',
    }
    const style = statusStyles[status] || statusStyles['Pending']
    return (
      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${style}`}>
        {status}
      </span>
    )
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="mt-1 text-gray-600">
          {viewScope === 'received'
            ? 'Review and respond to applications for your projects'
            : 'Track the status of applications you have submitted'}
        </p>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewScope('received')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            viewScope === 'received'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setViewScope('submitted')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            viewScope === 'submitted'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Submitted
        </button>
      </div>

      {/* Messages */}
      {actionMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          ✓ {actionMessage}
        </div>
      )}
      {actionErrorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>{actionErrorMessage}</div>
        </div>
      )}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg border border-gray-200 bg-gray-50 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty States */}
      {!isLoading && errorMessage && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-3 text-sm font-medium text-gray-900">Unable to load applications</p>
          <p className="mt-1 text-xs text-gray-500">{errorMessage}</p>
        </div>
      )}

      {!isLoading && !errorMessage && applications.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-3 text-sm font-medium text-gray-900">
            {viewScope === 'received' ? 'No applications yet' : 'No submitted applications yet'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {viewScope === 'received'
              ? 'Applications will appear here when students apply to your projects'
              : 'Applications you submit will appear here'}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !errorMessage && applications.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {viewScope === 'received' ? 'Applicant' : 'Project'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {viewScope === 'received' ? 'Project' : 'Applicant'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Applied
                  </th>
                  {viewScope === 'received' && (
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {viewScope === 'received' ? app.user?.full_name : app.project?.title}
                      </p>
                      {viewScope === 'received' && (
                        <p className="mt-0.5 text-xs text-gray-500">{app.user?.email}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {viewScope === 'received' ? app.project?.title : app.user?.full_name}
                      </p>
                      {viewScope !== 'received' && (
                        <p className="mt-0.5 text-xs text-gray-500">{app.user?.email}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    {viewScope === 'received' && (
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {app.status === 'Pending' && (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateApplicationStatus(app.id, 'Accepted')
                                }
                                disabled={processingApplicationId === app.id}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                              >
                                <Check className="h-4 w-4" />
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateApplicationStatus(app.id, 'Rejected')
                                }
                                disabled={processingApplicationId === app.id}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </button>
                            </>
                          )}
                          {app.status !== 'Pending' && (
                            <span className="text-xs text-gray-500 italic">No actions available</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

export default ApplicationsPage
