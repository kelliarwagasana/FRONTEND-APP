import type { User } from './types'

const AUTH_CURRENT_USER_KEY = 'liston.auth.currentUser'
export const AUTH_TOKEN_KEY = 'liston.auth.token'
export const AUTH_CHANGE_EVENT = 'liston-auth-change'

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage
}

function announceAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function getAuthToken(): string | null {
  return getStorage()?.getItem(AUTH_TOKEN_KEY) ?? null
}

export function setAuthToken(token: string | null) {
  if (!token) {
    getStorage()?.removeItem(AUTH_TOKEN_KEY)
    return
  }
  getStorage()?.setItem(AUTH_TOKEN_KEY, token)
}

export function setCurrentUser(user: User) {
  getStorage()?.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(user))
  announceAuthChange()
}

export function persistSession(user: User, token: string) {
  setAuthToken(token)
  setCurrentUser(user)
}

export function clearAuthSession() {
  getStorage()?.removeItem(AUTH_TOKEN_KEY)
  getStorage()?.removeItem(AUTH_CURRENT_USER_KEY)
  announceAuthChange()
}

export function getCurrentUser(): User | null {
  const savedUser = getStorage()?.getItem(AUTH_CURRENT_USER_KEY)
  if (!savedUser) {
    return null
  }
  try {
    return JSON.parse(savedUser) as User
  } catch {
    getStorage()?.removeItem(AUTH_CURRENT_USER_KEY)
    return null
  }
}

export function getPostLoginPath(user: User) {
  return user.role === 'ADMIN' || user.role === 'HOST' ? '/dashboard' : '/listings'
}

export function logout() {
  clearAuthSession()
}

export function subscribeToAuthChange(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUTH_CURRENT_USER_KEY || event.key === AUTH_TOKEN_KEY) {
      callback()
    }
  }

  window.addEventListener(AUTH_CHANGE_EVENT, callback)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback)
    window.removeEventListener('storage', handleStorage)
  }
}
