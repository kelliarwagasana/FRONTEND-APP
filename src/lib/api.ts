import { clearAuthSession, getAuthToken } from '../features/auth/authStorage'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export interface ApiRequestOptions extends RequestInit {
  skipAuthRedirect?: boolean
}

function buildUrl(path: string) {
  const base = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

async function parseErrorResponse(response: Response): Promise<string> {
  const text = await response.text()
  if (!text) return response.statusText || 'Request failed'

  try {
    const parsed = JSON.parse(text) as { message?: string; error?: string }
    return parsed.message || parsed.error || text
  } catch {
    return text
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { skipAuthRedirect, headers: initHeaders, ...rest } = options
  const headers = new Headers(initHeaders)

  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (rest.body && !(rest.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers,
  })

  if (response.status === 401 && !skipAuthRedirect) {
    clearAuthSession()
    if (!window.location.pathname.startsWith('/login')) {
      window.location.assign('/login')
    }
  }

  if (!response.ok) {
    const message = await parseErrorResponse(response)
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export const api = {
  get<T>(path: string, options?: ApiRequestOptions) {
    return apiRequest<T>(path, { ...options, method: 'GET' })
  },

  post<T>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return apiRequest<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  put<T>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return apiRequest<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  patch<T>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return apiRequest<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(path: string, options?: ApiRequestOptions) {
    return apiRequest<T>(path, { ...options, method: 'DELETE' })
  },
}