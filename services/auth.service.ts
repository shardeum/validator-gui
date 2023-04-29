import Router from 'next/router'
import { useGlobals } from '../utils/globals'
import { hashSha256 } from '../utils/sha256-hash';

const tokenKey = 'shmguitk'

async function useLogin(password: string): Promise<void> {
  const { apiBase } = useGlobals()
  const sha256digest = await hashSha256(password)
  return fetch(`${apiBase}/auth/login`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ password: sha256digest }),
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Invalid password!')
      }
      throw new Error('Error executing login')
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
