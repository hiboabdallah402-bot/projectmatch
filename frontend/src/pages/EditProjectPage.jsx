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
        <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Projects
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Edit project</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Update your project details. Only project owners are allowed to save changes.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : initialValues ? (
          <ProjectForm
            initialValues={initialValues}
            onSubmit={handleUpdateProject}
            submitLabel="Save changes"
            isSubmitting={isSubmitting}
            backendError={errorMessage}
            backendFieldErrors={fieldErrors}
            successMessage={successMessage}
          />
        ) : (
          <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage || 'Project not found.'}
          </div>
        )}
      </div>
    </section>
  )
}

export default EditProjectPage
