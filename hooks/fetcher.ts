import { authService } from '../services'

export const fetcher = (...args: any) => {
  // @ts-ignore
  return fetch(...args, {
    headers:{
      'Content-Type': 'application/json',
      "X-Api-Token": authService.authToken,
    }
  }).then(async res => {
    const data = await res.json()
    if (!res.ok) {
      console.log(data.errorDetails)
      throw data.errorMessage
    }
    return data
  })
}

