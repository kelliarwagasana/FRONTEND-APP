import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowRight } from 'react-icons/fi'
import LoginForm from '../components/LoginForm'
import { getPostLoginPath } from '../authStorage'
import { validateLoginFields } from '../authValidation'
import { useAuth } from '../hooks/useAuth'
import type { LoginCredentials } from '../types'
import ThemeToggle from '../../../shared/components/ThemeToggle'
import { uptownHouseImage } from '../../../shared/brandImages'
import { initials } from '../../dashboard/utils/dashboardUtils'
import { authForm } from '../authFormClasses'

const authImage = uptownHouseImage

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [error, setError] = useState('')

  const submitLogin = async (credentials: LoginCredentials) => {
    setError('')

    const normalized = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    }

    const validationError = validateLoginFields(normalized)
    if (validationError) {
      setError(validationError)
      return
    }

    const result = await login(normalized)
    if (!result.success) {
      setError(result.error ?? 'Login failed. Check your email and password and try again.')
      return
    }

    toast.success('Signed in successfully.')
    navigate(getPostLoginPath(result.user))
  }

  return (
    <main className="grid min-h-screen bg-white text-black lg:grid-cols-[0.9fr_1.1fr]">
      <div
        className="hidden  bg-black bg-cover bg-center text-white lg:block"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,.55)), url(${authImage})` }}
      >
        <div className="flex h-full flex-col justify-between p-10">
          <div>
            <Link to="/" className="inline-flex items-center text-4xl font-black tracking-tight">
              Air<span className="text-[#f97316]">Bnb</span>
            </Link>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f97316]">Secure access</p>
            <h2 className="mt-4 max-w-2xl text-5xl font-black leading-tight tracking-tight">
              Book, host, and manage stays from one account.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
              Sign in to continue your trips, saved places, bookings, profile, and hosting dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto bg-white px-4 py-6 sm:px-6 lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:py-10">
        <div className="fixed right-5 top-5 z-20">
          <ThemeToggle />
        </div>
        <div className="mx-auto w-full max-w-md">
          {user ? (
            <div className={`${authForm.signedInCard} flex flex-col items-center text-center`}>
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-2xl font-black text-white">
                {initials(user.name)}
              </span>
              <p className="mt-5 text-sm font-black uppercase tracking-[0.25em] text-[#f97316]">Signed in</p>
              <h1 className="mt-3 text-3xl font-black text-black">Welcome, {user.name}</h1>
              <p className="mt-3 text-sm font-semibold leading-6 text-black/60">
                Your account is active and ready to browse stays.
              </p>
              <Link
                to={getPostLoginPath(user)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#f97316] bg-[#f97316] px-5 py-3 text-sm font-black text-white transition hover:border-black hover:bg-black"
              >
                Continue
                <FiArrowRight />
              </Link>
            </div>
          ) : (
            <>
              <LoginForm error={error} onSubmit={submitLogin} />
              <p className={authForm.footer}>
                New here?{' '}
                <Link to="/register" className="font-black text-[#f97316] hover:text-black">
                  Create an account
                </Link>
              </p>
            </>
          )}
          </div>
      </div>
    </main>
  )
}

