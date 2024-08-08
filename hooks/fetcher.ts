import { authService } from '../services/auth.service'
import { useGlobals } from '../utils/globals'
import { isDev } from '../utils/is-dev'

const { apiBase } = useGlobals()

function showErrorToast(showToast: (msg: string) => void, status: number, resource: string): void {
  const message = `Error (${status}): Failed to fetch ${resource}. Please try again or contact support.`
  showToast(`<span>${message}</span>`)
}

export async function fetcher<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  showToast: (msg: string) => void,
  retries: number = 2
): Promise<T> {
  const resource = new URL(input.toString()).pathname.split('/').pop() || 'resource'

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(input, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...init,
      })

      if (res.status === 403) {
        await authService.logout(apiBase)
        showErrorToast(showToast, res.status, resource)
        throw new Error('Unauthorized')
      }

      if (!res.ok) {
        showErrorToast(showToast, res.status, resource)
        if (attempt === retries - 1) throw new Error(`HTTP error! status: ${res.status}`)
      } else {
        return await res.json()
      }
    } catch (error) {
      if (isDev()) {
        console.error('Fetch error:', { input, init, error })
      }

      if (attempt === retries - 1) {
        showErrorToast(showToast, 0, resource)
        throw error
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  throw new Error('Fetch failed after all retries')
}