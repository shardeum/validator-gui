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
}

const nodeVersionDataKey = 'nodeVersionData';
let data: NodeVersion | undefined;
let error: Error | undefined;
let lastUpdatedAt: Date;

export const useNodeVersion = (isPublic: boolean = false): NodeVersionResult => {
  const { apiBase } = useGlobals()
  const fetcherWithContext = useContext(FetcherContext);

  let hasExpired = true;
  if (lastUpdatedAt) {
    hasExpired = (lastUpdatedAt.getTime() - (new Date()).getTime()) >= (1000 * 3600 * 24 * 2); // gte 2 days
  }

  if (!data || hasExpired) {
    if (!isPublic) {
      const publicVersion = useSWR<NodeVersion, Error>(`${apiBase}/node/version`, fetcherWithContext)
      data = publicVersion.data;
      error = publicVersion.error;
      lastUpdatedAt = new Date();
    }
    else {
      const authVersion = useSWR<NodeVersion, Error>(`${apiBase}/api/node/version`, fetcherWithContext)
      data = authVersion.data;
      error = authVersion.error;
      lastUpdatedAt = new Date();
    }
  }

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
