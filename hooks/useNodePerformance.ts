import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodePerformance } from '../model/node-performance';

export const useNodePerformance = (apiPort: string): { performance: NodePerformance[], isLoading: boolean, isError: boolean } => {
  const {data, error, isLoading} = useSWR(`http://localhost:${apiPort}/api/node/performance`, fetcher)

  return {
    performance: data,
    isLoading: false,
    isError: false
  }
};
