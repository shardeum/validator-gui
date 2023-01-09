import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeAlert } from '../model/node-alert';

export const useNodeAlerts = (): { alerts: NodeAlert[], isLoading: boolean, isError: boolean } => {
  const {data, error, isLoading} = useSWR(`http://localhost:8080/api/node/alerts`, fetcher)

  return {
    alerts: data,
    isLoading: false,
    isError: false
  }
};
