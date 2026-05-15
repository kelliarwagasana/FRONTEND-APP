import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/hooks/useAuth'
import { getAuthToken, setCurrentUser } from '../auth/authStorage'
import { fetchUsers, updateUser } from './usersApi'
import { uploadUserAvatar, deleteUserAvatar } from '../../lib/uploadApi'

export function useUsers(page = 1) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => fetchUsers(page, 50),
    enabled: user?.role === 'ADMIN',
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      userId,
      name,
      username,
      phone,
      avatarFile,
      removeAvatar,
    }: {
      userId: string
      name: string
      username: string
      phone: string
      avatarFile?: File | null
      removeAvatar?: boolean
    }) => {
      let updated = await updateUser(userId, { name, username, phone })

      if (removeAvatar) {
        await deleteUserAvatar(userId)
        updated = { ...updated, avatar: undefined, avatarPublicId: undefined }
      } else if (avatarFile) {
        updated = await uploadUserAvatar(userId, avatarFile)
      }

      return updated
    },
    onSuccess: (updated) => {
      if (user?.id === updated.id) {
        setCurrentUser(updated)
        const token = getAuthToken()
        if (token) {
          qc.setQueryData(['auth', 'me'], updated)
        }
      }
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useBecomeHost() {
  const qc = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (userId: string) => updateUser(userId, { role: 'HOST' }),
    onSuccess: (updated) => {
      if (user?.id === updated.id) {
        setCurrentUser(updated)
      }
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
