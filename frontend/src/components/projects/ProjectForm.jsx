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
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {successMessage ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {backendError ? (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {backendError}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formValues.title}
          onChange={updateField}
          placeholder="Enter project title"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
        />
        {fieldErrors.title ? <p className="text-xs font-medium text-rose-600">{fieldErrors.title}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={formValues.description}
          onChange={updateField}
          placeholder="Describe your project goals and scope"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
        />
        {fieldErrors.description ? <p className="text-xs font-medium text-rose-600">{fieldErrors.description}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="required_skills" className="text-sm font-medium text-slate-700">
          Required Skills
        </label>
        <input
          id="required_skills"
          name="required_skills"
          type="text"
          value={formValues.required_skills}
          onChange={updateField}
          placeholder="Example: React, Flask, SQL"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
        />
        {fieldErrors.required_skills ? <p className="text-xs font-medium text-rose-600">{fieldErrors.required_skills}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="team_size" className="text-sm font-medium text-slate-700">
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
          placeholder="Enter team size"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
        />
        {fieldErrors.team_size ? <p className="text-xs font-medium text-rose-600">{fieldErrors.team_size}</p> : null}
      </div>

      <button
        type="submit"
        disabled={!isFormReady || isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? <LoadingSpinner label="Submitting..." size="sm" className="text-white" /> : submitLabel}
      </button>
    </form>
  )
}

export default ProjectForm
