import useSWR from 'swr'
import { fetcher } from './fetcher'
import { NodeVersion } from '../model/node-version'
import { useGlobals } from '../utils/globals'
import { useContext } from 'react'
import { FetcherContext } from '../components/FetcherContextProvider'
import { ToastContext } from '../components/ToastContextProvider'

type NodeVersionResult = {
  isLoading: boolean
  isError: boolean
  update: () => Promise<Response>
  version: NodeVersion | undefined
}

export const useNodeVersion = (): NodeVersionResult => {
  const { apiBase } = useGlobals();
  const fetcherFromContext = useContext(FetcherContext)
  const { showErrorMessage } = useContext(ToastContext)

  if (!fetcherFromContext) {
    throw new Error('FetcherContext not provided')
  }

  // Define a custom error handler for useSWR
  const handleError = (error: Error, key: string) => {
    const contextDescription = 'fetching node version';
    showErrorMessage(`Error ${error.message}: An unexpected error occurred while ${contextDescription}. Please report this issue to our support team to investigate and resolve the problem. [<a href="https://github.com/Shardeum/shardeum-bug-reporting/issues" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Report Issue</a>]`)
  }

  const { data, error } = useSWR<NodeVersion, Error>(
    `${apiBase}/api/node/version`,
    (url) => fetcherFromContext(url, undefined, 'fetching node version') as Promise<NodeVersion>, // Explicitly cast the return type
    {
      onError: handleError,
    }
  )

  const update = (): Promise<Response> => {
    return fetcher<Response>(`${apiBase}/api/node/update`, { method: 'POST' }, showErrorMessage)
  }

  return {
    version: data,
    isLoading: !data && !error,
    isError: !!error,
    update,
  }
}
