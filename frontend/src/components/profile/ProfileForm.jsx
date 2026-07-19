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
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {backendError ? (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {backendError}
        </div>
      ) : null}

      <div className="space-y-2.5">
        <label htmlFor="bio" className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Bio
        </label>
        <p className="text-sm leading-6 text-slate-600">Write a concise introduction so teammates understand your background and interests.</p>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formValues.bio}
          onChange={handleChange}
          placeholder="Share a short introduction"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
        />
        {mergedFieldErrors.bio ? <p className="text-xs font-medium text-rose-700">{mergedFieldErrors.bio}</p> : null}
      </div>

      <div className="space-y-2.5">
        <label htmlFor="skills" className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Skills
        </label>
        <p className="text-sm leading-6 text-slate-600">List technologies or strengths separated by commas.</p>
        <input
          id="skills"
          name="skills"
          type="text"
          value={formValues.skills}
          onChange={handleChange}
          placeholder="Example: React, Flask, PostgreSQL"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
        />
        {mergedFieldErrors.skills ? <p className="text-xs font-medium text-rose-700">{mergedFieldErrors.skills}</p> : null}
      </div>

      <div className="space-y-2.5">
        <label htmlFor="profile_image" className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Profile Image URL
        </label>
        <p className="text-sm leading-6 text-slate-600">Use a public `http` or `https` image link if you want a custom avatar.</p>
        <input
          id="profile_image"
          name="profile_image"
          type="url"
          value={formValues.profile_image}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
        />
        {mergedFieldErrors.profile_image ? <p className="text-xs font-medium text-rose-700">{mergedFieldErrors.profile_image}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? <LoadingSpinner label="Saving profile..." size="sm" className="text-white" /> : submitLabel}
      </button>
    </form>
  )
}

export default ProfileForm
