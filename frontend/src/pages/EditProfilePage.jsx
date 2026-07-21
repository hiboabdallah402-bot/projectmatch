import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import ProfileForm from '../components/profile/ProfileForm'

const emptyProfileValues = {
  bio: '',
  skills: '',
  profile_image: '',
}

function inferFieldErrors(message) {
  const lower = String(message || '').toLowerCase()
  const nextErrors = {}

  if (lower.includes('bio')) {
    nextErrors.bio = message
  }
  if (lower.includes('skills')) {
    nextErrors.skills = message
  }
  if (lower.includes('profile_image') || lower.includes('profile image')) {
    nextErrors.profile_image = message
  }

  return nextErrors
}

function EditProfilePage() {
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState(emptyProfileValues)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const profileFormKey = `${initialValues.bio}::${initialValues.skills}::${initialValues.profile_image}`

  const loadEditableProfile = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await axiosClient.get('/api/profile/me')
      const profile = response.data?.profile || null

      setInitialValues({
        bio: profile?.bio || '',
        skills: profile?.skills || '',
        profile_image: profile?.profile_image || '',
      })
    } catch (error) {
      if (error?.response?.status === 404) {
        setInitialValues(emptyProfileValues)
      } else {
        const message = error?.response?.data?.message || 'Unable to load editable profile right now.'
        setErrorMessage(message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadEditableProfile()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadEditableProfile])

  const handleUpdateProfile = async (payload) => {
    setIsSubmitting(true)
    setErrorMessage('')
    setFieldErrors({})
    setSuccessMessage('')

    try {
      const response = await axiosClient.put('/api/profile/me', payload)
      const updatedProfile = response.data?.profile || payload

      setInitialValues({
        bio: updatedProfile?.bio || '',
        skills: updatedProfile?.skills || '',
        profile_image: updatedProfile?.profile_image || '',
      })

      setSuccessMessage(response.data?.message || 'Profile updated successfully. Redirecting to your profile...')

      setTimeout(() => {
        navigate('/app/profile', {
          replace: true,
          state: {
            successMessage: 'Profile updated successfully.',
          },
        })
      }, 900)
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to update profile right now.'
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
            Profile
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Edit Profile</h1>
        <p className="max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
          Update your bio, skills, and profile image to help teammates get to know you better.
        </p>
      </header>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : errorMessage && !successMessage && Object.keys(fieldErrors).length === 0 ? (
          <div className="space-y-3 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700">
            <p>{errorMessage}</p>
            <button
              type="button"
              onClick={loadEditableProfile}
              className="inline-flex items-center justify-center rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-rose-700 transition hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        ) : (
          <ProfileForm
            key={profileFormKey}
            initialValues={initialValues}
            onSubmit={handleUpdateProfile}
            submitLabel="Save profile"
            isSubmitting={isSubmitting}
            backendError={errorMessage}
            backendFieldErrors={fieldErrors}
            successMessage={successMessage}
          />
        )}
      </div>
    </section>
  )
}

export default EditProfilePage
