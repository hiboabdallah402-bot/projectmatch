import { useMemo, useState } from 'react'
import AuthField from '../components/auth/AuthField'
import AuthNotice from '../components/auth/AuthNotice'
import axiosClient from '../api/axiosClient'

const initialFormState = {
	full_name: '',
	email: '',
	password: '',
}

function RegisterPage() {
	const [formData, setFormData] = useState(initialFormState)
	const [fieldErrors, setFieldErrors] = useState({})
	const [requestError, setRequestError] = useState('')
	const [successMessage, setSuccessMessage] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const isFormValid = useMemo(
		() => formData.full_name.trim() && formData.email.trim() && formData.password.trim(),
		[formData],
	)

	const updateField = (event) => {
		const { name, value } = event.target
		setFormData((previous) => ({ ...previous, [name]: value }))
		setFieldErrors((previous) => ({ ...previous, [name]: '' }))
		setRequestError('')
		setSuccessMessage('')
	}

	const inferFieldErrors = (message) => {
		const lower = message.toLowerCase()
		const inferred = {}

		if (lower.includes('full_name')) {
			inferred.full_name = message
		}
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
		setSuccessMessage('')

		try {
			const payload = {
				full_name: formData.full_name.trim(),
				email: formData.email.trim(),
				password: formData.password,
			}

			const response = await axiosClient.post('/api/auth/register', payload)

			setSuccessMessage(response.data?.message || 'Registration successful.')
			setFormData(initialFormState)
		} catch (error) {
			const backendMessage =
				error?.response?.data?.message ||
				'Registration failed. Please check your details and try again.'

			setRequestError(backendMessage)
			setFieldErrors(inferFieldErrors(backendMessage))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className="mx-auto w-full max-w-5xl">
			<div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
				<div className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.32),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(13,148,136,0.35),_transparent_42%)]" />
					<div className="relative space-y-5">
						<p className="inline-flex rounded-full border border-cyan-400/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
							Join ProjectMatch
						</p>
						<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
							Create your account and start collaborating.
						</h1>
						<p className="text-sm leading-7 text-slate-300 sm:text-base">
							Register once to discover projects, connect with teammates, and manage your final year project journey from
							one place.
						</p>

						<ul className="space-y-3 text-sm text-slate-200">
							{['Search curated student projects', 'Apply with clear skill matching', 'Track your collaboration journey'].map((item) => (
								<li key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3">
									<span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="space-y-5">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Register</h2>
						<p className="mt-2 text-sm leading-6 text-slate-600">
							Fill in your details to create a new account. We will validate your data using backend rules.
						</p>
					</div>

					<AuthNotice type="success" message={successMessage} />
					<AuthNotice type="error" message={requestError} />

					<form className="space-y-4" onSubmit={handleSubmit} noValidate>
						<AuthField
							id="full_name"
							name="full_name"
							label="Full Name"
							value={formData.full_name}
							onChange={updateField}
							placeholder="Enter your full name"
							autoComplete="name"
							error={fieldErrors.full_name}
						/>

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
							placeholder="Create a strong password"
							autoComplete="new-password"
							error={fieldErrors.password}
						/>

						<button
							type="submit"
							disabled={!isFormValid || isSubmitting}
							className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
						>
							{isSubmitting ? 'Creating account...' : 'Create account'}
						</button>
					</form>
				</div>
			</div>
		</section>
	)
}

export default RegisterPage
