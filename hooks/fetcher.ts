import { authService } from '../services/auth.service'
import { useGlobals } from '../utils/globals'
import { isDev } from '../utils/is-dev'

const { apiBase } = useGlobals()

export const fetcher = <T>(input: RequestInfo | URL,
                           init: RequestInit,
                           showToast: (msg: string) => void,
                           contextDescription: string = 'fetching data'
): Promise<T> => {
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
      // Environment check to ensure detailed logging is done only in development
      if (isDev()) {
        console.error('Server Error (500) encountered for request:', input, 'with init:', init);
      }

      showToast(`<span>Error ${res.status}: An unexpected error occurred while ${contextDescription}. Detailed info for debugging: request: ${input}, with init: ${JSON.stringify(init)}. Please report this issue to our support team to investigate and resolve the problem. [<a href="https://github.com/Shardeum/shardeum-bug-reporting/issues" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Report Issue</a>]</span>`);
      return;
    } else if (!res.ok) {
      console.log(data.errorDetails);
      throw data.errorMessage;
    }
    return data;
  });
};
