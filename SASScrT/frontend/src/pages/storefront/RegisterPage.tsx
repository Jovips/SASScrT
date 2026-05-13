import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', storeName: '', subdomain: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const register = useAuthStore((s) => s.register)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'storeName' ? { subdomain: value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/admin/editor')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Erro ao criar loja. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--color-primary)' }}>
          Crie sua loja grátis
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">Leva menos de 2 minutos</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3">{error}</div>
          )}
          {[
            { name: 'name', label: 'Seu nome', type: 'text' },
            { name: 'email', label: 'E-mail', type: 'email' },
            { name: 'password', label: 'Senha (mín. 8 caracteres)', type: 'password' },
            { name: 'storeName', label: 'Nome da loja', type: 'text' },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                name={name}
                type={type}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subdomínio</label>
            <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <input
                name="subdomain"
                type="text"
                value={form.subdomain}
                onChange={handleChange}
                className="flex-1 px-3 py-2 text-sm outline-none"
                required
              />
              <span className="px-3 py-2 bg-gray-50 text-gray-400 text-sm border-l">.minhaplataforma.com</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-white text-sm font-semibold rounded-lg transition hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--color-primary)', borderRadius: 'var(--button-radius)' }}
          >
            {loading ? 'Criando loja...' : 'Criar loja grátis'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}