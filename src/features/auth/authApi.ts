import { api, ApiError } from '../../lib/api'
import { persistSession } from './authStorage'
import type { AuthResult, LoginCredentials, RegisterCredentials, User } from './types'

export async function loginWithApi(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const { user, token } = await api.post<{ user: User; token: string }>(
      '/api/v1/auth/login',
      credentials,
      { skipAuthRedirect: true },
    )
    persistSession(user, token)
    return { success: true, user }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Network error. Is the API server running?' }
  }
}

export async function registerWithApi(credentials: RegisterCredentials): Promise<AuthResult> {
  try {
    const { user, token } = await api.post<{ user: User; token: string }>(
      '/api/v1/auth/register',
      credentials,
      { skipAuthRedirect: true },
    )
    persistSession(user, token)
    return { success: true, user }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Network error. Is the API server running?' }
  }
}

export async function forgotPasswordWithApi(
  email: string,
): Promise<{ success: boolean; message: string; info?: string }> {
  try {
    const res = await api.post<{ message: string; info?: string }>(
      '/api/v1/auth/forgot-password',
      { email },
      { skipAuthRedirect: true },
    )
    return { success: true, message: res.message, info: res.info }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message }
    }
    return { success: false, message: 'Network error. Is the API server running?' }
  }
}

export async function resetPasswordWithApi(token: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.post<{ message: string }>(
      `/api/v1/auth/reset-password/${token}`,
      { password },
      { skipAuthRedirect: true },
    )
    return { success: true, message: res.message }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message }
    }
    return { success: false, message: 'Network error. Is the API server running?' }
  }
}

export async function changePasswordWithApi(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.post<{ message: string }>('/api/v1/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return { success: true, message: res.message }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message }
    }
    return { success: false, message: 'Network error. Is the API server running?' }
  }
}
