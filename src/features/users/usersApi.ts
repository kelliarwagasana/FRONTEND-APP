import { api } from '../../lib/api'
import type { User } from '../auth/types'

export interface PaginatedUsers {
  data: User[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export async function fetchUsers(page = 1, limit = 50): Promise<PaginatedUsers> {
  return api.get<PaginatedUsers>(`/api/v1/users?page=${page}&limit=${limit}`)
}

export async function fetchUserById(id: string): Promise<User> {
  return api.get<User>(`/api/v1/users/${id}`)
}

export async function updateUser(
  id: string,
  body: Partial<Pick<User, 'name' | 'email' | 'username' | 'phone' | 'role' | 'avatar'>>,
): Promise<User> {
  return api.put<User>(`/api/v1/users/${id}`, body)
}
