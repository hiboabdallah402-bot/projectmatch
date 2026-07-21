import { useMemo, useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

const defaultValues = {
  title: '',
  description: '',
  required_skills: '',
  team_size: '',
}

function ProjectForm({
  initialValues = defaultValues,
  onSubmit,
  submitLabel = 'Save project',
  isSubmitting = false,
  backendError = '',
  backendFieldErrors = {},
  successMessage = '',
}) {
  const [formValues, setFormValues] = useState({ ...defaultValues, ...initialValues })
  const [clientFieldErrors, setClientFieldErrors] = useState({})

  const fieldErrors = { ...backendFieldErrors, ...clientFieldErrors }

  const isFormReady = useMemo(
    () =>
      formValues.title.trim() &&
      formValues.description.trim() &&
      formValues.required_skills.trim() &&
      String(formValues.team_size).trim(),
    [formValues],
  )

  const updateField = (event) => {
    const { name, value } = event.target
    setFormValues((previous) => ({ ...previous, [name]: value }))
    setClientFieldErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!formValues.title.trim()) {
      nextErrors.title = 'Title is required.'
    }

    if (!formValues.description.trim()) {
      nextErrors.description = 'Description is required.'
    }

    if (!formValues.required_skills.trim()) {
      nextErrors.required_skills = 'Required skills are required.'
    }

    const teamSizeValue = Number(formValues.team_size)
    if (!String(formValues.team_size).trim()) {
      nextErrors.team_size = 'Team size is required.'
    } else if (!Number.isInteger(teamSizeValue) || teamSizeValue < 1) {
      nextErrors.team_size = 'Team size must be a positive integer.'
    }

    setClientFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    await onSubmit({
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      required_skills: formValues.required_skills.trim(),
      team_size: Number(formValues.team_size),
    })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {successMessage ? (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      ) : null}

      {backendError ? (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {backendError}
        </div>
      ) : null}

      <div className="space-y-3">
        <label htmlFor="title" className="text-sm font-semibold text-gray-700">
          Project Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formValues.title}
          onChange={updateField}
          placeholder="Enter a clear project title"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
        {fieldErrors.title ? (
          <p className="text-xs font-medium text-red-600 flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <label htmlFor="description" className="text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={formValues.description}
          onChange={updateField}
          placeholder="Describe your project goals, scope, and expectations..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
        {fieldErrors.description ? (
          <p className="text-xs font-medium text-red-600 flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {fieldErrors.description}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <label htmlFor="required_skills" className="text-sm font-semibold text-gray-700">
          Required Skills
        </label>
        <input
          id="required_skills"
          name="required_skills"
          type="text"
          value={formValues.required_skills}
          onChange={updateField}
          placeholder="e.g., React, Python, PostgreSQL"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
        {fieldErrors.required_skills ? (
          <p className="text-xs font-medium text-red-600 flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {fieldErrors.required_skills}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <label htmlFor="team_size" className="text-sm font-semibold text-gray-700">
          Team Size
        </label>
        <input
          id="team_size"
          name="team_size"
          type="number"
          min="1"
          step="1"
          value={formValues.team_size}
          onChange={updateField}
          placeholder="How many team members do you need?"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
        {fieldErrors.team_size ? (
          <p className="text-xs font-medium text-red-600 flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {fieldErrors.team_size}
          </p>
        ) : null}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={!isFormReady || isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none flex-1"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner label="" size="sm" className="text-white" />
              Submitting...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  )
}

export default ProjectForm
