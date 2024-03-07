import { authService } from '../services/auth.service'
import { useGlobals } from '../utils/globals'

const { apiBase } = useGlobals()

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Helper function to show error toast messages
function showErrorToast(showToast: (msg: string) => void, status: number, input: RequestInfo | URL) {
  // Extract the last segment from the input URL
  const urlString = (input instanceof Request) ? input.url : (typeof input === 'string' ? input : input.href)
  const url = new URL(urlString);
  const lastSegment = url.pathname.split('/').filter(Boolean).pop() || 'resource'

  // Construct the base message, including the status if it is not undefined or null
  const baseMessage = `Error${status !== undefined && status !== null ? ` (${status})` : ''}: An error occurred while retrieving ${lastSegment}.`
  const reportLink = `Please report this issue to our support team if the problem persists. [<a href="https://github.com/Shardeum/shardeum-bug-reporting/issues" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Report Issue</a>]`
  
  showToast(`<span>${baseMessage} ${reportLink}</span>`)
}

export const fetcher = async <T>(input: RequestInfo | URL,
                                 init: RequestInit,
                                 showToast: (msg: string) => void,
                                 retries: number = 3, // Implicit retry logic
                                 retryDelay: number = 1000 // Implicit retry delay
): Promise<T> => {
  let attempt = 0
  while (attempt < retries) {
    try {
      const res = await fetch(input, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...(init ?? {}),
      });

      const data = await res.json()

      if (res.status === 403) {
        authService.logout(apiBase)
        throw new Error('Unauthorized')
      }

      if (res.status === 500) {
        if (isDev()) {
          console.error('Server Error (500) encountered for request:', input, 'with init:', init);
        }
        showErrorToast(showToast, res.status, input)
        throw new Error('Server Error')
      }

      if (!res.ok) {
        console.log(data.errorDetails)
        showErrorToast(showToast, res.status, input)
        throw new Error(data.errorMessage)
      }

      return data; // Successful fetch
    } catch (error) {
      if (attempt === retries - 1) {
        showErrorToast(showToast, 0, input) // Show error toast on final attempt
        throw error; // Rethrow error after final attempt
      }
      await delay(retryDelay); // Wait before retrying
      attempt++
    }
  }
  throw new Error('This should never be reached, but is here as a safeguard.')
}