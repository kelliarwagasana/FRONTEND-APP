import type { LoginCredentials, RegisterCredentials } from './types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginFields(credentials: LoginCredentials): string | null {
  const email = credentials.email.trim().toLowerCase()
  const password = credentials.password

  if (!email) {
    return 'Email is required. Enter the email you used to register.'
  }
  if (!EMAIL_RE.test(email)) {
    return 'Please enter a valid email address (for example, name@example.com).'
  }
  if (!password) {
    return 'Password is required. Enter your account password.'
  }
  return null
}

export function validateRegisterFields(form: RegisterCredentials): string | null {
  const name = form.name.trim()
  const email = form.email.trim()
  const username = form.username.trim()
  const phone = form.phone.trim()
  const password = form.password

  if (!name) {
    return 'Full name is required.'
  }
  if (!username) {
    return 'Username is required. Choose a unique username.'
  }
  if (!phone) {
    return 'Phone number is required.'
  }
  if (!email) {
    return 'Email is required.'
  }
  if (!EMAIL_RE.test(email)) {
    return 'Please enter a valid email address.'
  }
  if (!password) {
    return 'Password is required.'
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters (letters, numbers, or symbols).'
  }
  return null
}
