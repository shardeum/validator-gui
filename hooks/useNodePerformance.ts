import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodePerformance } from '../model/node-performance';
import { httpOrHttps } from '../utils/is-dev';

export const useNodePerformance = (apiPort: string): { performance: NodePerformance[], isLoading: boolean, isError: boolean } => {
  const {data, error, isLoading} = useSWR(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/node/performance`, fetcher)

  return {
    performance: data,
    isLoading: false,
    isError: false
  }
};
