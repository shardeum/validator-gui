import useSWR from 'swr'
import { fetcher } from './fetcher'
import { NodeVersion } from '../model/node-version'
import { useGlobals } from '../utils/globals'
import { useContext } from 'react';
import { FetcherContext } from '../components/FetcherContextProvider';
import { showErrorMessage } from './useToastStore';

type NodeVersionResult = {
  isLoading: boolean
  isError: boolean
  update: () => Promise<Response>
  version: NodeVersion | undefined
  publicVersion: NodeVersion | undefined
  isPublicError: boolean
}

export const useNodeVersion = (): NodeVersionResult => {
  const { apiBase } = useGlobals()
  const fetcherWithContext = useContext(FetcherContext);
  const { data, error } = useSWR<NodeVersion, Error>(`${apiBase}/api/node/version`, fetcherWithContext)
  const { data: publicData, error: publicError } = useSWR<NodeVersion, Error>(`${apiBase}/node/version`, fetcherWithContext)

  const update = (): Promise<Response> => {
    return fetcher<Response>(`${apiBase}/api/node/update`, { method: 'POST' }, showErrorMessage)
  }

  return {
    version: data,
    publicVersion: publicData,
    isPublicError: !!publicError,
    isLoading: !data && !error,
    isError: !!error,
    update,
  }
}
