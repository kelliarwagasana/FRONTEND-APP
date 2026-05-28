import { FiChevronDown, FiPower } from 'react-icons/fi'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import UserAvatar from '../components/UserAvatar'
import { useUsers } from '../../users/hooks'
import { useBanUser } from '../../admin/hooks'
import type { Role, User } from '../../auth/types'

const PREVIEW_COUNT = 5

type RoleFilter = 'all' | Role

const ROLE_FILTER_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'GUEST', label: 'Guests' },
  { value: 'HOST', label: 'Hosts' },
  { value: 'ADMIN', label: 'Admins' },
]

export default function UsersPage() {
  const usersQuery = useUsers()
  const banUser = useBanUser()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')

  const allUsers = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data])

  const filteredUsers = useMemo(() => {
    if (roleFilter === 'all') return allUsers
    return allUsers.filter((u) => u.role === roleFilter)
  }, [allUsers, roleFilter])

  const visibleUsers = useMemo(
    () => (showAll ? filteredUsers : filteredUsers.slice(0, PREVIEW_COUNT)),
    [showAll, filteredUsers],
  )

  const hasMore = filteredUsers.length > PREVIEW_COUNT

  const handleRoleFilterChange = (value: RoleFilter) => {
    setRoleFilter(value)
    setShowAll(false)
    setConfirmId(null)
  }

  const handleBan = (user: User) => {
    banUser.mutate(user.id, {
      onSuccess: () => {
        toast.success(`${user.name} has been banned`)
        setConfirmId(null)
      },
      onError: (e: Error) => toast.error(e.message),
    })
  }

  const activeFilterLabel =
    ROLE_FILTER_OPTIONS.find((o) => o.value === roleFilter)?.label ?? 'All'

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#eadfdb] bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-[#292626]">Users</h1>
        <p className="mt-1 text-sm text-[#857d7a]">
          Manage platform accounts. Filter by role or deactivate users when needed.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#eadfdb] bg-white shadow-sm">
        <UsersPageHeader
          isLoading={usersQuery.isPending}
          total={filteredUsers.length}
          showing={visibleUsers.length}
          showAll={showAll}
          roleFilter={roleFilter}
          filterLabel={activeFilterLabel}
          onRoleFilterChange={handleRoleFilterChange}
        />
        {usersQuery.isPending ? (
          <p className="p-6 text-sm text-[#857d7a]">Loading users…</p>
        ) : filteredUsers.length === 0 ? (
          <p className="p-6 text-sm text-[#857d7a]">
            {roleFilter === 'all'
              ? 'No users found.'
              : `No ${activeFilterLabel.toLowerCase()} found.`}
          </p>
        ) : (
          <>
            <UsersTable
              users={visibleUsers}
              confirmId={confirmId}
              onConfirm={setConfirmId}
              onBan={handleBan}
              isBanning={banUser.isPending}
            />
            {hasMore && (
              <div className="border-t border-[#eadfdb] px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="w-full rounded-xl border border-[#eadfdb] bg-[#fff7ed] px-4 py-3 text-sm font-semibold text-[#f97316] transition hover:border-[#f97316] hover:bg-white sm:w-auto"
                >
                  {showAll
                    ? 'Show fewer users'
                    : `See all ${activeFilterLabel.toLowerCase()} (${filteredUsers.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

function UsersPageHeader({
  isLoading,
  total,
  showing,
  showAll,
  roleFilter,
  filterLabel,
  onRoleFilterChange,
}: {
  isLoading: boolean
  total: number
  showing: number
  showAll: boolean
  roleFilter: RoleFilter
  filterLabel: string
  onRoleFilterChange: (value: RoleFilter) => void
}) {
  let subtitle = 'Loading…'
  if (!isLoading) {
    if (total === 0) subtitle = `No ${filterLabel.toLowerCase()} to display`
    else if (showAll || total <= PREVIEW_COUNT) {
      subtitle =
        roleFilter === 'all'
          ? `${total} registered user${total === 1 ? '' : 's'}`
          : `${total} ${filterLabel.toLowerCase()}`
    } else {
      subtitle = `Showing ${showing} of ${total} ${filterLabel.toLowerCase()}`
    }
  }

  return (
    <div className="flex flex-col gap-4 border-b border-[#f0e5e1] px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
      <div className="min-w-0">
        <h2 className="text-xl font-bold text-[#292626]">All users</h2>
        <p className="mt-1 text-sm text-[#857d7a]">{subtitle}</p>
      </div>

      <div className="flex shrink-0 flex-col gap-1.5 sm:items-end">
        <label htmlFor="users-role-filter" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#857d7a]">
          Filter by role
        </label>
        <div className="relative">
          <select
            id="users-role-filter"
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value as RoleFilter)}
            className="appearance-none rounded-xl border border-[#eadfdb] bg-white py-2.5 pr-10 pl-4 text-sm font-semibold text-[#292626] shadow-sm transition hover:border-[#f97316]/40 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20"
          >
            {ROLE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FiChevronDown
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#857d7a]"
            aria-hidden
          />
        </div>
      </div>
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
    <div className="overflow-hidden bg-[#faf8f7] px-3 py-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left text-sm whitespace-nowrap">
          <thead className="text-xs uppercase tracking-[0.14em] text-white">
            <tr className="bg-[#292626] shadow-sm">
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
                      <p className="max-w-44 truncate text-xs text-[#857d7a]">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#857d7a]">{user.email}</td>
                <td className="px-5 py-4">
                  <RoleBadge role={user.role} />
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
                <td className="px-5 py-4 text-[#857d7a]">{user.phone}</td>
                <td className="px-5 py-4 text-[#857d7a]">
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
                          className="rounded-lg border border-[#eadfdb] px-3 py-1.5 text-xs font-semibold"
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

function RoleBadge({ role }: { role: Role }) {
  const styles: Record<Role, string> = {
    GUEST: 'border-slate-200 bg-slate-50 text-slate-700',
    HOST: 'border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]',
    ADMIN: 'border-[#eadfdb] bg-[#292626] text-white',
  }

  const labels: Record<Role, string> = {
    GUEST: 'Guest',
    HOST: 'Host',
    ADMIN: 'Admin',
  }

  return (
    <span
      className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${styles[role]}`}
    >
      {labels[role]}
    </span>
  )
}
