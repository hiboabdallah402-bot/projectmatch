import { useCallback, useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import ApplicationCard from '../components/applications/ApplicationCard'
import ApplicationEmptyState from '../components/applications/ApplicationEmptyState'
import ApplicationSkeletonCard from '../components/applications/ApplicationSkeletonCard'
import ApplicationsAlert from '../components/applications/ApplicationsAlert'

function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [actionErrorMessage, setActionErrorMessage] = useState('')
  const [processingApplicationId, setProcessingApplicationId] = useState(null)
  const [recentlyUpdatedApplicationId, setRecentlyUpdatedApplicationId] = useState(null)

  const loadApplications = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await axiosClient.get('/api/applications?scope=received')
      const receivedApplications = Array.isArray(response.data?.applications) ? response.data.applications : []
      setApplications(receivedApplications)
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to load applications right now.'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadApplications()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadApplications])

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
      setRecentlyUpdatedApplicationId(applicationId)
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to update application right now.'
      setActionErrorMessage(message)
    } finally {
      setProcessingApplicationId(null)
    }
  }

  useEffect(() => {
    if (!recentlyUpdatedApplicationId) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setRecentlyUpdatedApplicationId(null)
    }, 900)

    return () => window.clearTimeout(timeoutId)
  }, [recentlyUpdatedApplicationId])

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Applications
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Applications inbox</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Review applications for your projects, then accept or reject pending requests without leaving this page.
        </p>
      </header>

      <ApplicationsAlert type="success" message={actionMessage} />
      <ApplicationsAlert type="error" message={actionErrorMessage} />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ApplicationSkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <ApplicationsAlert type="error" message={errorMessage} actionLabel="Retry" onAction={loadApplications} isActionDisabled={isLoading} />
      ) : null}

      {!isLoading && !errorMessage && applications.length === 0 ? (
        <ApplicationEmptyState />
      ) : null}

      {!isLoading && !errorMessage && applications.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              isProcessing={processingApplicationId === application.id}
              isRecentlyUpdated={recentlyUpdatedApplicationId === application.id}
              onAccept={() => handleUpdateApplicationStatus(application.id, 'Accepted')}
              onReject={() => handleUpdateApplicationStatus(application.id, 'Rejected')}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default ApplicationsPage
