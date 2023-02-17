import { fetcher } from './fetcher'
import { httpOrHttps } from '../utils/is-dev'

export const useTXLogs = (
  apiPort: string
): {
  writeUnstakeLog: (data: { tx: any; sender: string; txHash: string }) => void
  writeStakeLog: (data: { tx: any; sender: string; txHash: string }) => void
} => {
  const writeStakeLog = async (data: { tx: any; sender: string; txHash: string }) => {
    try {
      await fetcher(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/log/stake`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (e) {
      console.error(e)
    }
  }

  const writeUnstakeLog = async (data: { tx: any; sender: string; txHash: string }) => {
    try {
      await fetcher(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/log/unstake`, {
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
