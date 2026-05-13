import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/services/api'

interface AuthUser {
  userId: string
  tenantId: string
  name: string
  email: string
  role: string
}

interface AuthStore {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  storeName: string
  subdomain: string
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        localStorage.setItem('access_token', data.accessToken)
        localStorage.setItem('tenant_id', data.tenantId)
        set({
          user: {
            userId: data.userId,
            tenantId: data.tenantId,
            name: data.name,
            email: data.email,
            role: data.role,
          },
          accessToken: data.accessToken,
          isAuthenticated: true,
        })
      },

      register: async (data: RegisterData) => {
        const { data: response } = await api.post('/auth/register', data)
        localStorage.setItem('access_token', response.accessToken)
        localStorage.setItem('tenant_id', response.tenantId)
        set({
          user: {
            userId: response.userId,
            tenantId: response.tenantId,
            name: response.name,
            email: response.email,
            role: response.role,
          },
          accessToken: response.accessToken,
          isAuthenticated: true,
        })
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('tenant_id')
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
    }),
    { name: 'auth-storage' }
  )
)