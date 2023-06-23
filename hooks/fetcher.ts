import { authService } from '../services/auth.service'

export const fetcher = <T>(input: RequestInfo | URL,
                           init: RequestInit,
                           showToast: (msg: string) => void): Promise<T> => {
  return fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Token': authService.authToken!,
    },
    ...(init ?? {}),
  }).then(async (res) => {
    const data = await res.json();
    if (res.status === 403) {
      authService.logout();
    } else if (res.status === 500) {
      showToast("Sorry, something went wrong. Please report this issue to our support team so we can investigate and resolve the problem.");
      return;
    } else if (!res.ok) {
      console.log(data.errorDetails);
      throw data.errorMessage;
    }
    return data;
  });
};
