import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeVersion } from '../model/node-version';

export const useNodeVersion = (): { version: NodeVersion, isLoading: boolean, isError: boolean } => {
  const {data, error, isLoading} = useSWR(`http://localhost:3000/api/node/version`, fetcher)

  return {
    version: data,
    isLoading: false,
    isError: false
  }
};
