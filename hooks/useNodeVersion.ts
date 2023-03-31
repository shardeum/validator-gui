import useSWR from 'swr'
import { fetcher } from './fetcher'
import { NodeVersion } from '../model/node-version'
import { useGlobals } from '../utils/globals'

type NodeVersionResult = {
  isLoading: boolean
  isError: boolean
  update: () => Promise<Response>
  version: NodeVersion | undefined
}

export const useNodeVersion = (): NodeVersionResult => {
  const { apiBase } = useGlobals()
  const { data, error } = useSWR<NodeVersion, Error>(`${apiBase}/api/node/version`, fetcher)

  const update = (): Promise<Response> => {
    return fetcher<Response>(`${apiBase}/api/node/update`, { method: 'POST' })
  }

  return {
    version: data,
    isLoading: !data && !error,
    isError: !!error,
    update,
  }
}
