import useSWR from 'swr'
import { fetcher } from './fetcher'
import { NodeStatus } from '../model/node-status'
import { useContext, useState } from 'react'
import { useGlobals } from '../utils/globals'
import { FetcherContext } from '../components/FetcherContextProvider';
import { showErrorMessage } from './useToastStore'

type NodeStatusResponse = {
  nodeStatus: NodeStatus | undefined;
  startNode: Function;
  stopNode: Function;
  isLoading: boolean;
}

export const useNodeStatus = (): NodeStatusResponse => {
  const { apiBase } = useGlobals()
  const nodeStatusApi = `${apiBase}/api/node/status`
  const fetcherWithContext = useContext(FetcherContext);
  const { data, mutate } = useSWR<NodeStatus>(nodeStatusApi, fetcherWithContext, { refreshInterval: 1000 })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const startNode = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await fetcher(`${apiBase}/api/node/start`, { method: 'POST' }, showErrorMessage)
      await mutate(await fetcher(nodeStatusApi, {}, showErrorMessage))
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false)
  }

  const stopNode = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await fetcher(`${apiBase}/api/node/stop`, { method: 'POST' }, showErrorMessage)
      await mutate(await fetcher(nodeStatusApi, {}, showErrorMessage))
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
}


// RESTART SERVICES WITH A NEW NODE AND TEST IF NODE STATES ARE UPDATING IN THE GUI ALONGSIDE THEIR TOOLTIPS