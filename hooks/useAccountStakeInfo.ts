import useSWR from 'swr';
import { fetcher } from './fetcher';
import { AccountStakeInfo } from '../model/account-stake-info';

export const useAccountStakeInfo = (apiPort: string, eoa?: string): { stakeInfo: AccountStakeInfo, isLoading: boolean, isError: boolean } => {
  let data: any | null
  let error: any | null;
  let isLoading: boolean = false;

  if (eoa != null) {
    ({
      data,
      error,
      isLoading
    } = useSWR(`http://${globalThis.window?.location.hostname}:${apiPort}/api/account/${eoa}/stakeInfo`, fetcher, {refreshInterval: 1000}));
  }

  return {
    stakeInfo: data,
    isLoading,
    isError: error != null
  }
};
