import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { FiArrowRight, FiBriefcase, FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiUser } from 'react-icons/fi'
import { getPostLoginPath } from '../authStorage'
import { validateRegisterFields } from '../authValidation'
import { useAuth } from '../hooks/useAuth'
import type { RegisterCredentials, RegisterRole } from '../types'
import { authForm } from '../authFormClasses'

const initialForm: RegisterCredentials = {
  name: '',
  email: '',
  username: '',
  phone: '',
  password: '',
  role: 'GUEST',
}

const authImage =
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState<RegisterCredentials>(initialForm)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const field = event.target.name as keyof RegisterCredentials
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleRoleChange = (role: RegisterRole) => {
    setForm((current) => ({ ...current, role }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const payload: RegisterCredentials = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      username: form.username.trim(),
      phone: form.phone.trim(),
    }

    const validationError = validateRegisterFields(payload)
    if (validationError) {
      setError(validationError)
      return
    }

    const result = await register(payload)

    if (!result.success) {
      setError(result.error ?? 'Registration failed. Please check your details and try again.')
      return
    }

    toast.success('Account created successfully. Welcome!')
    navigate(getPostLoginPath(result.user))
  }

  return (
    <main className="grid min-h-screen bg-white text-black lg:grid-cols-[0.9fr_1.1fr]">
      <div
        className="hidden border-r border-[#eadfdb] bg-black bg-cover bg-center text-white lg:block"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,.55)), url(${authImage})` }}
      >
        <div className="flex h-full flex-col justify-between p-10">
          <div>
            <Link to="/" className="inline-flex items-center text-4xl font-black tracking-tight">
              Air<span className="text-[#f97316]">Bnb</span>
            </Link>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f97316]">Your account</p>
            <h2 className="mt-4 max-w-2xl text-5xl font-black leading-tight tracking-tight">
              Start exploring better stays with a personal profile.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
              Create an account to save places, post reviews, update your profile, and manage every trip.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto bg-white px-4 py-6 sm:px-6 lg:min-h-screen lg:py-10">
        <div className="mx-auto flex w-full max-w-lg items-start lg:min-h-full lg:items-center">
          <form
            onSubmit={handleSubmit}
            className={authForm.card}
          >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#f97316]">Create account</p>
              <h1 className="mt-2 text-2xl font-bold text-black">Join AirBnb today</h1>
              <p className="mt-2 text-sm text-black/55">
                Full name, username, phone, email, and password (at least 8 characters). Choose guest or host.
              </p>

              <div className={authForm.roleGroup}>
                {[
                  { role: 'GUEST' as const, label: 'Sign up as guest', icon: FiUser },
                  { role: 'HOST' as const, label: 'Sign up as host', icon: FiBriefcase },
                ].map((option) => {
                  const Icon = option.icon
                  const isSelected = form.role === option.role

                  return (
                    <button
                      key={option.role}
                      type="button"
                      onClick={() => handleRoleChange(option.role)}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${
                        isSelected
                          ? 'bg-[#f97316] text-white'
                          : 'bg-transparent text-black/60 hover:bg-[#fff7ed] hover:text-black'
                      }`}
                    >
                      <Icon />
                      {option.label}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                disabled
                title="Google sign-in is not available yet"
                className={authForm.secondaryButton}
              >
                <FcGoogle className="text-xl opacity-50" />
                Continue with Google (coming soon)
              </button>

              <div className="my-4 flex items-center gap-3">
                <span className={authForm.dividerLine} />
                <span className={authForm.dividerText}>or register</span>
                <span className={authForm.dividerLine} />
              </div>

              {error && <p className={authForm.error}>{error}</p>}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className={authForm.label}>Full name</span>
                  <span className={authForm.input}>
                    <FiUser className={authForm.inputIcon} />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="Your full name"
                      className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                      required
                    />
                  </span>
                </label>

                <label className="block">
                  <span className={authForm.label}>Username</span>
                  <span className={authForm.input}>
                    <FiUser className={authForm.inputIcon} />
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      autoComplete="username"
                      placeholder="username"
                      className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                      required
                    />
                  </span>
                </label>

                <label className="block">
                  <span className={authForm.label}>Phone</span>
                  <span className={authForm.input}>
                    <FiPhone className={authForm.inputIcon} />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      placeholder="+1 555 0100"
                      className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                      required
                    />
                  </span>
                </label>

                <label className="block sm:col-span-2">
                  <span className={authForm.label}>Email address</span>
                  <span className={authForm.input}>
                    <FiMail className={authForm.inputIcon} />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="name@example.com"
                      className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                      required
                    />
                  </span>
                </label>

                <label className="block sm:col-span-2">
                  <span className={authForm.label}>Password</span>
                  <span className={authForm.input}>
                    <FiLock className={authForm.inputIcon} />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="text-slate-400 transition hover:text-[#f97316]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className={authForm.submit}
              >
                Create account
                <FiArrowRight />
              </button>

              <p className={`${authForm.footer} mt-0 border-t-0 pt-3`}>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#f97316] hover:text-[#f97316]">
                  Login
                </Link>
              </p>
          </form>
        </div>
      </div>
    </main>
  )
}
