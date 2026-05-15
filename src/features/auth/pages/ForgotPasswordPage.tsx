import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { forgotPasswordWithApi } from '../authApi'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setInfo('')

    const normalized = email.trim().toLowerCase()
    if (!normalized) {
      setError('Email is required.')
      return
    }

    setIsSubmitting(true)
    const result = await forgotPasswordWithApi(normalized)
    setIsSubmitting(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    setMessage(result.message)
    setInfo(result.info ?? '')
    toast.success('Password reset email request submitted.')
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-12">
      <div className="rounded-2xl border border-[#eadfdb] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your account email. If it exists, we will send you a reset link.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
              placeholder="name@example.com"
              required
            />
          </label>

          {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p>}
          {info && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">{info}</p>
          )}
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#f97316] px-5 py-3 text-sm font-black text-white transition hover:bg-black disabled:opacity-60"
          >
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-[#f97316]">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  )
}
