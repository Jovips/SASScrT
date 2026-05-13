import { useAuthStore } from '@/store/authStore'

/** Retorna dados do usuário autenticado e helpers de role. */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)

  return {
    user,
    isAuthenticated,
    logout,
    isAdmin: user?.role === 'STORE_ADMIN' || user?.role === 'SUPER_ADMIN',
    isStaff: user?.role === 'STORE_STAFF',
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
  }
}
