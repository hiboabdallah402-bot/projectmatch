import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import ProjectForm from '../components/projects/ProjectForm'

function EditProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await axiosClient.get(`/api/projects/${projectId}`)
        const project = response.data?.project

        setInitialValues({
          title: project?.title || '',
          description: project?.description || '',
          required_skills: project?.required_skills || '',
          team_size: project?.team_size ?? '',
        })
      } catch (error) {
        const message = error?.response?.data?.message || 'Unable to load project details right now.'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  const inferFieldErrors = (message) => {
    const lower = String(message || '').toLowerCase()
    const nextErrors = {}

    if (lower.includes('title')) {
      nextErrors.title = message
    }
    if (lower.includes('description')) {
      nextErrors.description = message
    }
    if (lower.includes('required_skills') || lower.includes('required skills')) {
      nextErrors.required_skills = message
    }
    if (lower.includes('team_size') || lower.includes('team size')) {
      nextErrors.team_size = message
    }

    return nextErrors
  }

  const handleUpdateProject = async (payload) => {
    setIsSubmitting(true)
    setErrorMessage('')
    setFieldErrors({})
    setSuccessMessage('')

    try {
      await axiosClient.put(`/api/projects/${projectId}`, payload)
      setSuccessMessage('Project updated successfully. Redirecting to all projects...')

      setTimeout(() => {
        navigate('/app/projects', {
          replace: true,
          state: {
            successMessage: 'Project updated successfully.',
            refreshProjects: Date.now(),
          },
        })
      }, 900)
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to update project right now.'
      setErrorMessage(message)
      setFieldErrors(inferFieldErrors(message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
            Projects
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Edit Project</h1>
        <p className="max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
          Update your project details. Only project owners can save changes.
        </p>
      </header>

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-6">
            <div className="h-20 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-20 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-20 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-20 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      ) : null}

      {!isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {errorMessage ? (
            <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 flex items-start gap-3 mb-6">
              <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </div>
          ) : null}

          {initialValues ? (
            <ProjectForm
              initialValues={initialValues}
              onSubmit={handleUpdateProject}
              submitLabel="Save Changes"
              isSubmitting={isSubmitting}
              backendError={errorMessage}
              backendFieldErrors={fieldErrors}
              successMessage={successMessage}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export default EditProjectPage
