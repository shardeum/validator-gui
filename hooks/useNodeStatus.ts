import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeStatus } from '../model/node-status';
import { useState } from 'react';
import { useGlobals } from '../utils/globals';

export const useNodeStatus = (): { nodeStatus: NodeStatus, startNode: () => void, stopNode: () => void, isLoading: boolean } => {
  const {apiBase} = useGlobals()
  const nodeStatusApi = `${apiBase}/api/node/status`;
  const {data, mutate} = useSWR(nodeStatusApi, fetcher, {refreshInterval: 1000})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const startNode = async () => {
    setIsLoading(true)
    try {
      await fetcher(`${apiBase}/api/node/start`, {method: 'POST'})
      await mutate(await fetcher(nodeStatusApi))
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  const stopNode = async () => {
    setIsLoading(true)
    try {
      await fetcher(`${apiBase}/api/node/stop`, {method: 'POST'})
      await mutate(await fetcher(nodeStatusApi))
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  return {
    nodeStatus: data,
    startNode,
    stopNode,
    isLoading
  }
};
