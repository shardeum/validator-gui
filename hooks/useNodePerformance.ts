import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodePerformance } from '../model/node-performance';
import { useGlobals } from '../utils/globals';

export const useNodePerformance = (): { performance: NodePerformance[], isLoading: boolean, isError: boolean } => {
  const {apiBase} = useGlobals()
  const {data, error, isLoading} = useSWR(`${apiBase}/api/node/performance`, fetcher)

  return {
    performance: data,
    isLoading: false,
    isError: false
  }
};
