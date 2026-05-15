import { FormEvent, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { resetPasswordWithApi } from '../authApi'

function useTokenFromQuery() {
  const location = useLocation()
  return useMemo(() => new URLSearchParams(location.search).get('token') ?? '', [location.search])
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const tokenFromQuery = useTokenFromQuery()
  const [token, setToken] = useState(tokenFromQuery)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!token.trim()) {
      setError('Reset token is required.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setIsSubmitting(true)
    const result = await resetPasswordWithApi(token.trim(), password)
    setIsSubmitting(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    setMessage(result.message)
    toast.success('Password reset successfully.')
    setTimeout(() => navigate('/login'), 800)
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-12">
      <div className="rounded-2xl border border-[#eadfdb] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter the reset token from your email and set a new password.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Reset token
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
              placeholder="Paste token here"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            New password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
              placeholder="At least 8 characters"
              required
            />
          </label>

          {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p>}
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#f97316] px-5 py-3 text-sm font-black text-white transition hover:bg-black disabled:opacity-60"
          >
            {isSubmitting ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Return to{' '}
          <Link to="/login" className="font-bold text-[#f97316]">
            login
          </Link>
        </p>
      </div>
    </main>
  )
}
