import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import ProfileAvatar from '../components/profile/ProfileAvatar'

function formatJoinedDate(createdAt) {
  if (!createdAt) {
    return 'Unavailable'
  }

  const parsed = new Date(createdAt)
  if (Number.isNaN(parsed.getTime())) {
    return 'Unavailable'
  }

  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ProfilePage() {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadProfile = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await axiosClient.get('/api/auth/me')
      setUser(response.data?.user || null)
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to load profile right now.'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProfile()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadProfile])

  const joinedDate = formatJoinedDate(user?.created_at)
  const successMessage = location.state?.successMessage || ''

  return (
    <section className="space-y-6">
      <header className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-4">
        <div className="space-y-3">
          <p className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
            Profile
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">View profile</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Review your account information and update your profile details.
          </p>
        </div>

        <Link
          to="/app/profile/edit"
          className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900"
        >
          Edit profile
        </Link>
      </header>

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {isLoading ? (
        <article className="space-y-6 rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-2xl bg-slate-100" />
            <div className="space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
            <div className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
          </div>
        </article>
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="space-y-3 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700">
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={loadProfile}
            className="inline-flex items-center justify-center rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-rose-700 transition hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!isLoading && !errorMessage && !user ? (
        <div className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          No profile data is available for this account.
        </div>
      ) : null}

      {!isLoading && !errorMessage && user ? (
        <article className="space-y-6 rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <ProfileAvatar fullName={user.full_name} email={user.email} />
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{user.full_name || 'Name unavailable'}</h2>
              <p className="text-sm text-slate-600">{user.email || 'Email unavailable'}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Full Name</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{user.full_name || 'Unavailable'}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{user.email || 'Unavailable'}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Date Joined</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{joinedDate}</p>
            </div>
          </div>
        </article>
      ) : null}
    </section>
  )
}

export default ProfilePage
