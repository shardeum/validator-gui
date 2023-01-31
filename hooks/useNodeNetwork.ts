import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeNetwork } from '../model/node-network';
import { httpOrHttps } from '../utils/is-dev';

export const useNodeNetwork = (apiPort: string): { network: NodeNetwork, isLoading: boolean, isError: boolean } => {
  const {data, error, isLoading} = useSWR(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/node/network`, fetcher, {refreshInterval: 1000})

  return {
    network: data,
    isLoading: false,
    isError: false
  }
};
