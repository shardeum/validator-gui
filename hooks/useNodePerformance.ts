import useSWR from 'swr'
import { fetcher } from './fetcher'
import { NodePerformance } from '../model/node-performance'
import { useGlobals } from '../utils/globals'

type NodePerformanceResult = {
  performance: NodePerformance[] | undefined
  isLoading: boolean
  isError: boolean
}

export const useNodePerformance = (): NodePerformanceResult => {
  const { apiBase } = useGlobals()
  const { data, error } = useSWR<NodePerformance[], Error>(`${apiBase}/api/node/performance`, fetcher)

  return {
    performance: data,
    isLoading: !data && !error,
    isError: !!error,
  }
}
