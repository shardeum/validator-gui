import { authService } from '../services/auth.service'
import { useGlobals } from '../utils/globals'

const { apiBase } = useGlobals()

export const fetcher = <T>(input: RequestInfo | URL,
  init: RequestInit,
  showErrorMessage: (msg: string) => void): Promise<T> => {
  return fetch(input, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send cookies
    ...(init ?? {}),
  }).then(async (res) => {
    const data = await res.json();
    if (res.status === 403) {
      authService.logout(apiBase);
    } else if (res.status === 500) {
      showErrorMessage('Sorry, something went wrong. Please report this issue to our support team so we can investigate and resolve the problem.');
      return;
    } else if (!res.ok) {
      console.log(data.errorDetails);
      throw data.errorMessage;
    }
    return data;
  });
};
