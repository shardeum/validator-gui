import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeStatus } from '../model/node-status';

export const useNodeStatus = (apiPort: string): { nodeStatus: NodeStatus, startNode: () => void, stopNode: () => void, isLoading: boolean, isError: boolean } => {

  const {data, error, isLoading} = useSWR(`http://localhost:${apiPort}/api/node/status`, fetcher, { refreshInterval: 1000 })

  const startNode = () => {
    fetch(`http://localhost:${apiPort}/api/node/start`, {method: 'POST'})
  }

  const stopNode = () => {
    fetch(`http://localhost:${apiPort}/api/node/stop`, {method: 'POST'})
  }

  return {
    nodeStatus: data,
    startNode,
    stopNode,
    isLoading: false,
    isError: false
  }
};
