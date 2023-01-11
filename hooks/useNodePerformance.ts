import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodePerformance } from '../model/node-performance';

export const useNodePerformance = (): { performance: NodePerformance[], isLoading: boolean, isError: boolean } => {
  const {data, error, isLoading} = useSWR(`http://localhost:8080/api/node/performance`, fetcher)

  return {
    performance: data,
    isLoading: false,
    isError: false
  }
};
