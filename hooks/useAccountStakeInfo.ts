import useSWR from 'swr';
import { fetcher } from './fetcher';
import { AccountStakeInfo } from '../model/account-stake-info';
import { useGlobals } from '../utils/globals';

export const useAccountStakeInfo = (eoa?: string): { stakeInfo: AccountStakeInfo, isLoading: boolean, isError: boolean } => {
  let data: any | null
  let error: any | null;
  const {apiBase} = useGlobals()
  let isLoading: boolean = false;
  ({
    data,
    error,
    isLoading
  } = useSWR(eoa != null ? `${apiBase}/api/account/${eoa}/stakeInfo` : null, fetcher, {refreshInterval: 1000}));

  return {
    stakeInfo: data,
    isLoading,
    isError: error != null
  }
};
