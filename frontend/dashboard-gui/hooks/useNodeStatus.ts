import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeStatus } from '../model/node-status';

export const useNodeStatus = (): { nodeStatus: NodeStatus, isLoading: boolean, isError: boolean } => {
  const {data, error, isLoading} = useSWR(`http://localhost:3000/api/node/status`, fetcher)

  return {
    nodeStatus: data,
    isLoading: false,
    isError: false
  }
};
