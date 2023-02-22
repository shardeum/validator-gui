import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeStatusHistory } from '../model/node-status-history';
import { useGlobals } from '../utils/globals';

export const useNodeStatusHistory = (): { nodeStatusHistory: NodeStatusHistory, isLoading: boolean, isError: boolean } => {
  const {apiBase} = useGlobals()
  const {data, error, isLoading} = useSWR(`${apiBase}/api/node/status/history`, fetcher)

  return {
    nodeStatusHistory: data,
    isLoading: false,
    isError: false
  }
};
