import useSWR from 'swr'
import { fetcher } from './fetcher'
import { NodeVersion } from '../model/node-version'
import { useGlobals } from '../utils/globals'
import { useContext } from 'react';
import { FetcherContext } from '../components/FetcherContextProvider';
import { ToastContext } from '../components/ToastContextProvider';

type NodeVersionResult = {
  isLoading: boolean
  isError: boolean
  update: () => Promise<Response>
  version: NodeVersion | undefined
}

export const useNodeVersion = (): NodeVersionResult => {
  const { apiBase } = useGlobals()
  const fetcherWithContext = useContext(FetcherContext);
  const { showErrorMessage } = useContext(ToastContext);
  const { data, error } = useSWR<NodeVersion, Error>(`${apiBase}/api/node/version`, fetcherWithContext)

  const update = (): Promise<Response> => {
    return fetcher<Response>(`${apiBase}/api/node/update`, { method: 'POST' }, showErrorMessage, 'updating node')
  }

  return {
    version: data,
    isLoading: !data && !error,
    isError: !!error,
    update,
  }
}
