import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi'
import { authForm } from '../authFormClasses'
import type { LoginCredentials } from '../types'

interface LoginFormProps {
  error?: string
  onSubmit: (credentials: LoginCredentials) => void
}

export default function LoginForm({ error, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className={authForm.card}>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#f97316]">Welcome back</p>
      <h1 className="mt-2 text-2xl font-bold text-black">Sign in to AirBnb</h1>
      <p className="mt-2 text-sm text-black/55">
        Use your registered email and password to sign in.
      </p>

      <button
        type="button"
        disabled
        title="Google sign-in is not available yet"
        className={authForm.secondaryButton}
      >
        <FcGoogle className="text-xl opacity-50" />
        Sign in with Google (coming soon)
      </button>

      <div className="my-4 flex items-center gap-3">
        <span className={authForm.dividerLine} />
        <span className={authForm.dividerText}>or email</span>
        <span className={authForm.dividerLine} />
      </div>

      {error && <p className={authForm.error}>{error}</p>}

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className={authForm.label}>Email address</span>
          <span className={authForm.input}>
            <FiMail className={authForm.inputIcon} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="name@example.com"
              className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/35"
              required
            />
          </span>
        </label>

        <label className="block">
          <span className={authForm.label}>Password</span>
          <span className={authForm.input}>
            <FiLock className={authForm.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Your password"
              className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/35"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="text-black/50 transition hover:text-[#f97316]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </span>
        </label>
      </div>

      <button type="submit" className={authForm.submit}>
        Sign in
        <FiArrowRight />
      </button>
      <p className="mt-3 text-center text-sm text-black/60">
        <Link to="/forgot-password" className="font-semibold text-[#f97316] hover:text-black">
          Forgot password?
        </Link>
      </p>
    </form>
  )
}
