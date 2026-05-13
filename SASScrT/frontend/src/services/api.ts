import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Injeta o token JWT e o tenant-id em cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Tenant pode vir do localStorage (admin) ou do subdomínio (storefront)
  const tenantId = localStorage.getItem('tenant_id')
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId
  }

  return config
})

// Se o token expirar, redireciona para login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('tenant_id')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api