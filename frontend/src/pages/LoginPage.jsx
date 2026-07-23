import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthField from '../components/auth/AuthField'
import AuthNotice from '../components/auth/AuthNotice'
import axiosClient from '../api/axiosClient'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { setAccessToken } from '../utils/auth'

const initialFormState = {
  email: '',
  password: '',
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState(initialFormState)
  const [fieldErrors, setFieldErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTarget = location.state?.from?.pathname || '/app'

  const isFormValid = useMemo(
    () => formData.email.trim() && formData.password.trim(),
    [formData],
  )

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setFieldErrors((previous) => ({ ...previous, [name]: '' }))
    setRequestError('')
  }

  const inferFieldErrors = (message) => {
    const lower = message.toLowerCase()
    const inferred = {}

    if (lower.includes('email')) {
      inferred.email = message
    }
    if (lower.includes('password')) {
      inferred.password = message
    }

    return inferred
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFieldErrors({})
    setRequestError('')

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      }

      const response = await axiosClient.post('/api/auth/login', payload)
      const accessToken = response.data?.access_token

      if (!accessToken) {
        throw new Error('Login response did not include an access token.')
      }

      setAccessToken(accessToken)
      setFormData(initialFormState)
      navigate(redirectTarget, { replace: true })
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please verify your credentials and try again.'

      setRequestError(backendMessage)
      setFieldErrors(inferFieldErrors(backendMessage))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="grid gap-8 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-7 sm:p-9">
          <div className="relative space-y-5">
            <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-800">
              Welcome back
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Sign in and continue to your protected workspace.
            </h1>
            <p className="text-sm leading-7 text-slate-600 sm:text-base">
              Access your account to continue exploring projects, tracking applications, and preparing for the next
              collaboration steps.
            </p>

            <div className="space-y-3 text-sm text-slate-700">
              {['Resume your project journey', 'Keep your applications organized', 'Access protected platform features'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Login</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter your registered email and password to access the protected area.
            </p>
          </div>

          <AuthNotice type="error" message={requestError} />

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <AuthField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={updateField}
              placeholder="Enter your email"
              autoComplete="email"
              error={fieldErrors.email}
            />

            <AuthField
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={updateField}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={fieldErrors.password}
            />

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {isSubmitting ? <LoadingSpinner label="Signing in..." size="sm" className="text-white" /> : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-slate-600">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
              Create one here
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
