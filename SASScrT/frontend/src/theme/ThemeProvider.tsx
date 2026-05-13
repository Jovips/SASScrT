import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import api from '@/services/api'

interface Theme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  buttonRadius: string
  cardBorder: string
  logoUrl?: string
}

const defaultTheme: Theme = {
  primaryColor: '#0f172a',
  secondaryColor: '#22c55e',
  accentColor: '#3b82f6',
  fontFamily: 'Inter',
  buttonRadius: '8px',
  cardBorder: '1px solid #e2e8f0',
}

interface ThemeContextType {
  theme: Theme
  updateTheme: (theme: Partial<Theme>) => Promise<void>
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateTheme: async () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    api.get('/themes/current')
      .then(({ data }) => setTheme(data))
      .catch(() => {}) // usa o tema padrão em caso de erro
  }, [])

  // Aplica as variáveis CSS no elemento :root sempre que o tema mudar
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.primaryColor)
    root.style.setProperty('--color-secondary', theme.secondaryColor)
    root.style.setProperty('--color-accent', theme.accentColor)
    root.style.setProperty('--font-family', theme.fontFamily)
    root.style.setProperty('--button-radius', theme.buttonRadius)
    document.body.style.fontFamily = theme.fontFamily + ', sans-serif'
  }, [theme])

  const updateTheme = async (updates: Partial<Theme>) => {
    const { data } = await api.put('/themes', updates)
    setTheme(data)
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)