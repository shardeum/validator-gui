import Router from 'next/router'
import { useGlobals } from '../utils/globals'

const tokenKey = 'shmguitk'

function useLogin(password: string): Promise<void> {
  const { apiBase } = useGlobals()
  return fetch(`${apiBase}/auth/login`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ password }),
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) {
      if (res.status === 403) {
        throw 'Invalid password!'
      }
      throw 'Error executing login'
    }

    localStorage.setItem(tokenKey, data.accessToken)
  })
}

function logout(): void {
  localStorage.removeItem(tokenKey)
  Router.push('/login')
}

export const authService = {
  get isLogged(): boolean {
    return !!localStorage.getItem(tokenKey)
  },
  get authToken(): string | null {
    return localStorage.getItem(tokenKey)
  },
  useLogin,
  logout,
}
