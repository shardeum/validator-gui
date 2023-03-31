import useSWR from 'swr'
import { fetcher } from './fetcher'
import { NodeNetwork } from '../model/node-network'
import { useGlobals } from '../utils/globals'

type NodeNetworkResponse = {
  network: NodeNetwork | undefined
  isLoading: boolean
  isError: boolean
}

export const useNodeNetwork = (): NodeNetworkResponse => {
  const { apiBase } = useGlobals()
  const { data, error } = useSWR<NodeNetwork, Error>(`${apiBase}/api/node/network`, fetcher, {
    refreshInterval: 1000,
  })

  return {
    network: data,
    isLoading: !data && !error,
    isError: !!error,
  }
}
