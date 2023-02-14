import { authService } from '../services/auth.service';

export const fetcher = (input: RequestInfo | URL, init?: RequestInit) => {
  return fetch(input, {
    headers:{
      'Content-Type': 'application/json',
      "X-Api-Token": authService.authToken!,
    },
    ...(init ?? {})
  }).then(async res => {
    const data = await res.json()
    if (!res.ok) {
      console.log(data.errorDetails)
      throw data.errorMessage
    }
    return data
  })
}

