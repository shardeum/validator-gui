import { authService } from '../services/auth.service'
import { useGlobals } from '../utils/globals'
import { isDev } from '../utils/is-dev'

const { apiBase } = useGlobals()

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

class FetchError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// Helper function to show error toast messages
function showErrorToast(
  showToast: (msg: string) => void,
  status: number,
  input: RequestInfo | URL
) {
  // Extract the last segment from the input URL
  const urlString =
    input instanceof Request
      ? input.url
      : typeof input === "string"
      ? input
      : input.href
  const url = new URL(urlString)
  const lastSegment =
    url.pathname.split("/").filter(Boolean).pop() || "resource"

  // Construct the base message, including the status if it is not undefined or null
  const baseMessage = `Error${
    status !== undefined && status !== null ? ` (${status})` : ""
  }: An error occurred while retrieving ${lastSegment}.`
  const reportMessage = `Please report this issue to our support team if the problem persists.`

  showToast(`<span>${baseMessage} ${reportMessage}</span>`)
}

export const fetcher = async <T>(
  input: RequestInfo | URL,
  init: RequestInit,
  showToast: (msg: string) => void,
  retries: number = 2, // Default number of retries
  retryDelay: number = 1000 // Default delay between retries in milliseconds
): Promise<T> => {
  let attempt = 0
  while (attempt < retries) {
    try {
      const res = await fetch(input, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        ...(init ?? {}),
      })

      const data = await res.json()

      // Handle specific status codes without retries
      if (res.status === 403) {
        await authService.logout(apiBase)
        throw new FetchError("Unauthorized", res.status)
      }

      if (!res.ok) {
        if (data.errorDetails) {
          console.log(data.errorDetails)
        }
        throw new FetchError("Server Error", res.status)
      }

      return data // Successful fetch
    } catch (error) {
      if (isDev()) {
        console.error(
          `Error encountered for request:`, input, "with init:", init, "Error:", error
        )
      }
      // handle 403 errors without retries and show error toast
      if (
        error instanceof FetchError &&
        error.status === 403
      ) {
        showErrorToast(showToast, error.status, input)
        throw error
      }

      // Check if this is the final attempt
      const isFinalAttempt = attempt === retries - 1
      const statusCode = error instanceof FetchError ? error.status : 0

      // Show error toast on final attempt
      if (isFinalAttempt) {
        showErrorToast(showToast, statusCode, input)
        throw error
      }
      
      // Retry the fetch
      await delay(retryDelay)
      attempt++
    }
  }
  throw new Error("Unexpected error: fetcher failed to return a response.")
}
