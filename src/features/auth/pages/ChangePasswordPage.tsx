import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { changePasswordWithApi } from '../authApi'
import { useAuth } from '../hooks/useAuth'

export default function ChangePasswordPage() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!currentPassword || !newPassword) {
      setError('Both current password and new password are required.')
      return
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }

    setIsSubmitting(true)
    const result = await changePasswordWithApi(currentPassword, newPassword)
    setIsSubmitting(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    setMessage(result.message)
    setCurrentPassword('')
    setNewPassword('')
    toast.success('Password changed successfully.')
  }

  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-xl px-4 py-12">
        <div className="rounded-2xl border border-[#eadfdb] bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-black">Login required</p>
          <p className="mt-2 text-sm text-slate-600">Please login first to change your password.</p>
          <Link to="/login" className="mt-4 inline-block font-bold text-[#f97316]">
            Go to login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-12">
      <div className="rounded-2xl border border-[#eadfdb] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">Change password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Update your account password. You must enter your current password first.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Current password
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
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
            {isSubmitting ? 'Saving...' : 'Change password'}
          </button>
        </form>
      </div>
    </main>
  )
}
