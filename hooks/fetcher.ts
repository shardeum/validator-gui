import { authService } from '../services/auth.service'
import { useGlobals } from '../utils/globals'

const { apiBase } = useGlobals()

// export class CustomError extends Error {
//   contextDescription?: string;

//   constructor(message: string, contextDescription?: string) {
//     super(message);
//     this.contextDescription = contextDescription;
//     this.name = "CustomError";
//   }
// }

export const fetcher = <T>(input: RequestInfo | URL,
                           init: RequestInit,
                           showToast: (msg: string) => void): Promise<T> => {
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

      // Extract the last segment from the input URL
      const urlString = (input instanceof Request) ? input.url : (typeof input === 'string' ? input : input.href);
      const url = new URL(urlString);
      const lastSegment = url.pathname.split('/').filter(Boolean).pop() || 'resource';

      // Construct the base message, including the status if available
      const baseMessage = `Error${res.status ? ` (${res.status})` : ''}: An error occurred while fetching ${lastSegment}.`;
      const reportLink = `Please report this issue to our support team. [<a href="https://github.com/Shardeum/shardeum-bug-reporting/issues" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Report Issue</a>]`;
      
      showToast(`<span>${baseMessage} ${reportLink}<span>`);
      return;
    } else if (!res.ok) {
      console.log(data.errorDetails);
      throw data.errorMessage;
      // // Throw an error with structured data including the status and errorMessage
      // throw new CustomError(JSON.stringify({
      //   status: res.status,
      //   message: data.errorMessage,
      // }), contextDescription);
    }
    return data;
  });
};
