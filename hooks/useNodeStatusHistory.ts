import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeStatusHistory } from '../model/node-status-history';
import { httpOrHttps } from '../utils/is-dev';

export const useNodeStatusHistory = (apiPort: string): { nodeStatusHistory: NodeStatusHistory, isLoading: boolean, isError: boolean } => {
  const {data, error, isLoading} = useSWR(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/node/status/history`, fetcher)

  return {
    nodeStatusHistory: data,
    isLoading: false,
    isError: false
  }
};
