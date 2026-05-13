import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthService } from '../../../../Backend/auth/'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthService((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/editor')
    } catch {
      setError('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
      
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--color-primary)' }}>
            Entrar na sua loja
          </h1>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-white text-sm font-semibold rounded-lg transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--color-primary)', borderRadius: 'var(--button-radius)' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Não tem conta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Criar loja grátis
            </Link>
          </p>
        </div>
      </div>
  )
}