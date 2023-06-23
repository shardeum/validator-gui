import useSWR from 'swr'
import { NodeAlert } from '../model/node-alert'
import { useGlobals } from '../utils/globals'
import { FetcherContext } from '../components/FetcherContextProvider';
import { useContext } from 'react';

type NodeAlertsResponse = {
  alerts: NodeAlert[] | undefined
  isLoading: boolean
  isError: boolean
}

export const useNodeAlerts = (): NodeAlertsResponse => {
  const { apiBase } = useGlobals()
  const fetcher = useContext(FetcherContext);
  const { data, error } = useSWR<NodeAlert[], Error>(`${apiBase}/api/node/alerts`, fetcher)

  return {
    alerts: data,
    isLoading: !data && !error,
    isError: !!error,
  }
}
