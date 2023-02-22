import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeVersion } from '../model/node-version';
import { useGlobals } from '../utils/globals';

export const useNodeVersion = (): {
  isLoading: boolean;
  isError: boolean;
  update: () => Promise<Response>;
  version: NodeVersion
} => {
  const {apiBase} = useGlobals()
  const {
    data,
    error,
    isLoading
  } = useSWR(`${apiBase}/api/node/version`, fetcher)

  const update = () => {
    return fetcher(`${apiBase}/api/node/update`, {method: 'POST'})
  }

  return {
    version: data,
    isLoading: false,
    isError: false,
    update
  }
};
