import useSWR from 'swr'
import { fetcher } from './fetcher'
import { authService } from '../services/auth.service'
import { useGlobals } from '../utils/globals'

type NodeLogsResponse = {
  isLoading: boolean
  isError: boolean
  logs: string[] | undefined
  downloadLog: Function
}

export const useNodeLogs = (): NodeLogsResponse => {
  const { apiBase } = useGlobals()

  const { data, error } = useSWR<string[], Error>(`${apiBase}/api/node/logs`, fetcher)

  const downloadLog = (logName: string): void => {
    fetch(`${apiBase}/api/node/logs/${logName}`, {
      method: 'GET',
      headers: { 'X-Api-Token': authService.authToken! },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', logName)
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
      })
  }

  return {
    logs: data,
    isLoading: !data && !error,
    isError: !!error,
    downloadLog,
  }
}
