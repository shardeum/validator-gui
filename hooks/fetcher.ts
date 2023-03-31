import { authService } from '../services/auth.service'

export const fetcher = <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  return fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Token': authService.authToken!,
    },
    ...(init ?? {}),
  }).then(async (res) => {
    const data = await res.json()
    if (res.status === 403) {
      authService.logout()
    } else if (!res.ok) {
      console.log(data.errorDetails)
      throw data.errorMessage
    }
    return data
  })
}
