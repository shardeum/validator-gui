import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeStatusHistory } from '../model/node-status-history';

export const useNodeStatusHistory = (): { nodeStatusHistory: NodeStatusHistory, isLoading: boolean, isError: boolean } => {
  const {data, error, isLoading} = useSWR(`http://localhost:8080/api/node/status/history`, fetcher)

  return {
    nodeStatusHistory: data,
    isLoading: false,
    isError: false
  }
};
