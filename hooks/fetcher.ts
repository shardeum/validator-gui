import { authService } from '../services/auth.service'
import { useGlobals } from '../utils/globals'

const { apiBase } = useGlobals()

// Helper function to show error toast messages
function showErrorToast(showToast: (msg: string) => void, status: number, input: RequestInfo | URL) {
  // Extract the last segment from the input URL
  const urlString = (input instanceof Request) ? input.url : (typeof input === 'string' ? input : input.href)
  const url = new URL(urlString);
  const lastSegment = url.pathname.split('/').filter(Boolean).pop() || 'resource'

  // Construct the base message, including the status if available
  const baseMessage = `Error${status ? ` (${status})` : ''}: An error occurred while fetching ${lastSegment}.`
  const reportLink = `Please report this issue to our support team. [<a href="https://github.com/Shardeum/shardeum-bug-reporting/issues" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Report Issue</a>]`
  
  showToast(`<span>${baseMessage} ${reportLink}<span>`)
}

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
      showErrorToast(showToast, res.status, input)
      return;
    } else if (!res.ok) {
      console.log(data.errorDetails);
      showErrorToast(showToast, res.status, input)
      throw new Error(data.errorMessage)
    }
    return data;
  }).catch((error) => {
    // Handle network errors or other errors that prevented the request from completing
    console.error('Fetch error:', error)
    showErrorToast(showToast, 0, input) 
  })
};
