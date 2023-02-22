import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeAlert } from '../model/node-alert';
import { useGlobals } from '../utils/globals';

export const useNodeAlerts = (): { alerts: NodeAlert[], isLoading: boolean, isError: boolean } => {
  const {apiBase} = useGlobals()
  const {data, error, isLoading} = useSWR(`${apiBase}/api/node/alerts`, fetcher)

  return {
    alerts: data,
    isLoading: false,
    isError: false
  }
};
