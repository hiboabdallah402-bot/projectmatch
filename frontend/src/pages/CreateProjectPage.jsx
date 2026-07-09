import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import ProjectForm from '../components/projects/ProjectForm'

function CreateProjectPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

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

  const handleCreateProject = async (payload) => {
    setIsSubmitting(true)
    setErrorMessage('')
    setFieldErrors({})
    setSuccessMessage('')

    try {
      await axiosClient.post('/api/projects', payload)
      setSuccessMessage('Project created successfully. Redirecting to all projects...')

      setTimeout(() => {
        navigate('/app/projects', {
          replace: true,
          state: {
            successMessage: 'Project created successfully.',
            refreshProjects: Date.now(),
          },
        })
      }, 900)
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to create project right now.'
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
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Create project</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Publish a new project for collaboration. You can edit additional project details in a later phase.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ProjectForm
          onSubmit={handleCreateProject}
          submitLabel="Create project"
          isSubmitting={isSubmitting}
          backendError={errorMessage}
          backendFieldErrors={fieldErrors}
          successMessage={successMessage}
        />
      </div>
    </section>
  )
}

export default CreateProjectPage
