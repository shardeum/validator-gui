import useSWR from 'swr';
import { fetcher } from './fetcher';
import { AccountStakeInfo } from '../model/account-stake-info';
import { httpOrHttps } from '../utils/is-dev';

export const useAccountStakeInfo = (apiPort: string, eoa?: string): { stakeInfo: AccountStakeInfo, isLoading: boolean, isError: boolean } => {
  let data: any | null
  let error: any | null;
  let isLoading: boolean = false;
  ({
    data,
    error,
    isLoading
  } = useSWR(eoa != null ? `${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/account/${eoa}/stakeInfo` : null, fetcher, {refreshInterval: 1000}));

  return {
    stakeInfo: data,
    isLoading,
    isError: error != null
  }
};
