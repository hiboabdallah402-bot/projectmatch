import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthField from '../components/auth/AuthField'
import AuthNotice from '../components/auth/AuthNotice'
import axiosClient from '../api/axiosClient'
import LoadingSpinner from '../components/common/LoadingSpinner'

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
			<div className="grid gap-8 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
				<div className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-7 sm:p-9">
					<div className="space-y-5">
					<p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-800">
							Join ProjectMatch
						</p>
						<h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
							Create your account and start collaborating.
						</h1>
						<p className="text-sm leading-7 text-slate-600 sm:text-base">
							Register once to discover projects, connect with teammates, and manage your final year project journey from
							one place.
						</p>

						<ul className="space-y-3 text-sm text-slate-700">
							{['Search curated student projects', 'Apply with clear skill matching', 'Track your collaboration journey'].map((item) => (
								<li key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
								<span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="min-w-0 space-y-5">
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
							className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
						>
							{isSubmitting ? <LoadingSpinner label="Creating account..." size="sm" className="text-white" /> : 'Create account'}
						</button>
					</form>

					<p className="text-sm text-slate-600">
						Already have an account?{' '}
						<Link to="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
							Sign in here
						</Link>
						.
					</p>
				</div>
			</div>
		</section>
	)
}

export default RegisterPage
