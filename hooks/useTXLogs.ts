import { fetcher } from './fetcher'
import { useGlobals } from '../utils/globals'
import { useContext } from 'react';
import { ToastContext } from '../components/ToastContextProvider';

type TXLogsResponse = {
  writeUnstakeLog: Function
  writeStakeLog: Function
}

export const useTXLogs = (): TXLogsResponse => {
  const { apiBase } = useGlobals()
  const { showErrorMessage } = useContext(ToastContext);
  const writeStakeLog = async (data: string): Promise<void> => {
    try {
      await fetcher(`${apiBase}/api/log/stake`, {
        method: 'POST',
        body: data,
      }, showErrorMessage)
    } catch (e) {
      console.error(e)
    }
  }

  const writeUnstakeLog = async (data: string): Promise<void> => {
    try {
      await fetcher(`${apiBase}/api/log/unstake`, {
        method: 'POST',
        body: data,
      }, showErrorMessage)
    } catch (e) {
      console.error(e)
    }
  }

  return {
    writeUnstakeLog,
    writeStakeLog,
  }
}
