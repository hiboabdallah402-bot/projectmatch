import { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import LoadingSpinner from '../components/common/LoadingSpinner'

const healthEndpoint = import.meta.env.VITE_API_HEALTH_ENDPOINT || '/health'

function SetupStatusPage() {
  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('Connecting to backend...')

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axiosClient.get(healthEndpoint)

        setStatus('connected')
        setMessage(`Backend is reachable. Health endpoint ${healthEndpoint} responded successfully.`)
      } catch (error) {
        const fallback =
          'Unable to connect to backend with current API settings. Verify VITE_API_BASE_URL and VITE_API_HEALTH_ENDPOINT.'
        const detail = error?.response?.data?.message || error?.message || fallback

        setStatus('failed')
        setMessage(detail)
      }
    }

    checkBackend()
  }, [])

  const statusClassName =
    status === 'connected'
      ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
      : status === 'failed'
        ? 'bg-rose-100 text-rose-700 border-rose-300'
        : 'bg-amber-100 text-amber-700 border-amber-300'

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-3">
        <p className="inline-flex rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          Setup Status
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          ProjectMatch system status
        </h1>
        <p className="text-base leading-7 text-slate-600">
          Review the current API configuration and live backend connectivity for this environment.
        </p>
      </header>

      <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <h2 className="text-lg font-medium text-slate-900">Backend connectivity</h2>
        <p className="mt-2 text-sm text-slate-600">
          API base URL: <span className="font-medium">{axiosClient.defaults.baseURL}</span>
        </p>
        <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${statusClassName}`}>
          {status === 'checking' ? <LoadingSpinner label="Connecting to backend..." size="sm" className="text-inherit" /> : message}
        </div>
      </article>
    </section>
  )
}

export default SetupStatusPage
