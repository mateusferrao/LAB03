/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { UsuarioAuth } from '../types'
import api from '../services/api'

interface AuthContextValue {
  user: UsuarioAuth | null
  token: string | null
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioAuth | null>(() => {
    const savedUser = localStorage.getItem('cdm_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cdm_token'))
  const isLoading = false

  useEffect(() => {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }, [token])

  async function login(email: string, senha: string) {
    const { data } = await api.post('/auth/login', { email, senha })
    const { token: t, usuario } = data
    setToken(t)
    setUser(usuario)
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
    localStorage.setItem('cdm_token', t)
    localStorage.setItem('cdm_user', JSON.stringify(usuario))
  }

  async function refreshMe() {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data)
      localStorage.setItem('cdm_user', JSON.stringify(data))
    } catch {
      // silently ignore
    }
  }

  function logout() {
    setUser(null)
    setToken(null)
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('cdm_token')
    localStorage.removeItem('cdm_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshMe, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
