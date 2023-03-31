import useSWR from 'swr'
import { fetcher } from './fetcher'
import { AccountStakeInfo } from '../model/account-stake-info'
import { useGlobals } from '../utils/globals'

type AccountStakeInfoResponse = {
  stakeInfo: AccountStakeInfo | undefined
  isLoading: boolean
  isError: boolean
}

export const useAccountStakeInfo = (eoa?: string): AccountStakeInfoResponse => {
  const { apiBase } = useGlobals()
  const { data, error } = useSWR<AccountStakeInfo, Error>(
    eoa != null ? `${apiBase}/api/account/${eoa}/stakeInfo` : null,
    fetcher,
    { refreshInterval: 1000 }
  )

  return {
    stakeInfo: data,
    isLoading: !data && !error,
    isError: !!error,
  }
}
