import { fetcher } from './fetcher'
import { useGlobals } from '../utils/globals';

export const useTXLogs = (): {
  writeUnstakeLog: (data: { tx: any; sender: string; txHash: string }) => void
  writeStakeLog: (data: { tx: any; sender: string; txHash: string }) => void
} => {
  const {apiBase} = useGlobals()
  const writeStakeLog = async (data: { tx: any; sender: string; txHash: string }) => {
    try {
      await fetcher(`${apiBase}/api/log/stake`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (e) {
      console.error(e)
    }
  }

  const writeUnstakeLog = async (data: { tx: any; sender: string; txHash: string }) => {
    try {
      await fetcher(`${apiBase}/api/log/unstake`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    writeUnstakeLog,
    writeStakeLog,
  }
}
