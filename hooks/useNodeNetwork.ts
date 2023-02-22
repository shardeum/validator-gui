import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeNetwork } from '../model/node-network';
import { useGlobals } from '../utils/globals';

export const useNodeNetwork = (): { network: NodeNetwork, isLoading: boolean, isError: boolean } => {
  const {apiBase} = useGlobals()
  const {data, error, isLoading} = useSWR(`${apiBase}/api/node/network`, fetcher, {refreshInterval: 1000})

  return {
    network: data,
    isLoading: false,
    isError: false
  }
};
