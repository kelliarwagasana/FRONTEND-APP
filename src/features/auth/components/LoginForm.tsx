import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi'
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
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden border-2 border-black bg-white p-5 shadow-md"
    >
      <div className="absolute right-[-4rem] top-[-4rem] h-36 w-36 border-2 border-black bg-[#fff7ed]" />
      <div className="relative">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#f97316]">Welcome back</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-black">Sign in to AirBnb</h1>
        <p className="mt-2 text-sm font-semibold leading-5 text-black/55">
          Use your registered email and password. Both fields are required to sign in.
        </p>

        <button
          type="button"
          disabled
          title="Google sign-in is not available yet"
          className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-3 border-2 border-black/30 bg-slate-100 px-4 py-2.5 text-sm font-black text-black/40"
        >
          <FcGoogle className="text-xl opacity-50" />
          Sign in with Google (coming soon)
        </button>

        <OrDivider />

        {error && (
          <p className="border-2 border-[#f97316] bg-[#fff7ed] px-4 py-3 text-sm font-bold text-black">
            {error}
          </p>
        )}

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm font-black text-black">Email address</span>
            <span className="mt-1.5 flex items-center gap-3 border-2 border-black bg-white px-4 py-2.5 focus-within:border-[#f97316]">
              <FiMail className="text-[#f97316]" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="name@example.com"
                className="w-full bg-transparent text-sm font-bold text-black outline-none placeholder:text-black/35"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-black text-black">Password</span>
            <span className="mt-1.5 flex items-center gap-3 border-2 border-black bg-white px-4 py-2.5 focus-within:border-[#f97316]">
              <FiLock className="text-[#f97316]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Your password"
                className="w-full bg-transparent text-sm font-bold text-black outline-none placeholder:text-black/35"
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

        <button
          type="submit"
          className="mt-4 flex w-full items-center justify-center gap-2 border-2 border-black bg-[#f97316] px-5 py-2.5 text-sm font-black text-white transition hover:bg-black"
        >
          Sign in
          <FiArrowRight />
        </button>
        <p className="mt-3 text-center text-sm text-black/60">
          <Link to="/forgot-password" className="font-bold text-[#f97316] hover:text-black">
            Forgot password?
          </Link>
        </p>
      </div>
    </form>
  )
}

function OrDivider() {
  return (
    <div className="my-4 flex items-center gap-3">
      <span className="h-0.5 flex-1 bg-black" />
      <span className="text-xs font-black uppercase tracking-[0.2em] text-black/45">or email</span>
      <span className="h-0.5 flex-1 bg-black" />
    </div>
  )
}
