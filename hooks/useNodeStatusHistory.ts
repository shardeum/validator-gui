import useSWR from 'swr'
import { fetcher } from './fetcher'
import { NodeStatusHistory } from '../model/node-status-history'
import { useGlobals } from '../utils/globals'

type NodeStatusHistoryResult = {
  nodeStatusHistory: NodeStatusHistory | undefined
  isLoading: boolean
  isError: boolean
}

export const useNodeStatusHistory = (): NodeStatusHistoryResult => {
  const { apiBase } = useGlobals()
  const { data, error } = useSWR<NodeStatusHistory, Error>(`${apiBase}/api/node/status/history`, fetcher)

  return {
    nodeStatusHistory: data,
    isLoading: !data && !error,
    isError: !!error,
  }
}
