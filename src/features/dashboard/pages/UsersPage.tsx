import { FiPower } from 'react-icons/fi'
import { useState } from 'react'
import toast from 'react-hot-toast'
import UserAvatar from '../components/UserAvatar'
import { useUsers } from '../../users/hooks'
import { useBanUser } from '../../admin/hooks'
import type { User } from '../../auth/types'

export default function UsersPage() {
  const usersQuery = useUsers()
  const banUser = useBanUser()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const users = usersQuery.data?.data ?? []

  const handleBan = (user: User) => {
    banUser.mutate(user.id, {
      onSuccess: () => {
        toast.success(`${user.name} has been banned`)
        setConfirmId(null)
      },
      onError: (e: Error) => toast.error(e.message),
    })
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-white shadow-sm">
      <UsersPageHeader isLoading={usersQuery.isPending} count={users.length} />
      {usersQuery.isPending ? (
        <p className="p-6 text-sm text-slate-500">Loading users…</p>
      ) : (
        <UsersTable
          users={users}
          confirmId={confirmId}
          onConfirm={setConfirmId}
          onBan={handleBan}
          isBanning={banUser.isPending}
        />
      )}
    </section>
  )
}

function UsersPageHeader({ isLoading, count }: { isLoading: boolean; count: number }) {
  return (
    <div className="border-b border-[#f0e5e1] px-6 py-5">
      <h2 className="text-xl font-bold text-[#292626]">Users list</h2>
      <p className="mt-1 text-sm text-[#857d7a]">
        {isLoading ? 'Loading…' : `${count} registered users`}
      </p>
    </div>
  )
}

function UsersTable({
  users,
  confirmId,
  onConfirm,
  onBan,
  isBanning,
}: {
  users: User[]
  confirmId: string | null
  onConfirm: (id: string | null) => void
  onBan: (user: User) => void
  isBanning: boolean
}) {
  return (
    <div className="overflow-hidden bg-[#f8fafc] px-3 py-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left text-sm whitespace-nowrap">
          <thead className="text-xs uppercase tracking-[0.16em] text-white">
            <tr className="bg-slate-950 shadow-sm">
              <th className="rounded-l-xl px-5 py-4 font-semibold">User</th>
              <th className="px-5 py-4 font-semibold">Email</th>
              <th className="px-5 py-4 font-semibold">Role</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Phone</th>
              <th className="px-5 py-4 font-semibold">Joined</th>
              <th className="rounded-r-xl px-5 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`shadow-sm transition hover:bg-[#fff7ed] ${
                  index % 2 === 0 ? 'bg-white' : 'bg-[#fff8f5]'
                }`}
              >
                <td className="rounded-l-xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="md" />
                    <div className="min-w-0">
                      <p className="max-w-44 truncate font-semibold text-[#292626]">{user.name}</p>
                      <p className="max-w-44 truncate text-xs text-slate-500">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600">{user.email}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${
                      user.isActive === false
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {user.isActive === false ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600">{user.phone}</td>
                <td className="px-5 py-4 text-slate-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="rounded-r-xl px-5 py-4 text-right">
                  {user.role !== 'ADMIN' && user.isActive !== false && (
                    confirmId === user.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={isBanning}
                          onClick={() => onBan(user)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Confirm ban
                        </button>
                        <button
                          type="button"
                          onClick={() => onConfirm(null)}
                          className="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onConfirm(user.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                      >
                        <FiPower />
                        Ban
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
