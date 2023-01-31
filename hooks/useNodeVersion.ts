import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeVersion } from '../model/node-version';
import { httpOrHttps } from '../utils/is-dev';

export const useNodeVersion = (apiPort: string): {
  isLoading: boolean;
  isError: boolean;
  update: () => Promise<Response>;
  version: NodeVersion
} => {
  const {
    data,
    error,
    isLoading
  } = useSWR(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/node/version`, fetcher)

  const update = () => {
    return fetcher(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/node/update`, {method: 'POST'})
  }

  return {
    version: data,
    isLoading: false,
    isError: false,
    update
  }
};
