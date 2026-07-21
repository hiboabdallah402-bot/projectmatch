import { useMemo, useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

const defaultValues = {
  bio: '',
  skills: '',
  profile_image: '',
}

function ProfileForm({
  initialValues = defaultValues,
  onSubmit,
  submitLabel = 'Save profile',
  isSubmitting = false,
  backendError = '',
  backendFieldErrors = {},
  successMessage = '',
}) {
  const [formValues, setFormValues] = useState({
    bio: initialValues.bio || '',
    skills: initialValues.skills || '',
    profile_image: initialValues.profile_image || '',
  })

  const [clientFieldErrors, setClientFieldErrors] = useState({})

  const mergedFieldErrors = {
    ...clientFieldErrors,
    ...backendFieldErrors,
  }

  const isFormValid = useMemo(() => {
    return formValues.bio.length <= 500 && formValues.skills.length <= 250 && formValues.profile_image.length <= 500
  }, [formValues])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((previous) => ({ ...previous, [name]: value }))
    setClientFieldErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (formValues.bio.length > 500) {
      nextErrors.bio = 'Bio must be 500 characters or fewer.'
    }
    if (formValues.skills.length > 250) {
      nextErrors.skills = 'Skills must be 250 characters or fewer.'
    }
    if (formValues.profile_image.length > 500) {
      nextErrors.profile_image = 'Profile image URL must be 500 characters or fewer.'
    }

    if (formValues.profile_image.trim()) {
      try {
        const url = new URL(formValues.profile_image.trim())
        if (!['http:', 'https:'].includes(url.protocol)) {
          nextErrors.profile_image = 'Profile image URL must start with http:// or https://.'
        }
      } catch {
        nextErrors.profile_image = 'Enter a valid profile image URL.'
      }
    }

    setClientFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    const payload = {
      bio: formValues.bio.trim() || null,
      skills: formValues.skills.trim() || null,
      profile_image: formValues.profile_image.trim() || null,
    }

    onSubmit(payload)
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
        <label htmlFor="bio" className="text-sm font-semibold text-gray-700">
          Bio
        </label>
        <p className="text-xs text-gray-500">Tell teammates about yourself and your interests</p>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formValues.bio}
          onChange={handleChange}
          placeholder="Share a short introduction..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
        {mergedFieldErrors.bio ? (
          <p className="text-xs font-medium text-red-600 flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {mergedFieldErrors.bio}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <label htmlFor="skills" className="text-sm font-semibold text-gray-700">
          Skills
        </label>
        <p className="text-xs text-gray-500">Comma-separated list of your skills and technologies</p>
        <input
          id="skills"
          name="skills"
          type="text"
          value={formValues.skills}
          onChange={handleChange}
          placeholder="e.g., React, Python, PostgreSQL"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
        {mergedFieldErrors.skills ? (
          <p className="text-xs font-medium text-red-600 flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {mergedFieldErrors.skills}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <label htmlFor="profile_image" className="text-sm font-semibold text-gray-700">
          Profile Image URL
        </label>
        <p className="text-xs text-gray-500">Use a public image link (http or https) for a custom avatar</p>
        <input
          id="profile_image"
          name="profile_image"
          type="url"
          value={formValues.profile_image}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
        {mergedFieldErrors.profile_image ? (
          <p className="text-xs font-medium text-red-600 flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {mergedFieldErrors.profile_image}
          </p>
        ) : null}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner label="" size="sm" className="text-white" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  )
}

export default ProfileForm
