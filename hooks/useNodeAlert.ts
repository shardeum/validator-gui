import useSWR from 'swr'
import { fetcher } from './fetcher'
import { NodeAlert } from '../model/node-alert'
import { useGlobals } from '../utils/globals'

type NodeAlertsResponse = {
  alerts: NodeAlert[] | undefined
  isLoading: boolean
  isError: boolean
}

export const useNodeAlerts = (): NodeAlertsResponse => {
  const { apiBase } = useGlobals()
  const { data, error } = useSWR<NodeAlert[], Error>(`${apiBase}/api/node/alerts`, fetcher)

  return {
    alerts: data,
    isLoading: !data && !error,
    isError: !!error,
  }
}
