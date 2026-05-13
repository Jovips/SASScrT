import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { useAuthStore } from '@/store/authStore'
import '@/components/blocks/index' // registra todos os blocos

// Pages
import LoginPage from '@/pages/storefront/LoginPage'
import RegisterPage from '@/pages/storefront/RegisterPage'
import HomePage from '@/pages/storefront/HomePage'
import CmsEditor from '@/pages/admin/Editor'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Storefront público */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin - rotas protegidas */}
            <Route path="/admin/editor" element={
              <PrivateRoute><CmsEditor /></PrivateRoute>
            } />
            <Route path="/admin/editor/:slug" element={
              <PrivateRoute><CmsEditor /></PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}