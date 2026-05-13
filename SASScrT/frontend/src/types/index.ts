// ─── Auth ────────────────────────────────────────────────────
export interface AuthUser {
  userId: string
  tenantId: string
  name: string
  email: string
  role: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'STORE_STAFF'
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  userId: string
  tenantId: string
  name: string
  email: string
  role: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  storeName: string
  subdomain: string
}

// ─── Products ────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  comparePrice?: number
  stock: number
  imageUrl?: string
  sku?: string
  active: boolean
  featured: boolean
  createdAt: string
}

export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// ─── Theme ───────────────────────────────────────────────────
export interface Theme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  buttonRadius: string
  cardBorder: string
  logoUrl?: string
}

// ─── Blocks / Editor ─────────────────────────────────────────
export interface Block {
  id: string
  type: string
  position: number
  settings: Record<string, unknown>
}
