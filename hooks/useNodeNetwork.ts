import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeNetwork } from '../model/node-network';

export const useNodeNetwork = (apiPort: string): { network: NodeNetwork, isLoading: boolean, isError: boolean } => {
  const {data, error, isLoading} = useSWR(`http://${globalThis.window?.location.hostname}:${apiPort}/api/node/network`, fetcher)

  return {
    network: data,
    isLoading: false,
    isError: false
  }
};
